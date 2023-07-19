import Usuario from "../models/UserModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";
import Disponibilidad from "../models/AvailableModel.js";
import Reserva from "../models/BookingModel.js";
import obtenerDisponibilidad from "../helpers/obtenerDisponibilidad.js";

//reservaRoutes.post("/", checkAuth, obtenerProEspecialidadFechaHora);
const obtenerProEspecialidadFechaHora = async (req, res) => {
  const { fecha, citaHora, especialidad, localidad } = req.body;
  let profesionalesDisponibles = [];

  try {
    const profesionales = await Disponibilidad.find({ fecha })
      .populate({
        path: "creador",
        match: {
          especialidad: { $in: [especialidad] },
          localidadesLaborales: { $in: [localidad] },
        },
        populate: { path: "disponibilidad", path: "creador" },
      })
      .lean();

    let buscarPorfesionales = profesionales.filter(
      (profesionalState) => profesionalState.creador !== null
    );

    if (buscarPorfesionales.length > 0) {
      try {
        profesionalesDisponibles = await obtenerDisponibilidad(
          buscarPorfesionales,
          citaHora
        );

        //console.log(profesionalesDisponibles)

        if (profesionalesDisponibles.length <= 0) {
          return res.status(200).json({
            msg: "No encontramos disponibilidad para la hora indica intenta nuevamente",
          });
        }

        return res.status(200).json(profesionalesDisponibles);
      } catch (err) {
        console.log(err);
      }
    }

    res.status(200).json({
      msg: "No encontramos disponibilidad para la fecha indica intenta nuevamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "hubo problema intentando acceder a los profesionales" });
  }
};

//"/profesionales/fecha",
const obtenerProfesionalesPorFecha = async (req, res) => {
  const { fecha, especialidad, localidad } = req.body;

  try {
    const profesionales = await Disponibilidad.find({ fecha })
    .populate({
      path: "creador",
      match: {
        especialidad: { $in: especialidad },
        localidadesLaborales: { $in: [localidad] },
        creador: { $exists: true },
      },
      select: "descripcion creador img",
      populate: {
        path: "creador",
        select: "nombre apellido telefono",
      },
    })
    .lean();

      console.log(profesionales)

    let buscarPorfesionales = profesionales.filter(
      (profesionalState) => profesionalState.creador !== null
    );

    if (buscarPorfesionales.length <= 0) {
      return res.status(200).json({
        msg: "No encontramos profesionales con disponibilidad para la fecha indicada intenta nuevamente",
      });
    }

    console.log(buscarPorfesionales)

    return res.status(200).json(buscarPorfesionales);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "hubo problema intentando acceder a los profesionales" });
  }
};

//"/profesional/horario/:id",
const obtenerHorariosProfesional = async (req, res) => {
  const { id } = req.params;
  const { fecha } = req.body;

  try {
    const profesionales = await Disponibilidad.findOne({
      fecha,
      creador: id,
    });

    return res.status(200).json(profesionales);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "hubo problema intentando acceder a los profesionales" });
  }
};

const obtenerProfesional = async (req, res) => {
  const { id } = req.params;

  const profesional = await PerfilProfesional.findById(id).populate(
    "creador",
    "nombre apellido img descripcion"
  );

  res.json(profesional);
};

//"/crear/:id",
const crearReserva = async (req, res) => {
  const { _id } = req.usuario;
  const { id } = req.params;

  let { citaDia, citaHora, servicio } = req.body;

  try {
    // Comprobar si el usuario existe
    const usuario = await Usuario.findById({ _id });

    const profesionalID = await PerfilProfesional.findById(id);
    if (!usuario) {
      const error = new Error("El usuario no esta registrado");
      return res.status(404).json({ msg: error.message });
    }

    const nuevaReserva = {
      servicio,
      citaDia,
      citaHora,
      cliente: _id,
      profesional: id,
    };

    const reserva = await Reserva.create(nuevaReserva);

    usuario.reservas.push(reserva);
    profesionalID.reservas.push(reserva);

    await usuario.save();
    await profesionalID.save();

    return res.status(200).json({
      message: "Reserva creada satisfactoriamente",
      data: reserva,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "La reserva no pudo ser creada" });
  }
};

//reservaRoutes.get("/", [checkAuth, isAdminRole], listarReservas);
const listarReservas = async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;
  const query = {};

  try {
    const [total, reservas] = await Promise.all([
      Reserva.countDocuments(query),
      Reserva.find(query)
        .skip(Number(limite * (pagina - 1)))
        .limit(Number(limite))
        .populate("cliente"),
    ]);

    res.json({
      totalReservas: total,
      paginaActual: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      resultados: reservas,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error intentando acceder a las reservas" });
  }
};

//reservaRoutes.delete("/:id", checkAuth, eliminarReserva);
const eliminarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      const error = new Error("Reserva no Encontrado");
      return res.status(401).json({ msg: error.message });
    }

    if (
      reserva.cliente.toString() !== req.usuario._id.toString() &&
      req.usuario.rol !== "ADMIN"
    ) {
      const error = new Error("Accion no válida");
      return res.status(401).json({ msg: error.message });
    }

    await Reserva.deleteOne();

    res.status(201).json({ msg: "Reserva eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error intentando eliminar la reserva" });
  }
};

// const disponibles = async (req, res) => {
//   let profesionalesPorFecha = [];
//   console.log(profesionalesPorFecha);
//   try {
//     const profesionales = await PerfilProfesional.find({
//       especialidad,
//     })
//       .populate("creador", "nombre apellido img descripcion")
//       .populate("disponibilidad", "fecha");

//     for (let i = 0; i < profesionales.length; i++) {
//       for (let j = 0; j < profesionales[i].disponibilidad.length; j++) {
//         if (profesionales[i].disponibilidad[j].fecha === fecha) {
//           const data = {
//             id: profesionales[i].creador._id,
//             nombre: profesionales[i].creador.nombre,
//             apellido: profesionales[i].creador.apellido,
//             img: profesionales[i].creador.img,
//             descripcion: profesionales[i].descripcion,
//             profesional_id: profesionales[i]._id,
//           };

//           profesionalesPorFecha.push(data);
//         }
//       }
//     }
//     console.log(profesionalesPorFecha);

//     res.json(disponibles);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ msg: "no hay profesionales disponibles para esa fecha" });
//   }
// };

export {
  obtenerProEspecialidadFechaHora,
  obtenerProfesional,
  crearReserva,
  listarReservas,
  eliminarReserva,
  obtenerProfesionalesPorFecha,
  obtenerHorariosProfesional,
  // disponibles,
};

import Usuario from "../models/UserModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";
import Disponibilidad from "../models/AvailableModel.js";
import Reserva from "../models/BookingModel.js";

const buscarPerfil = async (id) => {
  const profesional = await PerfilProfesional.findOne({
    creador: id,
  }).populate("reservas");
  return profesional;
};

const actualizarProfesional = async (req, res) => {
  const { _id } = req.usuario;
  console.log("usuario", req.usuario);
  console.log("body", req.body);
  const { descripcion, especialidades, localidades } = req.body;
  try {
    console.log("usuario", req.usuario);
    console.log("body", req.body);
    // Comprobar si el usuario existe
    const profesional = buscarPerfil(_id);

    if (!profesional) {
      const error = new Error("El usuario no esta registrado pro linea 20");
      return res.status(404).json({ msg: error.message });
    }

    if (descripcion) {
      profesional.descripcion = descripcion;
    }

    if (especialidades && especialidades.length > 0) {
      profesional.especialidad =
        especialidades.map((especialidad) => especialidad) ||
        profesional.especialidad;
    }

    if (localidades && localidades.length > 0) {
      profesional.localidadesLaborales =
        localidades.map((localidad) => localidad) ||
        profesional.localidadesLaborales;
    }

    await profesional.save();

    res.json({
      msg: "Perfil profesional actualizado correctamente",
      profesional,
    });
  } catch (error) {
    console.log(error);
  }
};

const obtenerDisponibilidadTotal = async (req, res) => {
  try {
    const profesionales = await Disponibilidad.find()
      .populate({
        path: "creador",
        populate: { path: "creador" },
      })
      .sort({ fecha: 1 })
      .lean();
    console.log(profesionales, "disponibilidades");

    const fechaActual = new Date();
    const fechaLimite = new Date(fechaActual.getTime() + 5 * 60 * 60 * 1000);

    const profesionalesFiltrados = profesionales.filter((profesional) => {
      return (
        profesional.creador !== null &&
        profesional.creador.especialidad !== null &&
        profesional.creador.localidadesLaborales !== null &&
        profesional.horarios.length > 0 &&
        new Date(profesional.fecha) > fechaLimite
      );
    });

    if (profesionalesFiltrados.length === 0) {
      return res.status(200).json({
        msg: "No encontramos profesionales con disponibilidad para la fecha indicada. Por favor, intenta nuevamente.",
      });
    }
    const disponibilidadTotal = profesionalesFiltrados.map((profesional) => {
      const horariosDisponibles = profesional.horarios.filter((horario) => {
        return horario.stock === true;
      });

      return {
        ...profesional,
        disponibilidad: horariosDisponibles,
      };
    });

    return res.status(200).json(disponibilidadTotal);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hubo un problema intentando acceder a los profesionales.",
    });
  }
};

const actualizarProfesionalAdmin = async (req, res) => {
  const { _id } = req.body;
  // console.log("usuario", req.usuario);
  // console.log("body", req.body);
  const { descripcion, especialidades, localidades } = req.body;
  try {
    // console.log("usuario", req.usuario);
    // console.log("body", req.body);
    // Comprobar si el usuario existe
    const profesional = await PerfilProfesional.findOne({
      creador: _id,
    }).populate("reservas");

    if (!profesional) {
      const error = new Error("El usuario no esta registrado pro linea 20");
      return res.status(404).json({ msg: error.message });
    }

    if (descripcion) {
      profesional.descripcion = descripcion;
    }

    if (especialidades && especialidades.length > 0) {
      profesional.especialidad =
        especialidades.map((especialidad) => especialidad) ||
        profesional.especialidad;
    }

    if (localidades && localidades.length > 0) {
      profesional.localidadesLaborales =
        localidades.map((localidad) => localidad) ||
        profesional.localidadesLaborales;
    }

    await profesional.save();

    res.json({
      msg: "Perfil profesional actualizado correctamente",
      profesional,
    });
  } catch (error) {
    console.log(error);
  }
};

const perfilProfesional = async (req, res) => {
  const { _id } = req.usuario;

  try {
    const profesional = await PerfilProfesional.findOne({
      creador: _id,
    })
      .populate("creador", "nombre")
      .populate({
        path: "disponibilidad",
        select: "-creador -createdAt -updatedAt",
      })
      .populate("reservas");

    //    console.log(profesional);
    if (!profesional) {
      const error = new Error("El usuario no esta registrado pro line 67");
      return res.status(404).json({ msg: error.message });
    }

    res.json({
      profesional,
      img: req.usuario.img,
    });
  } catch (error) {
    console.log(error);
  }
};

const GetPerfilProfesional = async (req, res) => {
  const { id } = req.params;

  try {
    const profesional = await Usuario.findOne({
      _id: id,
    }).populate({
      path: "profesional",
      populate: {
        path: "reservas",
      },
    });

    if (!profesional) {
      const error = new Error("El usuario no esta registrado pro linea 94");
      return res.status(404).json({ msg: error.message });
    }

    res.json(profesional);
  } catch (error) {
    console.log(error);
  }
};

const GetPerfilProfesionalID = async (req, res) => {
  const { id } = req.params;
  try {
    const profesional = await PerfilProfesional.findOne({
      _id: id,
    }).populate("disponibilidad");

    if (!profesional) {
      const error = new Error(
        "El profesional no esta registrado profesional linea 112"
      );
      return res.status(404).json({ msg: error.message });
    }

    res.json(profesional);
  } catch (error) {
    console.log(error);
  }
};

const perfilReferido = async (req, res) => {
  const { _id } = req.usuario;

  try {
    const profesional = await PerfilProfesional.findOne({
      creador: _id,
    })
      .select(
        "-disponibilidad -especialidad -descripcion -img -creador -localidadesLaborales -preferencias -updatedAt -reservas"
      )
      .populate("referidos");

    if (!profesional) {
      const error = new Error("El usuario no esta registrado pro linea 135");
      return res.status(404).json({ msg: error.message });
    }

    res.json(profesional);
  } catch (error) {
    console.log(error);
  }
};

const crearDisponibilidad = async (req, res) => {
  // console.log("crear disponibilidad api/profesional", req.body);
  // console.log("req.usuario.profesional", req.usuario.profesional);
  const { fecha, horarios } = req.body;

  try {
    const profesional = await PerfilProfesional.findById(
      req.usuario.profesional
    );
    // console.log("profesional", profesional);
    //console.log(fecha, horarios, profesional._id);

    const actualizaDisponibilidad = await Disponibilidad.findOne(
      { fecha, creador: profesional._id },
      { new: true }
    );

    if (actualizaDisponibilidad) {
      const updateDisponibilidad = await Disponibilidad.updateOne(
        { fecha, creador: profesional._id },
        { $set: { fecha, horarios, creador: profesional._id } }
      );

      res.json({
        msg: "Disponibilidad actualizada",
        disponibilidad: updateDisponibilidad,
      });
      return;
    }

    const nuevaDisponibilidad = new Disponibilidad({
      fecha,
      horarios,
      creador: profesional._id,
    });

    await nuevaDisponibilidad.save();
    profesional.disponibilidad.push(nuevaDisponibilidad._id);
    await profesional.save();

    res.json({
      msg: "Disponibilidad agregada",
    });
  } catch (err) {
    console.log(err);
  }
};

const obtenerDisponibilidad = async (req, res) => {
  const { fecha } = req.params;

  //console.log(fecha);

  try {
    const disponibilidad = await Disponibilidad.findOne({
      fecha,
      creador: req.usuario.profesional._id,
    });

    res.json(disponibilidad);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Error intentado acceder a la informacion" });
  }
};

const editarDisponibilidad = async (req, res) => {
  const { id } = req.params;
  const { hora } = req.body;
  try {
    const disponibilidad = await Disponibilidad.findById(id);
    if (!disponibilidad) {
      const error = new Error("No Encontrado");
      return res.status(401).json({ msg: error.message });
    }
    if (
      disponibilidad.creador.toString() !== req.usuario.profesional.toString()
    ) {
      const error = new Error("Accion no válida");
      return res.status(401).json({ msg: error.message });
    }

    disponibilidad.hora = hora || disponibilidad.hora;

    const disponibilidadActualizada = await disponibilidad.save();

    res.json({
      msg: "Actualizado correctamente",
      disponibilidadActualizada,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error intentado acceder a la informacion" });
  }
};

const eliminarDisponibilidad = async (req, res) => {
  const { id } = req.params;
  try {
    const disponibilidad = await Disponibilidad.findById(id);
    if (!disponibilidad) {
      const error = new Error("No Encontrado");
      return res.status(401).json({ msg: error.message });
    }
    if (
      disponibilidad.creador.toString() !== req.usuario.profesional.toString()
    ) {
      const error = new Error("Accion no válida");
      return res.status(401).json({ msg: error.message });
    }

    await disponibilidad.deleteOne();

    //eliminamos el id del array del perfil profesional
    const Profesional = await PerfilProfesional.findById(
      req.usuario.profesional
    );

    const disponibilidadesRestantes = Profesional.disponibilidad.filter(
      (disponibilidad) => disponibilidad.toString() !== id.toString()
    );
    Profesional.disponibilidad = disponibilidadesRestantes;

    Profesional.save();

    res.json({
      msg: "Disponibilidad eliminada correctamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error intentado acceder a la informacion" });
  }
};

const obtenerHistorial = async (req, res) => {
  const { id } = req.params;

  try {
    const profesional = await PerfilProfesional.findOne({ _id: id }).populate(
      "reservas"
    );

    res.json(profesional.reservas);
  } catch (error) {
    console.log(error);
  }
};

const obtenerIDSReferidos = async (req, res) => {
  try {
    const IDsReferidos = await PerfilProfesional.find();

    res.json(IDsReferidos);
  } catch (error) {
    console.log(error);
  }
};

export {
  perfilProfesional,
  obtenerDisponibilidadTotal,
  actualizarProfesional,
  actualizarProfesionalAdmin,
  crearDisponibilidad,
  editarDisponibilidad,
  eliminarDisponibilidad,
  obtenerDisponibilidad,
  obtenerHistorial,
  perfilReferido,
  obtenerIDSReferidos,
  GetPerfilProfesional,
  GetPerfilProfesionalID,
};

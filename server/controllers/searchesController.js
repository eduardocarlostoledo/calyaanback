import Usuario from "../models/UserModel.js";
import Producto from "../models/ProductModel.js";
import Orden from "../models/OrderModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";
import Disponibilidad from "../models/AvailableModel.js";

const obtenerAll = async (req, res) => {
  try {

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    //const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const Users = await Usuario.countDocuments();
    const CUsers = await Usuario.countDocuments({ rol: "CLIENTE" });
    const AUsers = await Usuario.countDocuments({ rol: "ADMIN" });
    const PUsers = await Usuario.countDocuments({ rol: "PROFESIONAL" });
    const newUsers = await Usuario.countDocuments({ createdAt: { $gte: lastWeek } });
    const UInactivos = await Usuario.countDocuments({ ultimaConexion: { $lt: oneMonthAgo } });
    const PInactivos = await Usuario.countDocuments({ ultimaConexion: { $lt: lastWeek } });
    const services = await Producto.countDocuments();
    const Reservas = await Orden.countDocuments();
    const Preservas = await Orden.countDocuments({ estadoPago: 'pending' });
    const PagosAprobados = await Orden.countDocuments({ estadoPago: 'approved' });
    const RProceso = await Orden.countDocuments({ estadoServicio: 'Pendiente' });
    
    let response = {
      AUsers,
      Users,
      CUsers,
      PUsers,
      newUsers,
      UInactivos,
      PInactivos,
      services,
      Reservas,
      Preservas,
      PagosAprobados,
      RProceso
    }

    res.status(200).json(response)

  } catch (err) {
    console.log(err)
  }
};

const buscarUsuarios = async (req, res) => {
  const { termino } = req.params;
  const { limite = 10, pagina = 1 } = req.query;

  const queryStr = { ...req.query };
  let excluirCampos = ["pagina", "limite"];
  excluirCampos.forEach((element) => delete queryStr[element]);

  const regex = new RegExp(termino, "i");

  const criteria = {
    $or: [
      { nombre: regex },
      { apellido: regex },
      { email: regex },
      { rol: regex },
      { telefono: regex },
    ],
    $and: [queryStr],
  };

  try {
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(criteria),
      Usuario.find(criteria)
        .skip(Number(limite * (pagina - 1)))
        .limit(Number(limite)),
    ]);

    res.json({
      totalUsuarios: total,
      paginaActual: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      resultados: usuarios,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
  }
};

const obtenerUsuarios = async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;

  const queryStr = { ...req.query };
  let excluirCampos = ["pagina", "limite"];
  excluirCampos.forEach((element) => delete queryStr[element]);

  try {
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(queryStr),
      Usuario.find(queryStr)
        .skip(Number(limite * (pagina - 1)))
        .limit(Number(limite)),
    ]);

    res.json({
      totalUsuarios: total,
      paginaActual: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      resultados: usuarios,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
  }
};

const obtenerOrdenes = async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;

  const queryStr = { ...req.query };
  let excluirCampos = ["pagina", "limite"];
  excluirCampos.forEach((element) => delete queryStr[element]);

  try {
    const [total, usuarios] = await Promise.all([
      Orden.countDocuments(queryStr),
      Orden.find(queryStr)
        .skip(Number(limite * (pagina - 1)))
        .limit(Number(limite))
        .sort({ createdAt: -1 })
        .populate("cliente_id")
        .populate({ path: "servicios", select: "_id idWP nombre precio link img" })
        .populate({
          path: "profesional_id",
          select: "creador",
          populate: {
            path: "creador",
            select: "_id nombre img apellido telefono img",
          },
        })
        
          
    ]);

    res.json({
      totalUsuarios: total,
      paginaActual: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      resultados: usuarios,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
  }
};

// const obtenerOrdenesBusquedaReservas = async (req, res) => {
//   console.log(req.query);
//   try {
//     let { clienteNombre, emailCliente, profesionalNombre, diaCompra, horaReserva, diaReserva } = req.query;

//     let resultados;

//     if (clienteNombre) {
//       const clienteNombreArray = clienteNombre?.split(/\s+/);      
//       const nombre = clienteNombreArray[0].toString();
//       const apellido = clienteNombreArray.length > 1 ? clienteNombreArray[1].toString() : "";

//       console.log(nombre, apellido);

//       resultados = await Orden.find({ nombre, apellido})
//         .sort({ createdAt: 1 })
//         .populate({
//           path: "cliente_id",
//           select: "nombre apellido email",
//         })
//         .populate({
//           path: "profesional_id",
//           select: "creador",
//           populate: {
//             path: "creador",
//             select: "nombre apellido",
//           },
//         })
//         .populate({
//           path: "servicios",
//           select: "nombre",
//         });
//     }

//     if (profesionalNombre) {
//       const profesionalNombreArray = profesionalNombre?.split(/\s+/);
//       profesionalNombre = profesionalNombreArray[0].toString();
//       const profesionalApellido = profesionalNombreArray.length > 1 ? profesionalNombreArray[1].toString() : "";

//       resultados = await Orden.find({
//         'profesional_id.creador.nombre': profesionalNombre,
//         'profesional_id.creador.apellido': profesionalApellido,       
//       })
//         .sort({ createdAt: 1 })
//         .populate({
//           path: "cliente_id",
//           select: "nombre apellido email",
//         })
//         .populate({
//           path: "profesional_id",
//           select: "creador",
//           populate: {
//             path: "creador",
//             select: "nombre apellido",
//           },
//         })
//         .populate({
//           path: "servicios",
//           select: "nombre",
//         });
//     }

//     res.json({
//       resultados,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
//   }
// };

const obtenerOrdenesBusquedaReservas = async (req, res) => {  
  console.log(req.query)
    try {      
      const { emailCliente, horaReserva, diaReserva, servicio } = req.query;

      const orden = await Orden.find({"cliente_id.email":emailCliente, hora_servicio: horaReserva, cita_servicio: diaReserva, nombre: servicio})
      .sort({ createdAt: -1 })
      .populate({
        path: "cliente_id",
        select: "nombre apellido email",        
      })      
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido",
        },
      })
      .populate({ path: "servicios", select: "nombre" })      
         
      res.json(orden);
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
    }
  };

const obtenerProfesionales = async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;

  const { fecha, hora, servicio } = req.body;

  const criteria = {
    especialidad: servicio,
  };

  try {
    const [total, usuarios] = await Promise.all([
      PerfilProfesional.countDocuments(criteria),
      PerfilProfesional.find(criteria)
        .skip(Number(limite * (pagina - 1)))
        .limit(Number(limite)),
    ]);

    res.json({
      totalUsuarios: total,
      paginaActual: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      resultados: usuarios,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error intentando acceder a los usuarios" });
  }
};

const obtenerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los usuarios de la base de datos" });
  }
};

const obtenerProfesionalesHorarios = async (req, res) => {
  try {
    
    //generamos la fecha actual y la fecha limite para retornar las disponibilidades de los proximos 7 dias
    const fechaActual = new Date();        
    const fechaActualFormat = fechaActual.toISOString().slice(0, 10);
    
    //definimos que retorne profesionales con disponibilidad a futuro
    const usuarios = await Disponibilidad.find({      
      fecha: {$gte: fechaActualFormat}
    })
     .populate({
        path: "creador",
        select: "_id especialidad localidadesLaborales creador",
        populate: {
          path: "creador",
          select: "_id nombre apellido telefono email",
        },
      })
    
    
//console.log(usuarios)
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los usuarios de la base de datos" });
  }
}






export { buscarUsuarios, obtenerUsuarios, obtenerProfesionales, obtenerAll, obtenerOrdenes, obtenerOrdenesBusquedaReservas, obtenerTodosUsuarios, obtenerProfesionalesHorarios };

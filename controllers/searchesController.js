import Usuario from "../models/UserModel.js";
import Producto from "../models/ProductModel.js";
import Orden from "../models/OrderModel.js";

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
        .populate("profesional_id")
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

export { buscarUsuarios, obtenerUsuarios, obtenerProfesionales, obtenerAll, obtenerOrdenes };

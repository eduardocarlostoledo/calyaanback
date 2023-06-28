import Orden from "../models/OrderModel.js";

const getAllOrden = async (req, res, next) => {
  try {
    const orden = await Orden.find().sort({ createdAt: -1 });
    res.status(200).json(orden);
  } catch (err) {
    next(err);
  }
};

const createOrden = async (req, res, next) => {
  console.log("ENTRE A CREATEORDER CONTROLLER", req.body); //FLAG
  try {
    const orden = new Orden(req.body);
    const result = await orden.save();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const saveOrder = async (arrayPreference) => {
  const {
    cliente_id,
    cliente_email,
    cliente_nombre,
    cliente_apellido,
    cliente_cedula,
    cliente_telefono,
    user_profesional_id,
    profesional_id,
    profesional_email,
    profesional_nombre,
    profesional_apellido,
    profesional_telefono,
    servicio,
    servicio_img,
    cantidad,
    precio,
    dia_servicio,
    hora_servicio,
    direccion_Servicio,
    adicional_direccion_Servicio,
    ciudad_Servicio,
    localidad_Servicio,
    telefono_Servicio,
  } = arrayPreference;

  const newOrder = await new Orden({
    cliente_id,
    cliente_email,
    cliente_nombre,
    cliente_apellido,
    cliente_cedula,
    cliente_telefono,
    user_profesional_id,
    profesional_id,
    profesional_email,
    profesional_nombre,
    profesional_apellido,
    profesional_telefono,
    servicio,
    servicio_img,
    cantidad,
    precio,
    dia_servicio,
    hora_servicio,
    direccion_Servicio,
    adicional_direccion_Servicio,
    ciudad_Servicio,
    localidad_Servicio,
    telefono_Servicio,
  });
  await newOrder.save();
  console.log("SE HA GUARDADO UNA NUEVA ORDEN newOrder", newOrder);
  return newOrder;
};

const getOrdenById = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json(orden);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getOrdenesByUserId = async (req, res, next) => {
  try {
    const ordenes = await Orden.find({ cliente_id: req.params.id });
    if (ordenes.length === 0) {
      return res
        .status(404)
        .json({ message: "El cliente no tiene órdenes creadas" });
    }
    res.status(200).json(ordenes);
  } catch (err) {
    next(err);
  }
};

const getOrdenesByStatus = async (req, res, next) => {
  try {
    const { status } = req.query;
    const ordenes = await Orden.find({ estado: status });
    if (ordenes.length === 0) {
      return res
        .status(404)
        .json({ message: `No hay órdenes en estado ${status}` });
    }
    res.status(200).json(ordenes);
  } catch (err) {
    next(err);
  }
};

const updateOrden = async (req, res, next) => {
  const {
    _id,
    cliente_email,
    cliente_nombre,
    cliente_apellido,
    cliente_cedula,
    cliente_telefono,
    direccion_Servicio,
    adicional_direccion_Servicio,
    localidad_Servicio,
    telefono_Servicio,
    estadoServicio,
    estadoFacturacion,
    numeroFacturacion,
    estadoLiquidacion,
    numeroLiquidacion,
  } = req.body;

  try {
    const buscarorden = await Orden.findById(_id);

    if (!buscarorden) {
      return res.status(404).json({ message: "Orden not found" });
    }

    buscarorden.cliente_email = cliente_email;
    buscarorden.cliente_nombre = cliente_nombre;
    buscarorden.cliente_apellido = cliente_apellido;
    buscarorden.cliente_cedula = cliente_cedula;
    buscarorden.cliente_telefono = cliente_telefono;
    buscarorden.direccion_Servicio = direccion_Servicio;
    buscarorden.adicional_direccion_Servicio = adicional_direccion_Servicio;
    buscarorden.localidad_Servicio = localidad_Servicio;
    buscarorden.telefono_Servicio = telefono_Servicio;
    buscarorden.estadoServicio = estadoServicio;
    buscarorden.estadoFacturacion = estadoFacturacion;
    buscarorden.numeroFacturacion = numeroFacturacion;
    buscarorden.estadoLiquidacion = estadoLiquidacion;
    buscarorden.numeroLiquidacion = numeroLiquidacion;

    const ordenActualizada = await buscarorden.save();
    console.log("ordenactualizada", ordenActualizada);
    res.json({
      msg: "Orden actualizada correctamente",
      ordenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return res.status(500).json({ msg: "Error al actualizar la orden" });
  }
};

const deleteOrden = async (req, res, next) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params._id);
    if (!orden) {
      return res.status(404).json({ message: "Orden not found" });
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export {
  getAllOrden,
  createOrden,
  getOrdenById,
  updateOrden,
  deleteOrden,
  getOrdenesByUserId,
  getOrdenesByStatus,
};

export default saveOrder;

import Orden from "../models/OrderModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";

const getAllOrden = async (req, res, next) => {
  try {
    const orden = await Orden.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "cliente_id",
        select: "_id nombre apellido email cedula telefono direccionDefault",
        populate: {
          path: "direccionDefault",
          select: "-createdAt -updateAt -cliente",
        },
      })
      //.populate({ path: "factura", select: "-__v -orden -servicios" }) agrego lo de abajo porque necesito el cupon para facturar
      .populate({ path: "factura", select: "-__v -orden -servicios", populate: {path:"coupon",select:"-reclamados -vencimiento -eliminado"} })
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault",
        },
      })
      .populate({ path: "servicios", select: "_id idWP nombre precio link img porcetajeCalyaan porcetajeProfesional" })

      .lean();

    const ordenes = orden.map((orden) => {
      if (orden?.profesional_id) {
        const { creador, ...restoOrden } = orden.profesional_id;
        return {
          ...orden,
          profesional_id: { ...creador, ...restoOrden },
        };
      } else {
        return {
          ...orden,
          profesional_id: null,
        };
      }
    });

    res.status(200).json(ordenes);
  } catch (err) {
    next(err);
  }
};

//No valido
const createOrden = async (req, res, next) => {
  try {
    const orden = new Orden(req.body);
    const result = await orden.save();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//No valido
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
    coupon,
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
    coupon,
  });
  await newOrder.save();
  return newOrder;
};

const getOrdenById = async (req, res, next) => {
  try {
    const orden = await Orden.find({ _id: req.params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "cliente_id",
        select: "_id nombre apellido email cedula telefono direccionDefault",
        populate: {
          path: "direccionDefault",
          select: "-createdAt -updateAt -cliente",
        },
      })
      .populate({ path: "factura", select: "-__v -orden -servicios", populate: {path:"coupon",select:"-reclamados -vencimiento -eliminado"} })
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault",
        },
      })
      .populate({
        path: "servicios",
        select: "_id nombre precio link img cantidad porcetajeCalyaan porcetajeProfesional",
      })      
      .lean();

    if (!orden || orden.length < 1) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const ordenRequest = [...orden].map((factura) => {
      if (factura.profesional_id) {
        const { creador, ...restoOrden } = factura.profesional_id;
        return {
          ...factura,
          profesional_id: { ...creador, ...restoOrden },
        };
      } else {
        return {
          ...factura,
          profesional_id: null,
        };
      }
    });

    res.status(200).json(ordenRequest[0]);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getOrdenesByUserId = async (req, res, next) => {
  try {
    const ordenes = await Orden.find({ cliente_id: req.params.id })
      .populate({
        path: "cliente_id",
        select: "_id nombre apellido email cedula telefono direccionDefault",
        populate: {
          path: "direccionDefault",
          select: "-createdAt -updateAt -cliente",
        },
      })
      .populate({ path: "factura", select: "-__v -orden -servicios" })
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt",
      })
      .populate({ path: "servicios", select: "_id nombre precio link" });

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

const updateOrden = async (req, res) => {
  const { _id, estado_servicio, cita_servicio, hora_servicio, profesional_id } =
    req.body;
  try {
    const options = { new: true };
    const update = {};

    //console.log("updat perfil", profesional_id);

    if (estado_servicio) {
      update.estado_servicio = estado_servicio;
    }

    if (hora_servicio) {
      update.hora_servicio = hora_servicio;
    }
    if (cita_servicio) {
      update.cita_servicio = cita_servicio;
    }
    if (profesional_id) {
      update.profesional_id = await PerfilProfesional.findOne({
        creador: profesional_id,
      });
    }

    //console.log(update.profesional_id, "updat");
    const ordenActualizada = await Orden.findByIdAndUpdate(_id, update, options)
      .populate({
        path: "cliente_id",
        select: "_id nombre apellido email cedula telefono direccionDefault",
        populate: {
          path: "direccionDefault",
          select: "-createdAt -updateAt -cliente",
        },
      })
      .populate({ path: "factura", select: "-__v -orden -servicios" })
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt",
      })
      .populate({ path: "servicios", select: "_id nombre precio link" });

    if (!ordenActualizada) {
      return res.status(404).json({ message: "Orden not found" });
    }

    //console.log(ordenActualizada.profesional_id, profesional_id, "Actualizada");
    res.json({
      msg: "Orden actualizada correctamente",
      ordenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return res.status(500).json({ msg: "Error al actualizar la orden" });
  }
};

// const updateOrden = async (req, res) => {
//   const { _id, estado_servicio, hora_servicio, profesional_id } = req.body;

//   try {
//     const buscarorden = await Orden.findById(_id)
//       .populate({
//         path: "cliente_id",
//         select: "_id nombre apellido email cedula telefono direccionDefault",
//         populate: {
//           path: "direccionDefault",
//           select: "-createdAt -updateAt -cliente",
//         },
//       })
//       .populate({ path: "factura", select: "-__v -orden -servicios" })
//       .populate({
//         path: "profesional_id",
//         select:
//           "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt",
//       })
//       .populate({ path: "servicios", select: "_id nombre precio link" });

//     if (!buscarorden) {
//       return res.status(404).json({ message: "Orden not found" });
//     }

//     if (profesional_id) {
//       buscarorden.profesional_id = profesional_id;
//     }

//     buscarorden.estado_servicio = estado_servicio;

//     if (hora_servicio) {
//       buscarorden.hora_servicio = hora_servicio;
//     }

//     const ordenActualizada = await buscarorden.save();
//     console.log(ordenActualizada.profesional_id, profesional_id, "Actualizada");
//     res.json({
//       msg: "Orden actualizada correctamente",
//       ordenActualizada,
//     });
//   } catch (error) {
//     console.error("Error al actualizar la orden:", error);
//     return res.status(500).json({ msg: "Error al actualizar la orden" });
//   }
// };

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

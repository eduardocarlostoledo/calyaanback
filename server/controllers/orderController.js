import Orden from "../models/OrderModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";
import { emailRecompra } from "../helpers/emails.js";

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

////se esta trabajando para editar las ordenes

const editarOrdenCompletaDashboard = async (req, res) => {
  const { _id } = req.params; // Obtener el ID de la orden de los parámetros de la URL
  const update = req.body; // Tomar todos los campos del cuerpo de la solicitud
    
    try {
      const options = { new: true };
  
    // Actualizar todos los campos de la orden
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

const updateOrdenByProfesional = async (req, res) => {
  console.log("body update", req.body)
  const { id, estado, registroFirmaCliente, fechaRealizacion, horaRealizacion } = req.body;

  try {
    // Validar que se proporcionen tanto el ID como el estado
    if (!id || !estado) {
      return res.status(400).json({ message: "Se requiere un ID y un estado en la solicitud" });
    }

    // Validar que el estado sea "Pendiente" o "Completado"
    if (estado !== "Pendiente" && estado !== "Completado") {
      return res.status(400).json({ message: "El estado debe ser 'Pendiente' o 'Completada'" });
    }

    const options = { new: true };
    const update = {
      estado_servicio: estado,
      registroFirmaCliente,
      cita_servicio: fechaRealizacion,
      hora_servicio: horaRealizacion,
    };

    const ordenActualizada = await Orden.findByIdAndUpdate(id, update, options)
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
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({
      msg: "Orden actualizada correctamente",
      ordenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return res.status(500).json({ msg: "Error al actualizar la orden" });
  }
};

//este endpoint recupera los clientes cuyos servicios han finalizado y no tienen servicios en curso
const campañaRecompra = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate({
        path: 'cliente_id'
      });

    const clientesUnicos = new Set();

    const clientesCompletados = ordenes
  .filter(orden => orden.estado_servicio === 'Completado')
  .reduce((clientes, orden) => {
    const clienteId = orden.cliente_id?._id?.toString();
    const telefono = orden.cliente_id?.telefono;
    const email = orden.cliente_id?.email;
    if (clienteId && telefono && email && !clientesUnicos.has(clienteId)) {
      clientesUnicos.add(clienteId);
      return [...clientes, { telefono: orden.cliente_id.telefono, email: orden.cliente_id.email }];
    }
    return clientes;
  }, []);


// // Agregar demora de 2 segundos entre cada envío
// for (const cliente of clientesCompletados) {
//   await new Promise(resolve => setTimeout(() => {
//     console.log("ENVIADO A:", cliente.email)
//     emailRecompra(cliente.email);
//     resolve();
//   }, 2000)); // 2000 milisegundos = 2 segundos
// }
// console.log("SE HAN ENVIADO A", clientesCompletados.length, "CLIENTES DE MANERA EXITOSA");

console.log("CAMPAÑA RECOMPRA", clientesCompletados, "FIN CLIENTES");
res.json({
  msg: "Orden actualizada correctamente",
  clientesCompletados,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const calcularVentasPorMes = (ordenes) => {
  // Inicializar un objeto para almacenar las ventas por mes
  const ventasPorMes = {};

  // Recorrer cada orden
  ordenes.forEach((orden) => {
    // Obtener el mes y año de la fecha de venta
    const fechaVenta = new Date(orden.createdAt);
    const mes = fechaVenta.getMonth() + 1; // Sumar 1 porque los meses son indexados desde 0
    const año = fechaVenta.getFullYear();

    // Crear una clave única para el mes y año
    const claveMes = `${año}-${mes}`;

    // Verificar si la clave ya existe en el objeto
    if (ventasPorMes[claveMes]) {
      // Sumar el precioTotal de la orden al total del mes existente
      ventasPorMes[claveMes] += orden.factura.precioTotal;
    } else {
      // Crear una nueva entrada en el objeto para el mes
      ventasPorMes[claveMes] = orden.factura.precioTotal;
    }
  });

  return ventasPorMes;
};

const ventasPorMesController = async (req, res) => {
  try {
    // Obtener todas las órdenes
    const ordenes = await Orden.find()
    .populate({ path: "factura", select: "-__v -orden -servicios", populate: {path:"coupon",select:"-reclamados -vencimiento -eliminado"} });

    // Calcular las ventas por mes
    const ventasPorMes = calcularVentasPorMes(ordenes);

    // Imprimir el total de ventas por mes en la consola
    console.log("Ventas por Mes:", ventasPorMes);

    // Retornar el resultado como respuesta JSON
    res.json({ ventasPorMes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
  updateOrdenByProfesional,
  editarOrdenCompletaDashboard,
  campañaRecompra,
  ventasPorMesController
};

export default saveOrder;

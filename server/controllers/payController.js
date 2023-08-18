import mercadopago from "mercadopago";
import PerfilProfesional from "../models/ProfessionalModel.js";
import Usuario from "../models/UserModel.js";
import Factura from "../models/FacturaModel.js";
import saveOrder from "./orderController.js";
import Producto from "../models/ProductModel.js";
import Orden from "../models/OrderModel.js";
import {
  emailCompra,
  emailProfesional,
  emailCancelacionProfesional,
} from "../helpers/emails.js";
import Disponibilidad from "../models/AvailableModel.js";
import convertirFormatoHora from "../helpers/formatoFecha.js";
import { obtenerIndicesCumplenCondicion } from "../helpers/comparaDisponibilidad.js";
import Coupon from "../models/CouponModel.js";
import couponRoutes from "../routes/couponRoutes.js";
import product from "../routes/productsRoutes.js";

//import {reprogramarReserva} from "../helpers/reprogramacionReserva.js";

// let arrayPreference = {};
const payPreference = async (req, res) => {

  try {

    const { DateService, ProfessionalService, profile, dataCustomer, servicios, coupon } = req.body

    const parsedProfile = JSON.parse(profile);
    const parsedProfessionalService = JSON.parse(ProfessionalService);
    const parsedData_customer = JSON.parse(dataCustomer);
    const parsedDateService = JSON.parse(DateService);

    const productos = await Producto.find({ idWP: { $in: servicios } });

    const serviciosGuardar = productos.map((product) => product._id)

    let precioNeto = productos.reduce((accum, product) => accum + parseInt(product.precio, 10), 0);

    let precioSubTotal = precioNeto;

    if (coupon) {
      const existeCupon = await Coupon.findById({ _id:coupon});


      if (!existeCupon) {
        const error = new Error("Cupón no válido");
        return res.status(404).json({ msg: error.message });
      }

      if (existeCupon.vencimiento && existeCupon.vencimiento < new Date()) {
        return res.status(400).json({ msg: 'El cupón ha vencido' });
      }

      if (existeCupon.reclamados.includes(parsedProfile._id)) {
          return res.status(400).json({ msg: 'El cupón ya ha sido reclamado' });
      }

      if (existeCupon.tipoDescuento === 'porcentaje') {
        precioSubTotal = precioNeto - (precioNeto * (existeCupon.descuento / 100));
      } else {
        precioSubTotal = precioNeto - existeCupon.descuento;
      }

      if (precioSubTotal < 0) {
        return res.status(400).json({ msg: 'No es posible redimir el cupón dado que es mayor al costo del servicio' });
      }
    }

    let precioTotal = precioSubTotal;

    const FacturaOrden = new Factura({
      precioNeto,
      precioSubTotal,
      precioTotal,
      coupon: coupon ? coupon : undefined,
      fecha_venta: new Date(),
      origen: "Mercado Pago",
      servicios: serviciosGuardar
    })

    const factura = await FacturaOrden.save()

    const OrdenPendiente = new Orden({
      cliente_id: parsedProfile._id,
      profesional_id: parsedProfessionalService.profesional_id,
      servicios: serviciosGuardar,
      factura: factura._id,
      cita_servicio: parsedDateService.date,
      hora_servicio: parsedDateService.time,
      direccion_servicio: parsedData_customer.address,
      adicional_direccion_servicio: parsedData_customer.address2,
      localidad_servicio: parsedDateService.localidadServicio,
      telefono_servicio: parsedData_customer.telefono,
    })

    const orden = await OrdenPendiente.save()

    factura.orden = orden._id;

    await factura.save()

    res.send({ orden, factura });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const create_Preference = async (req, res) => {

  try {
    const factura = await Factura.findById(req.params.orderId).populate("servicios");

    let items = factura.servicios.map((producto) => {
      return {
        title: producto.nombre,
        unit_price: Number(factura?.precioTotal),
        quantity: 1
      };
    });

    let preference = {
      items: items,
      back_urls: {
        success: `${process.env.BACK}/api/pay/feedback/success`,
        failure: `${process.env.BACK}/api/pay/feedback/failure`,
        pending: `${process.env.BACK}/api/pay/feedback/pending`,
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_types: [
          {
            id: "ticket",
          },
          {
            id: "bank_transfer",
          },
        ],
      },
      statement_descriptor: "CALYAAN COLOMBIA",
      external_reference: `${factura.orden}`,
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.send({
          id: response.body.id,
          data: response.body.items,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
};

const feedbackSuccess = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;

    const order = await Orden.findById(external_reference)
      .populate({ path: "profesional_id", populate: [{ path: "disponibilidad" }, { path: "creador" }] })
      .populate({ path: "cliente_id" })
      .populate({ path: "servicios" })
      .populate({ path: "factura" });

    const factura = await Factura.findById(order.factura);

    factura.payment_id = payment_id;
    factura.estadoPago = status;
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;

    if (factura?.coupon) {

      const cuponRedimido = await Coupon.findById({ _id: factura.coupon })

      cuponRedimido.reclamados = [...cuponRedimido.reclamados, order.cliente_id];

      await cuponRedimido.save()
    }

    let disponibilidadProfesional = await Disponibilidad.findOne({
      fecha: order.cita_servicio,
      creador: order.profesional_id._id,
    });

    const index = disponibilidadProfesional.horarios.findIndex(
      (item) => item.hora === order.cita_servicio
    );

    if (index !== -1) {
      const fechaHoraServicio = new Date(`${order.cita_servicio}T${order.cita_servicio.split('-')[0]}:00`);
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false; });
    }

    if (order.coupon) {

      const cuponRedimido = await Coupon.findOne({ _id: order.coupon })

      cuponRedimido.reclamados = [...cuponRedimido.reclamados, order.cliente._id];

      await cuponRedimido.save()

    }

    await disponibilidadProfesional.save();
    await order.save();
    await factura.save()
    // await emailCompra({
    //   cliente_email: order.cliente_id.email,
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_telefono: order.cliente_id.telefono,
    //   profesional_nombre: order.profesional_id.creador.nombre,
    //   servicio: order.servicios[0].nombre,
    //   precio: order.factura.precioTotal,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: order.factura.estadoPago,
    // });

    // await emailProfesional({
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_cedula: order.cliente_id.cedula,
    //   profesional_email: order.profesional_id.creador.email,
    //   profesional_nombre: order.profesional_id.creador.nombre,
    //   profesional_telefono: order.profesional_id.creador.telefono,
    //   servicio: order.servicios[0].nombre,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: order.factura.estadoPago,
    // });

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in success route" });
  }
};

const feedbackPending = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;

    const order = await Orden.findById(external_reference)
      .populate({ path: "profesional_id", populate: [{ path: "disponibilidad" }, { path: "creador" }] })
      .populate({ path: "cliente_id" })
      .populate({ path: "servicios" })
      .populate({ path: "factura" });

    const factura = await Factura.findById(order.factura);

    factura.payment_id = payment_id;
    factura.estadoPago = status;
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;

    await order.save();
    await factura.save()
    // await emailCompra({
    //   cliente_email: order.cliente_id.email,
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_telefono: order.cliente_id.telefono,
    //   profesional_nombre: order.profesional_id.creador.nombre,
    //   servicio: order.servicios[0].nombre,
    //   precio: order.factura.precioTotal,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: order.factura.estadoPago,
    // });
    // await emailProfesional({
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_cedula: order.cliente_id.cedula,
    //   profesional_email: order.profesional_id.creador.email,
    //   profesional_nombre: order.profesional_id.creador.nombre,
    //   profesional_telefono: order.profesional_id.creador.telefono,
    //   servicio: order.servicios[0].nombre,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: order.factura.estadoPago,
    // });

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in pending route" });
  }
};

const feedbackFailure = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;

    const order = await Orden.findById(external_reference)

    const factura = await Factura.findById(order.factura);

    if (status === "null") {
      factura.estadoPago = "rejected";
      factura.payment_id = payment_id;
      factura.payment_type = payment_type;
      factura.merchant_order_id = merchant_order_id;

      await factura.save();
      // await emailCompra(order)
      // await emailProfesional(order)

      res.redirect(`${process.env.FRONT}/servicios`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  }
};

const payPreferenceManual = async (req, res) => {
  try {
    const {
      cliente_id,
      direccion_servicio,
      adicional_direccion_servicio,
      localidad_servicio,
      telefono_servicio,
      servicios,
      coupon,
      metodo_pago,
      link_pago
    } = req.body;


    let usuario = await Usuario.findOne({ _id: cliente_id });

    if (!usuario) {
      const error = new Error("El usuario no esta registrado");
      return res.status(404).json({ msg: error.message });
    }

    const serviciosSearch = await Producto.find({ idWP: { $in: servicios } });
    const serviciosGuardar = serviciosSearch.map((product) => product._id)

    const arrayPreference = {
      cliente_id: usuario._id,
      servicios: serviciosGuardar,
      direccion_servicio,
      adicional_direccion_servicio,
      localidad_servicio,
      cita_servicio: "",
      hora_servicio: "",
      telefono_servicio,
      estado_servicio: "Agendar",
      coupon: coupon ? coupon : undefined,
    };

    let precioNeto = serviciosSearch.reduce((accum, product) => accum + product.precio, 0);

    let precioSubTotal = precioNeto;

    if (coupon) {
      const existeCupon = await Coupon.findById({ _id: arrayPreference.coupon });

      if (!existeCupon) {
        const error = new Error("Cupón no válido");
        return res.status(404).json({ msg: error.message });
      }

      if (existeCupon.vencimiento && existeCupon.vencimiento < new Date()) {
        return res.status(400).json({ msg: 'El cupón ha vencido' });
      }

      if (existeCupon.reclamados.includes(arrayPreference.cliente_id)) {
                return res.status(400).json({ msg: 'El cupón ya ha sido reclamado' });
      }

      if (existeCupon.tipoDescuento === 'porcentaje') {
        precioSubTotal = precioNeto - (precioNeto * (existeCupon.descuento / 100));
      } else {
        precioSubTotal = precioNeto - existeCupon.descuento;
      }


      if (precioSubTotal < 0) {
        return res.status(400).json({ msg: 'No es posible redimir el cupón dado que es mayor al costo del servicio' });
      }
    }

    let precioTotal = precioSubTotal;

    const FacturaOrden = new Factura({
      precioNeto,
      precioSubTotal,
      precioTotal,
      coupon: coupon ? coupon : undefined,
      fechaVenta: new Date(),
      origen: "",
      servicios: serviciosGuardar,
      link_pago,
      metodo_pago
    })

    const factura = await FacturaOrden.save()

    const newOrder = await new Orden({ ...arrayPreference, factura: factura._id });

    const orden = await newOrder.save()

    factura.orden = orden._id;

    await newOrder.save();
    await factura.save();

    usuario.reservas = [...usuario.reservas, newOrder._id];

    await usuario.save();

    res.send({ factura: factura._id, order: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const feedbackSuccessManual = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;


    const factura = await Factura.findById(external_reference);

    const orden = await Orden.findById(factura.orden);

    factura.payment_id = payment_id;
    factura.estadoPago = "approved";
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;
    factura.origen = "Mercado Pago";

    if (factura.coupon) {

      const cuponRedimido = await Coupon.findOne({ _id: factura.coupon })

      cuponRedimido.reclamados = [...cuponRedimido.reclamados, orden.cliente_id];

      await cuponRedimido.save()
    }


    await orden.save();
    await factura.save();

    res.redirect(`${process.env.FRONT}/resumen/${orden._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in success route" });
  }
};

const feedbackPendingManual = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;

    const factura = await Factura.findById(external_reference);

    factura.payment_id = payment_id;
    factura.estadoPago = "pending";
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;

    await factura.save();

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in pending route" });
  }
};

const feedbackFailureManual = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      payment_type,
      merchant_order_id,
      external_reference,
    } = req.query;

    const factura = await Factura.findById(external_reference);

    if (status === "null") {
      factura.estadoPago = "rejected";
      factura.payment_id = payment_id;
      factura.payment_type = payment_type;
      factura.merchant_order_id = merchant_order_id;

      await factura.save();

      res.redirect(`${process.env.FRONT}/servicios`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  }
};

const updatePayOrder = async (req, res) => {

  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere un valor válido para _id" });
    }

    const order = await Orden.findById(id)

    if (!order) {
      return res
        .status(404)
        .json({ error: "No se encontró la orden especificada" });
    }

    order.cita_servicio = "";
    order.hora_servicio = "";
    order.profesional_id = null;

    await order.save();

    /*     await emailCompra(order);
        await emailProfesional(order); */

    res.status(200).json({ msg: "Orden actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const liberarReserva = async (req, res) => {

  try {
    const {
      _id,
      cliente_id,
      liberar_hora_servicio,
      liberar_dia_servicio,
      liberar_profesional_id,
      liberar_profesional_email,
      liberar_profesional_telefono,
    } = req.body;

    if (
      liberar_hora_servicio &&
      liberar_dia_servicio &&
      liberar_profesional_id
    ) {
      let disponibilidadProfesional = await Disponibilidad.findOne({
        fecha: liberar_dia_servicio,
        creador: liberar_profesional_id,
      });

      if (!disponibilidadProfesional) {
        throw new Error(
          "No se encontró la disponibilidad del profesional para la reprogramación"
        );
      }

      const index = disponibilidadProfesional.horarios.findIndex(
        (item) => item.hora === liberar_hora_servicio);

      if (index !== -1) {
        const fechaHoraServicio = new Date(`${liberar_dia_servicio}T${liberar_hora_servicio.split('-')[0]}:00`);
        const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
        indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = true; });
      }

      await disponibilidadProfesional.save();
      // Comentado por ahora, implementar la notificación de reprogramación si es necesario

      // await emailCancelacionProfesional({
      //   _id,
      //   cliente_nombre: cliente_id.nombre,
      //   cliente_apellido: cliente_id.apellido,
      //   liberar_hora_servicio,
      //   liberar_dia_servicio,
      //   liberar_profesional_id,
      //   liberar_profesional_email,
      //   liberar_profesional_telefono,
      // });
      res.status(200).json({ msg: "Orden agendada correctamente" });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al reprogramar la reserva");
  }
};

const agendarOrden = async (req, res) => {
  try {


    const { cita_servicio, hora_servicio, profesional_id } = req.body;

    const order = await Orden.findById(req.body.id)
      .populate({
        path: "profesional_id",
        select:
          "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault",
        },
      })
      .populate({ path: "cliente_id" })
      .populate({ path: "servicios" })
      .populate({ path: "factura" });

    order.cita_servicio = cita_servicio
    order.hora_servicio = hora_servicio

    let disponibilidadProfesional = await Disponibilidad.findOne({
      fecha: cita_servicio,
      creador: profesional_id,
    }).populate({
      path: "creador",
      populate: { path: "creador" }
    })

    //2 horas para atras

    const index = disponibilidadProfesional.horarios.findIndex(
      (item) => item.hora === hora_servicio
    );

    if (index !== -1) {

      const fechaHoraServicio = new Date(`${cita_servicio}T${hora_servicio.split('-')[0]}:00`);
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false; });

    }



    order.cita_servicio = cita_servicio
    order.hora_servicio = hora_servicio
    order.profesional_id = req.body.profesional_id;
    order.estado_servicio = "Pendiente";


    await order.save()
    await disponibilidadProfesional.save();



    // await emailCompra({
    //   cliente_email: order.cliente_id.email,
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_telefono: order.cliente_id.telefono,
    //   profesional_nombre: disponibilidadProfesional.creador.creador.nombre,
    //   servicio: order.servicios[0].nombre,
    //   precio: order.factura.precioTotal,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: "approved",
    // });
    // await emailProfesional({
    //   cliente_nombre: order.cliente_id.nombre,
    //   cliente_apellido: order.cliente_id.apellido,
    //   cliente_cedula: order.cliente_id.cedula,
    //   profesional_email: disponibilidadProfesional.creador.creador.email,
    //   profesional_nombre: disponibilidadProfesional.creador.creador.nombre,
    //   profesional_telefono: disponibilidadProfesional.creador.creador.telefono,
    //   servicio: order.servicios[0].nombre,
    //   dia_servicio: order.cita_servicio,
    //   hora_servicio: order.hora_servicio,
    //   direccion_Servicio: order.direccion_servicio,
    //   adicional_direccion_Servicio: order.adicional_direccion_servicio,
    //   ciudad_Servicio: order.ciudad_servicio,
    //   localidad_Servicio: order.localidad_servicio,
    //   estadoPago: "approved",
    // });

    res.status(200).json({ msg: "Profesional agendada correctamente" });
  } catch (error) {
    console.error(error);
    throw new Error("Error al programar");
  }
};

const actualizarPago = async (req, res) => {
  try {

    const order = await Orden.findById(req.body.id)

    const factura = await Factura.findById(order.factura)

    factura.payment_id = req.body.payment_id
    factura.origen = req.body.origen
    factura.estadoPago = "approved"


    await factura.save()

    res.status(200).json({ msg: "Factura actualizada correctamente" });
  } catch (error) {
    console.error(error);
    throw new Error("Error al porgramar");
  }
};

export {
  payPreference,
  create_Preference,
  feedbackSuccess,
  feedbackPending,
  feedbackFailure,
  payPreferenceManual,
  feedbackSuccessManual,
  feedbackPendingManual,
  feedbackFailureManual,
  updatePayOrder,
  liberarReserva,
  agendarOrden,
  actualizarPago
};
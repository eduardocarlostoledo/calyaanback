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

    const { cliente_id, profesional_id, servicios,cupon } = req.body

    const cliente = await Usuario.findOne({
      _id: cliente_id,
    });

    const profesional = await Usuario.findOne({
      profesional: profesional_id,
    });

    const productos = await Producto.find({ idWP: { $in: servicios }});

    const serviciosGuardar = productos.map((product)=>product._id)
    console.log(productos)

    let  precioNeto =  productos.reduce((accum, product) => accum + product.precio, 0);

    let precioSubTotal = precioNeto;

    if(cupon){
      const existeCupon = await Coupon.findOne({ codigo: cupon });

      if (!existeCupon) {
        const error = new Error("Cupón no válido");
        return res.status(404).json({ msg: error.message });
      }
  
      if (existeCupon.vencimiento && existeCupon.vencimiento < new Date()) {
        return res.status(400).json({ msg: 'El cupón ha vencido' });
      }
  
      if (existeCupon.reclamados.includes(req.usuario._id)) {
        return res.status(400).json({ msg: 'El cupón ya ha sido reclamado' });
      }
  
      if (existeCupon.tipoDescuento === 'porcentaje') {
        precioSubTotal = valor - (valor * (existeCupon.descuento / 100));
      } else {
        precioSubTotal = valor - existeCupon.descuento;
      }

      if (precioSubTotal < 0) {
        return res.status(400).json({ msg: 'No es posible redimir el cupón dado que es mayor al costo del servicio' });
      }
    }

    let precioTotal = precioSubTotal;

    const FacturaOrden = new Factura( {
      precioNeto,
      precioSubTotal,
      precioTotal,
      cupon,
      fecha_venta:new Date(),
      origen:"Mercado Pago",
      servicios:serviciosGuardar
    })

    const factura = await FacturaOrden.save()

    const OrdenPendiente = new Orden({
      ...req.body,
      servicios:serviciosGuardar,
      factura:factura._id
    })

    const orden = await OrdenPendiente.save()

    factura.orden = orden._id;
    
    await factura.save()

console.log(factura)

    res.send({ orden,factura });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const create_Preference = async (req, res) => {

  const factura = await Factura.findById(req.params.orderId).populate("servicios");

  let items = factura.servicios.map((producto) => {
    return {
      title: producto.nombre,
      unit_price: Number(producto.precio),
      quantity: 1
    };
  });
  
  console.log(items)

  let preference = {
    items,
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
      console.log(response)
      res.send({
        id: response.body.id,
        data: response.body.items,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
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

    console.log(req.query)

    const order = await Orden.findById(external_reference).populate({path:"profesional_id", populate:"disponibilidad"});
    console.log("ORDEN SUCCES",order);
   
    const factura = await Factura.findById(order.factura);


    factura.payment_id = payment_id;
    factura.estadoPago = status;
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;

    console.log(factura)


    let disponibilidadProfesional = await Disponibilidad.findOne({
      fecha: order.cita_servicio,
      creador: order.profesional_id._id,
    });
    

    console.log(disponibilidadProfesional)

    //2 horas para atras
    
    const index = disponibilidadProfesional.horarios.findIndex(
      (item) => item.hora === order.cita_servicio
    );
    
      console.log(index)

    if (index !== -1) {          
      console.log(index)
      const fechaHoraServicio = new Date(`${order.cita_servicio}T${order.cita_servicio.split('-')[0]}:00`);      
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false;  });  
    }

    if(order.coupon){

      const cuponRedimido = await Coupon.findOne({_id:order.coupon})

      cuponRedimido.reclamados = [...cuponRedimido.reclamados, order.cliente_id];

      await cuponRedimido.save()
      
    }

    await disponibilidadProfesional.save();
    await order.save();
    await factura.save()
    //await emailCompra(order);
    //await emailProfesional(order);

    res.redirect(`${process.env.FRONT}/wordpress`);
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

    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

    await emailCompra(order);
    await emailProfesional(order);

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

    const order = await Orden.findById(external_reference);

    if (status === "null") {
      order.estadoPago = "rejected";
      order.payment_id = payment_id;
      order.payment_type = payment_type;
      order.merchant_order_id = merchant_order_id;

      await order.save();
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
    console.log("paypreferencemanual req body", req.body)
    
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

    const serviciosSearch = await Producto.find({ idWP: { $in: servicios }});
    const serviciosGuardar = serviciosSearch.map((product)=>product._id)

    const arrayPreference = {
      cliente_id: usuario._id,
      servicios: serviciosGuardar,
      direccion_servicio,
      adicional_direccion_servicio,
      localidad_servicio,
      cita_servicio:"",
      hora_servicio:"",
      telefono_servicio,
      estado_servicio:"Agendar",
      coupon: coupon ? coupon : undefined,
    };

    let precioNeto =  serviciosSearch.reduce((accum, product) => accum + product.precio, 0);

    let precioSubTotal = precioNeto;

    if(coupon){
      const existeCupon = await Coupon.findOne({ codigo: coupon });

      if (!existeCupon) {
        const error = new Error("Cupón no válido");
        return res.status(404).json({ msg: error.message });
      }
  
      if (existeCupon.vencimiento && existeCupon.vencimiento < new Date()) {
        return res.status(400).json({ msg: 'El cupón ha vencido' });
      }
  
      if (existeCupon.reclamados.includes(req.usuario._id)) {
        return res.status(400).json({ msg: 'El cupón ya ha sido reclamado' });
      }
  
      if (existeCupon.tipoDescuento === 'porcentaje') {
        precioSubTotal = valor - (valor * (existeCupon.descuento / 100));
      } else {
        precioSubTotal = valor - existeCupon.descuento;
      }

      if (precioSubTotal < 0) {
        return res.status(400).json({ msg: 'No es posible redimir el cupón dado que es mayor al costo del servicio' });
      }
    }

    let precioTotal = precioSubTotal;

    const FacturaOrden = new Factura( {
      precioNeto,
      precioSubTotal,
      precioTotal,
      coupon: coupon ? coupon : undefined,
      fechaVenta:new Date(),
      origen:"",
      servicios:serviciosGuardar,
      link_pago,
      metodo_pago
    })

    const factura = await FacturaOrden.save()

    const newOrder = await new Orden({...arrayPreference,factura:factura._id});

    const orden = await newOrder.save()

    factura.orden = orden._id;

    await newOrder.save();
    await factura.save();

    usuario.reservas = [...usuario.reservas, newOrder._id];

    await usuario.save();

    res.send({ factura: factura._id,order:newOrder._id });
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

    console.log(req.query)

    const factura = await Factura.findById(external_reference);

    const orden = await Orden.findById(factura.orden);

    factura.payment_id = payment_id;
    factura.estadoPago = status;
    factura.payment_type = payment_type;
    factura.merchant_order_id = merchant_order_id;
    factura.origen = "Mercado Pago";

    if(factura.coupon){

      const cuponRedimido = await Coupon.findOne({_id:factura.coupon})

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

    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

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

    const order = await Orden.findById(external_reference);

    if (status === "null") {
      order.estadoPago = "rejected";
      order.payment_id = payment_id;
      order.payment_type = payment_type;
      order.merchant_order_id = merchant_order_id;

      await order.save();

      res.redirect(`${process.env.FRONT}/servicios`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  }
};

const updatePayOrder = async (req, res) => {
  
console.log("updatePayOrder req body", req.body)
  try {
    const { _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ error: "Se requiere un valor válido para _id" });
    }

    const order = await Orden.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ error: "No se encontró la orden especificada" });
    }

    let disponibilidadProfesional = await Disponibilidad.findOne({
      fecha: order.dia_servicio,
      creador: order.profesional_id._id,
    });

    if (!disponibilidadProfesional) {
      return res
        .status(404)
        .json({ error: "No se encontró la disponibilidad del profesional" });
    }

    const index = disponibilidadProfesional.horarios.findIndex(
      (item) => item.hora === order.hora_servicio      
    );    

    if (index !== -1) {
      const fechaHoraServicio = new Date(`${order.dia_servicio}T${order.hora_servicio.split('-')[0]}:00`);      
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false;  });  
    }
    console.log("orden almacenada actualizada con nueva reservacion");
    

    await disponibilidadProfesional.save();
    await order.save();

    await emailCompra(order);
    await emailProfesional(order);

    res.status(200).json({ msg: "Orden agendada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const liberarReserva = async (req, res) => {
  console.log("liberarReserva", req.body);
  try {
    const {
      _id,
      cliente_nombre,
      cliente_apellido,
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
        (item) => item.hora === liberar_hora_servicio      );

      if (index !== -1) {
      const fechaHoraServicio = new Date(`${liberar_dia_servicio}T${liberar_hora_servicio.split('-')[0]}:00`);      
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = true;  });
      }        
        
      console.log(
        "disponibilidad profesional restablecida"
        
      );
      await disponibilidadProfesional.save();
      // Comentado por ahora, implementar la notificación de reprogramación si es necesario

      await emailCancelacionProfesional({
        _id,
        cliente_nombre,
        cliente_apellido,
        liberar_hora_servicio,
        liberar_dia_servicio,
        liberar_profesional_id,
        liberar_profesional_email,
        liberar_profesional_telefono,
      });
      res.status(200).json({ msg: "Orden agendada correctamente" });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al reprogramar la reserva");
  }
};

const agendarOrden = async (req, res) => {
  try {
    console.log("agendarOrden req body", req.body)

    const { cita_servicio, hora_servicio, profesional_id } = req.body;
 
    const order = await Orden.findById(req.body.id)     

    order.cita_servicio = cita_servicio
    order.hora_servicio = hora_servicio       

    let disponibilidadProfesional = await Disponibilidad.findOne({
      fecha: cita_servicio,
      creador: profesional_id,
    });    
    //2 horas para atras
    
    const index = disponibilidadProfesional.horarios.findIndex(
      (item) => item.hora === hora_servicio
    );

    if (index !== -1) {      
    
      const fechaHoraServicio = new Date(`${cita_servicio}T${hora_servicio.split('-')[0]}:00`);      
      const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
      console.log("indicesCumplenCondicion Agendar Orden",indicesCumplenCondicion)
      indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false;  });
  
    }

    console.log(req.body.profesional_id)

    order.cita_servicio = cita_servicio
    order.hora_servicio = hora_servicio
    order.profesional_id = req.body.profesional_id;
    order.estado_servicio = "Pendiente";

    await order.save()

    console.log(order)
    await disponibilidadProfesional.save();

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

// import mercadopago from "mercadopago";
// import PerfilProfesional from "../models/ProfessionalModel.js";
// import Usuario from "../models/UserModel.js";
// import saveOrder from "./orderController.js";
// import Producto from "../models/ProductModel.js";
// import Orden from "../models/OrderModel.js";
// import {
//   emailCompra,
//   emailProfesional,
//   emailCancelacionProfesional,
// } from "../helpers/emails.js";
// import Disponibilidad from "../models/AvailableModel.js";
// import convertirFormatoHora from "../helpers/formatoFecha.js";
// import { obtenerIndicesCumplenCondicion } from "../helpers/comparaDisponibilidad.js";
// //import {reprogramarReserva} from "../helpers/reprogramacionReserva.js";

// // let arrayPreference = {};
// const payPreference = async (req, res) => {
  
//   try {
//     const {
//       DateService,
//       ProfessionalService,
//       profile,
//       services,
//       dataCustomer,
//     } = req.body;

//     const parsedProfile = JSON.parse(profile);
//     const parsedServices = JSON.parse(services);
//     const parsedProfessionalService = JSON.parse(ProfessionalService);
//     const parsedDateService = JSON.parse(DateService);
//     const parsedData_customer = JSON.parse(dataCustomer);

//     const profesional = await Usuario.findOne({
//       profesional: parsedProfessionalService.creador._id,
//     });

//     const serviciosIds = parsedServices.map((service) => service.idWP);

//     const servicios = await Producto.findOne({ idWP: { $in: serviciosIds } });

//     const arrayPreference = {
//       cliente_id: parsedProfile._id,
//       cliente_email: parsedProfile.email,
//       cliente_nombre: parsedData_customer.firstName,
//       cliente_apellido: parsedData_customer.lastName,
//       cliente_cedula: parsedData_customer.cedula,
//       cliente_telefono: parsedData_customer.telefono,
//       user_profesional_id: parsedProfessionalService.creador._id,
//       profesional_id: parsedProfessionalService.creador._id,
//       profesional_email: profesional.email,
//       profesional_nombre: profesional.nombre,
//       profesional_apellido: profesional.apellido,
//       profesional_telefono: profesional.telefono,
//       servicio: servicios.nombre,
//       servicio_img: servicios.img,
//       cantidad: parseInt(serviciosIds.length, 10),
//       precio: parseInt(servicios.precio, 10),
//       dia_servicio: parsedDateService.date,
//       hora_servicio: parsedDateService.time,
//       direccion_Servicio: parsedData_customer.address,
//       adicional_direccion_Servicio: parsedData_customer.address2,
//       ciudad_Servicio: parsedData_customer.ciudad,
//       localidad_Servicio: parsedDateService.localidadServicio,
//       //localidad_Servicio: parsedData_customer.localidad,
//       telefono_Servicio: parsedData_customer.telefono,
//     };
    

//     const newOrder = await saveOrder(arrayPreference);
//     const usuario = await Usuario.findOne({ _id: newOrder.cliente_id });
//     const profesionalService = await PerfilProfesional.findOne({
//       _id: newOrder.profesional_id,
//     });
//     usuario.reservas = [...usuario.reservas, newOrder._id];
//     profesionalService.reservas = [
//       ...profesionalService.reservas,
//       newOrder._id,
//     ];

//     await usuario.save();
//     await profesionalService.save();

//     res.send({ newOrder: newOrder._id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const create_Preference = (req, res) => {
//   const orderId = req.params.orderId;
//   let preference = {
//     items: [
//       {
//         title: req.body.description,
//         unit_price: Number(req.body.price),
//         quantity: Number(req.body.quantity),
//       },
//     ],
//     back_urls: {
//       success: `${process.env.BACK}/pay/feedback/success`,
//       failure: `${process.env.BACK}/pay/feedback/failure`,
//       pending: `${process.env.BACK}/pay/feedback/pending`,
//     },
//     auto_return: "approved",

//     payment_methods: {
//       excluded_payment_types: [
//         {
//           id: "ticket",
//         },
//         {
//           id: "bank_transfer",
//         },
//       ],
//     },
//     statement_descriptor: "CALYAAN COLOMBIA",
//     external_reference: `${orderId}`,
//   };

//   mercadopago.preferences
//     .create(preference)
//     .then(function (response) {
//       res.send({
//         id: response.body.id,
//         data: response.body.items,
//       });
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };
// const feedbackSuccess = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference).populate({
//       path: "profesional_id",
//       populate: "disponibilidad",
//     });
//     console.log("ORDEN SUCCES");

//     order.payment_id = payment_id;
//     order.estadoPago = status;
//     order.payment_type = payment_type;
//     order.merchant_order_id = merchant_order_id;

//     let disponibilidadProfesional = await Disponibilidad.findOne({
//       fecha: order.dia_servicio,
//       creador: order.profesional_id._id,
//     });
    
//     const index = disponibilidadProfesional.horarios.findIndex(
//       (item) => item.hora === order.hora_servicio
//     );
//     if (index !== -1) {      
    
//       disponibilidadProfesional.horarios[index].stock = false;  

//       const fechaHoraServicio = new Date(`${order.dia_servicio}T${order.hora_servicio.split('-')[0]}:00`);      
//       const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
//       indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false;  });
  
//     }
    
    
//     await disponibilidadProfesional.save();
//     await order.save();
//     await emailCompra(order);
//     await emailProfesional(order);

//     res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in success route" });
//   }
// };

// const feedbackPending = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference);

//     order.payment_id = payment_id;
//     order.estadoPago = status;
//     order.payment_type = payment_type;
//     order.merchant_order_id = merchant_order_id;

//     await order.save();

//     await emailCompra(order);
//     await emailProfesional(order);

//     res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in pending route" });
//   }
// };

// const feedbackFailure = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference);

//     if (status === "null") {
//       order.estadoPago = "rejected";
//       order.payment_id = payment_id;
//       order.payment_type = payment_type;
//       order.merchant_order_id = merchant_order_id;

//       await order.save();
//       // await emailCompra(order)
//       // await emailProfesional(order)

//       res.redirect(`${process.env.FRONT}/servicios`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in failure" });
//   }
// };

// const payPreferenceManual = async (req, res) => {
//   try {
//     const {
//       usuario,
//       serviciosIds,
//       cliente_id,
//       cantidad,
//       precio,
//       direccion_Servicio,
//       adicional_direccion_Servicio,
//       ciudad_Servicio,
//       localidad_Servicio,
//       telefono_Servicio,
//     } = req.body;

//     console.log(cliente_id);

//     let usuarioNuevo = await Usuario.findOne({ _id: cliente_id });

//     console.log(usuarioNuevo);

//     if (!usuarioNuevo) {
//       const error = new Error("El usuario no esta registrado");
//       return res.status(404).json({ msg: error.message });
//     }

//     const updateUsuario = await Usuario.findOneAndUpdate(
//       { _id: cliente_id },
//       {
//         nombre: usuario.cliente_nombre,
//         apellido: usuario.cliente_apellido,
//         cedula: usuario.cliente_cedula,
//         telefono: usuario.cliente_telefono,
//       },
//       { new: true }
//     );

//     const serviciosSearch = await Producto.findOne({
//       idWP: { $in: serviciosIds },
//     });

//     const arrayPreference = {
//       cliente_id: updateUsuario._id,
//       cliente_email: updateUsuario.email,
//       cliente_nombre: updateUsuario.nombre,
//       cliente_apellido: updateUsuario.apellido,
//       cliente_cedula: updateUsuario.cedula,
//       cliente_telefono: updateUsuario.telefono,
//       servicio: serviciosSearch.nombre,
//       servicio_img: serviciosSearch.img,
//       cantidad: cantidad,
//       precio: precio,
//       direccion_Servicio,
//       adicional_direccion_Servicio,
//       ciudad_Servicio,
//       localidad_Servicio,
//       telefono_Servicio,
//     };

//     const newOrder = await new Orden(arrayPreference);

//     await newOrder.save();

//     usuarioNuevo.reservas = [...usuarioNuevo.reservas, newOrder._id];

//     await usuarioNuevo.save();

//     res.send({ newOrder: newOrder._id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const feedbackSuccessManual = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference);

//     order.payment_id = payment_id;
//     order.estadoPago = status;
//     order.payment_type = payment_type;
//     order.merchant_order_id = merchant_order_id;

//     await order.save();

//     res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in success route" });
//   }
// };

// const feedbackPendingManual = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference);

//     order.payment_id = payment_id;
//     order.estadoPago = status;
//     order.payment_type = payment_type;
//     order.merchant_order_id = merchant_order_id;

//     await order.save();

//     res.redirect(`${process.env.FRONT}/resumen/${external_reference}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in pending route" });
//   }
// };

// const feedbackFailureManual = async (req, res) => {
//   try {
//     const {
//       payment_id,
//       status,
//       payment_type,
//       merchant_order_id,
//       external_reference,
//     } = req.query;

//     const order = await Orden.findById(external_reference);

//     if (status === "null") {
//       order.estadoPago = "rejected";
//       order.payment_id = payment_id;
//       order.payment_type = payment_type;
//       order.merchant_order_id = merchant_order_id;

//       await order.save();

//       res.redirect(`${process.env.FRONT}/servicios`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error in failure" });
//   }
// };

// const updatePayOrder = async (req, res) => {
  

//   try {
//     const { _id } = req.body;

//     if (!_id) {
//       return res
//         .status(400)
//         .json({ error: "Se requiere un valor válido para _id" });
//     }

//     const order = await Orden.findOneAndUpdate(
//       { _id },
//       { ...req.body },
//       { new: true }
//     );

//     if (!order) {
//       return res
//         .status(404)
//         .json({ error: "No se encontró la orden especificada" });
//     }

//     let disponibilidadProfesional = await Disponibilidad.findOne({
//       fecha: order.dia_servicio,
//       creador: order.profesional_id._id,
//     });

//     if (!disponibilidadProfesional) {
//       return res
//         .status(404)
//         .json({ error: "No se encontró la disponibilidad del profesional" });
//     }
//     const index = disponibilidadProfesional.horarios.findIndex(
//       (item) => item.hora === order.hora_servicio      
//     );
    
//     if (index !== -1) {
//       disponibilidadProfesional.horarios[index].stock = false;  

//       const fechaHoraServicio = new Date(`${order.dia_servicio}T${order.hora_servicio.split('-')[0]}:00`);      
//       const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
//       indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = false;  });
  
//     }
//     console.log("orden almacenada actualizada con nueva reservacion");
    

//     await disponibilidadProfesional.save();
//     await order.save();

//     await emailCompra(order);
//     await emailProfesional(order);

//     res.status(200).json({ msg: "Orden agendada correctamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error en el servidor" });
//   }
// };

// const liberarReserva = async (req, res) => {
  
//   try {
//     const {
//       _id,
//       cliente_nombre,
//       cliente_apellido,
//       liberar_hora_servicio,
//       liberar_dia_servicio,
//       liberar_profesional_id,
//       liberar_profesional_email,
//       liberar_profesional_telefono,      
//     } = req.body;

//     if (
//       liberar_hora_servicio &&
//       liberar_dia_servicio &&
//       liberar_profesional_id
//     ) {
//       let disponibilidadProfesional = await Disponibilidad.findOne({
//         fecha: liberar_dia_servicio,
//         creador: liberar_profesional_id,
//       });

//       if (!disponibilidadProfesional) {
//         throw new Error(
//           "No se encontró la disponibilidad del profesional para la reprogramación"
//         );
//       }

      

//       const index = disponibilidadProfesional.horarios.findIndex(
//         (item) => item.hora === liberar_hora_servicio
//       );

//       if (index !== -1) {
//         disponibilidadProfesional.horarios[index].stock = true;

//       const fechaHoraServicio = new Date(`${liberar_dia_servicio}T${liberar_hora_servicio.split('-')[0]}:00`);      
//       const indicesCumplenCondicion = obtenerIndicesCumplenCondicion(disponibilidadProfesional, fechaHoraServicio);
//       indicesCumplenCondicion.forEach(index => { disponibilidadProfesional.horarios[index].stock = true;  });
//       }        
        
//       console.log(
//         "disponibilidad profesional restablecida"
        
//       );
//       await disponibilidadProfesional.save();
//       // Comentado por ahora, implementar la notificación de reprogramación si es necesario

//       await emailCancelacionProfesional({
//         _id,
//         cliente_nombre,
//         cliente_apellido,
//         liberar_hora_servicio,
//         liberar_dia_servicio,
//         liberar_profesional_id,
//         liberar_profesional_email,
//         liberar_profesional_telefono,
//       });
//       res.status(200).json({ msg: "Orden agendada correctamente" });
//     }
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error al reprogramar la reserva");
//   }
// };


// export {
//   payPreference,
//   create_Preference,
//   feedbackSuccess,
//   feedbackPending,
//   feedbackFailure,
//   payPreferenceManual,
//   feedbackSuccessManual,
//   feedbackPendingManual,
//   feedbackFailureManual,
//   updatePayOrder,
//   liberarReserva,
// };

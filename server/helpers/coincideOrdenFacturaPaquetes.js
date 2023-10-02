import Orden from "../models/OrderModel.js";
import Factura from "../models/FacturaModel.js";
import { extraerNumeroDeNombre } from "./extraerNumeroDeNombre.js";

export async function coincideOrdenFacturaPaquetes(order, factura) {

console.log("order", order.servicios[0].nombre)
console.log("factura",factura.id)

  try {
    
    const numeroDePaquete = extraerNumeroDeNombre(order.servicios);
    console.log("Número de paquete:", numeroDePaquete);

    if (numeroDePaquete <= 1) {
      return; // No se generan órdenes ni facturas si es 1 o menos
    }

    const precioSubTotal = factura.precioSubTotal;
    const precioTotal = precioSubTotal / numeroDePaquete;

    for (let i = 1; i < numeroDePaquete; i++) {      

      const FacturaOrden = new Factura({
        estadoPago: factura.estadoPago,
        payment_id: factura.payment_id,
        payment_type: factura.payment_type,
        merchant_order_id: factura.merchant_order_id,  
        descuentoFidelidad: factura.descuentoFidelidad,     
        origen: factura.origen,
        servicios: factura.servicios,
        orden: factura.orden, 
        precioNeto: factura.precioNeto,
        precioSubTotal,
        precioTotal,
        coupon: factura.coupon,
        metodo_pago: factura.metodo_pago
      });

      const facturaNueva = await FacturaOrden.save();         
      
      const OrdenPendiente = new Orden({
        cliente_id: order.cliente_id,
        profesional_id: order.profesional_id,
        servicios: order.servicios,
        nroSesion: `Sesion ${i+1}`,        
        factura: facturaNueva._id,
        direccion_servicio: order.direccion_servicio,
        adicional_direccion_servicio: order.adicional_direccion_servicio,
        localidad_servicio: order.localidad_servicio,
        telefono_servicio: order.telefono_servicio,
        cita_servicio: i > 0 ? "" : order.cita_servicio,
        hora_servicio: i > 0 ? "" : order.hora_servicio,
        localidad_servicio: order.localidad_servicio,
        paquetesGenerados: true,
      }); 
     
      const ordenNueva = await OrdenPendiente.save();
      console.log("ORDEN NUEVA")
      facturaNueva.orden = ordenNueva._id;
      await facturaNueva.save();
      console.log("Factura y orden adicionales creadas:", facturaNueva._id, ordenNueva._id);
    }

    // Actualizar la factura original con el nuevo precio total
    factura.precioTotal = precioTotal;
    await factura.save();
    console.log("Factura original actualizada con nuevo precio total:", factura._id, order._id);
  } catch (error) {
    console.error(error);
  }
}

//funcion sin contador de sesiones
// import Orden from "../models/OrderModel.js";
// import Factura from "../models/FacturaModel.js";
// import { extraerNumeroDeNombre } from "./extraerNumeroDeNombre.js";

// export async function coincideOrdenFacturaPaquetes(order, factura) {

// console.log("order",order)
// console.log("factura",factura)

//   try {
    
//     const numeroDePaquete = extraerNumeroDeNombre(order.servicios);
//     console.log("Número de paquete:", numeroDePaquete);

//     if (numeroDePaquete <= 1) {
//       return; // No se generan órdenes ni facturas si es 1 o menos
//     }

//     const precioSubTotal = factura.precioSubTotal;
//     const precioTotal = precioSubTotal / numeroDePaquete;

//     for (let i = 1; i < numeroDePaquete; i++) {
//       const FacturaOrden = new Factura({
//         estadoPago: factura.estadoPago,
//         payment_id: factura.payment_id,
//         payment_type: factura.payment_type,
//         merchant_order_id: factura.merchant_order_id,  
//         descuentoFidelidad: factura.descuentoFidelidad,     
//         origen: factura.origen,
//         servicios: factura.servicios,
//         orden: factura.orden, 
//         precioNeto: factura.precioNeto,
//         precioSubTotal,
//         precioTotal,
//         coupon: factura.coupon,
//         metodo_pago: factura.metodo_pago
//       });

//       const facturaNueva = await FacturaOrden.save();

//       const OrdenPendiente = new Orden({
//         cliente_id: order.cliente_id,
//         profesional_id: order.profesional_id,
//         servicios: order.servicios,
//         factura: facturaNueva._id,
//         direccion_servicio: order.direccion_servicio,
//         adicional_direccion_servicio: order.adicional_direccion_servicio,
//         localidad_servicio: order.localidad_servicio,
//         telefono_servicio: order.telefono_servicio,
//         cita_servicio: i > 0 ? "" : order.cita_servicio,
//         hora_servicio: i > 0 ? "" : order.hora_servicio,
//         localidad_servicio: order.localidad_servicio,
//         paquetesGenerados: true,
//       });

//       const ordenNueva = await OrdenPendiente.save();
//       facturaNueva.orden = ordenNueva._id;
//       await facturaNueva.save();
//       console.log("Factura y orden adicionales creadas:", facturaNueva._id, ordenNueva._id);
//     }

//     // Actualizar la factura original con el nuevo precio total
//     factura.precioTotal = precioTotal;
//     await factura.save();
//     console.log("Factura original actualizada con nuevo precio total:", factura._id, order._id);
//   } catch (error) {
//     console.error(error);
//   }
// }
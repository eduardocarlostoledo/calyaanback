import Orden from "../models/OrderModel.js";
import Factura from "../models/FacturaModel.js";
import { extraerNumeroDeNombre } from "./extraerNumeroDeNombre.js";

export async function coincideOrdenFacturaPaquetes(order, factura) {

console.log("order",order)
console.log("factura",factura)

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

// import Orden from "../models/OrderModel";
// import Factura from "../models/FacturaModel";
// import { extraerNumeroDeNombre } from "./extraerNumeroDeNombre";


// export function coincideOrdenFacturaPaquetes (order, factura) {
//     try {
//         const numeroDePaquete = extraerNumeroDeNombre(order.servicios[0].nombre);

//         const orders = getOrdersByFactura(factura);

//         for (const order of orders) {

//             const ordenes = [];
//             const facturas = [];
//             for (let i = 0; i < numeroDePaquete; i++) {        
          
//               const FacturaOrden = new Factura({
//                   precioNeto,
//                   precioSubTotal,
//                   precioTotal: precioSubTotal / numeroDePaquete,
//                   coupon,
//                   fecha_venta: new Date(),
//                   origen: "Mercado Pago",
//                   servicios: serviciosGuardar,
//                   metodo_pago: "Mercado Pago"
//                 });
              
//                 const factura = FacturaOrden.save();
          
//               const OrdenPendiente = new Orden({
//                 cliente_id: parsedProfile._id,
//                 profesional_id: parsedProfessionalService.profesional_id,
//                 servicios: serviciosGuardar,
//                 factura: factura._id,
//                 direccion_servicio: parsedData_customer.address,
//                 adicional_direccion_servicio: parsedData_customer.address2,
//                 localidad_servicio: parsedDateService.localidadServicio,
//                 telefono_servicio: parsedData_customer.telefono,
//               });
          
//               // Si el paquete es el 0, se mantiene la cita y hora de servicio que se ingresó en el formulario
//               if (i > 0) {      
//                 // Para los paquetes del 1 al 9, se deja "Agendar" en cita_servicio y hora_servicio para coordinar reserva
//                 OrdenPendiente.cita_servicio = "Agendar";
//                 OrdenPendiente.hora_servicio = "Agendar";
//               }    
          
//               const orden =  OrdenPendiente.save();
//               factura.orden = orden._id;
//               factura.save();
//               facturas.push(factura); // Guardamos cada factura en el array
//               ordenes.push(orden); // Guardamos cada orden en el array
//             }            
//             console.log("Orden actualizada", order._id);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }
   
// //solicito todas las ordenes que tengan la factura que estoy actualizando
// async function getOrdersByFactura(factura) {
//     return await Orden.find({ factura: factura })
//       .populate({ path: "profesional_id", populate: [{ path: "disponibilidad" }, { path: "creador" }] })
//       .populate({ path: "cliente_id" })
//       .populate({ path: "servicios" })
//       .populate({ path: "factura" });
//   }
       



    

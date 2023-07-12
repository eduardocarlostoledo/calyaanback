import express from "express";
import Factura from "../models/FacturaModel.js";
import checkAuth from "../middlewares/checkAuth.js";
import Orden from "../models/OrderModel.js";

const invoiceRoutes = express.Router();

invoiceRoutes.get('/invoice', async (req, res, next) => {
    try {
        const facturas = await Orden.find().sort({ createdAt: -1 })
            .populate({ path: "cliente_id", select: "_id nombre apellido email cedula telefono direccionDefault", populate: { path: "direccionDefault", select: "-createdAt -updateAt -cliente" } })
            .populate({ path: "factura", select: "-__v -orden -servicios" })
            .populate({ path: "profesional_id", select: "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt", populate: { path: "creador", select: "_id nombre apellido email cedula telefono direccionDefault" } })
            .populate({ path: "servicios", select: "_id nombre precio link" })
            .lean()


        const facturasConCliente = facturas.map((factura) => {
            const { creador, ...restoOrden } = factura.profesional_id;
            return {
                ...factura,
                profesional_id: {...creador,...restoOrden}
            };
        });

        res.status(200).json(facturasConCliente);
    } catch (err) {
        next(err);
    }
});

invoiceRoutes.get('/getinvoicebyid/:id', async (req, res, next) => {
    try {
        const facturas = await Orden.find().sort({ createdAt: -1 })
            .populate({ path: "cliente_id", select: "_id nombre apellido email cedula telefono direccionDefault", populate: { path: "direccionDefault", select: "-createdAt -updateAt -cliente" } })
            .populate({ path: "factura", select: "-__v -orden -servicios" })
            .populate({ path: "profesional_id", select: "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt", populate: { path: "creador", select: "_id nombre apellido email cedula telefono direccionDefault" } })
            .populate({ path: "servicios", select: "_id nombre precio link" })
            .lean()

        if (!facturas) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        const facturasConCliente = [...facturas].map((factura) => {
            const { creador, ...restoOrden } = factura.profesional_id;
            return {
                ...factura,
                profesional_id: {...creador,...restoOrden}
            };
        });

        res.status(200).json(facturasConCliente[0]);
    } catch (err) {
        next(err);
    }
});

invoiceRoutes.put('/updateinvoice', async (req, res, next) => {


    const { _id, estadoPago, nro_factura, payment_id, origen } = req.body

    try {
        const facturas = await Factura.findById(_id)
          
        if (!facturas) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        if (estadoPago) {
            facturas.estadoPago = estadoPago;
        }

        if (nro_factura) {
            facturas.nro_factura = nro_factura;
        }

        if (origen) {
            facturas.origen = origen;
        }

        if (payment_id) {
            facturas.payment_id = payment_id;
        }

       let actualizado = await facturas.save()
   
        console.log(actualizado)

  /*       const facturasRequest = await Orden.find().sort({ createdAt: -1 })
        .populate({ path: "cliente_id", select: "_id nombre apellido email cedula telefono direccionDefault", populate: { path: "direccionDefault", select: "-createdAt -updateAt -cliente" } })
        .populate({ path: "factura", select: "-__v -orden -servicios" })
        .populate({ path: "profesional_id", select: "-referidos -reservas -preferencias -codigorefereido -createdAt -updateAt", populate: { path: "creador", select: "_id nombre apellido email cedula telefono direccionDefault" } })
        .populate({ path: "servicios", select: "_id nombre precio link" })
        .lean()

        const facturasConCliente = [...facturasRequest].map((factura) => {
            const { creador, ...restoOrden } = factura.profesional_id;
            return {
                ...factura,
                profesional_id: {...creador,...restoOrden}
            };
        });
 */

        res.status(200).json({
            msg: "Factura actualizada correctamente"
        });
    } catch (err) {
        next(err);
    }
});

export default invoiceRoutes;

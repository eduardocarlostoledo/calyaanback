import express from "express";
import Factura from "../models/FacturaModel.js";
import checkAuth from "../middlewares/checkAuth.js";
import Orden from "../models/OrderModel.js";
import isAdminRole from "../middlewares/isAdminRole.js";

const invoiceRoutes = express.Router();

invoiceRoutes.get("/invoice", async (req, res, next) => {
  try {
    const facturas = await Orden.find()
      .sort({ createdAt: -1 })
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
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault",
        },
      })
      .populate({ path: "servicios", select: "_id nombre precio link" })
      .lean();

    const facturasConCliente = facturas.map((factura) => {
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

    res.status(200).json(facturasConCliente);
  } catch (err) {
    next(err);
  }
});

invoiceRoutes.get("/getinvoicebyid/:id", async (req, res, next) => {
  try {
    const facturas = await Orden.find()
      .sort({ createdAt: -1 })
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
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault",
        },
      })
      .populate({ path: "servicios", select: "_id nombre precio link" })
      .lean();

    if (!facturas) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    const facturasConCliente = [...facturas].map((factura) => {
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

    res.status(200).json(facturasConCliente[0]);
  } catch (err) {
    next(err);
  }
});

invoiceRoutes.put("/updateinvoice", 
checkAuth, isAdminRole, async (req, res, next) => {
  const {
    _id,
    estadoPago,
    nro_factura,
    payment_id,
    estado_facturacion,
    origen,
  } = req.body;

  try {
    console.log("ENTRO A INVOICE ROUOTES", req.body);

    if (estado_facturacion!=="Facturado" || !nro_factura) return res.status(400).json({ message: "Para cambiar el estado de facturacion se necesita una factura de siigo }" });

    const facturas = await Factura.findById(_id);

    if (!facturas) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (estadoPago) {
      facturas.estadoPago = estadoPago;
    }

    if (estado_facturacion && nro_factura) {
      facturas.estado_facturacion = estado_facturacion;
      facturas.nro_factura = nro_factura;
    }  

    if (origen) {
      facturas.origen = origen;
    }

    if (payment_id) {
      facturas.payment_id = payment_id;    
    }

    let actualizado = await facturas.save();

    res.status(200).json({
      msg: "Factura actualizada correctamente",
      actualizado,
    });
  } catch (err) {
    next(err);
  }
});

export default invoiceRoutes;

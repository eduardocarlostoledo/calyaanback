import express from "express";
import Coupon from "../models/CouponModel.js";
import checkAuth from "../middlewares/checkAuth.js";

const couponRoutes = express.Router();

// Nuevo Cupon
couponRoutes.post('', checkAuth, async (req, res) => {
  try {
    const { codigo } = req.body;

    const existingCoupon = await Coupon.findOne({ codigo });
    if (existingCoupon) {
      return res.status(400).json({ msg: 'El código del cupón ya ha sido utilizado' });
    }

    const coupon = new Coupon(req.body);
    //coupon.reclamados.push(req.usuario._id);
    await coupon.save();
    res.status(201).json({ coupon, msg: "Cupón generado exitosamente" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Obtener Descuento
couponRoutes.post('/discount', checkAuth, async (req, res) => {

  const { valor, coupon } = req.body;

  try {
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

    let valorTotal;
    if (existeCupon.tipoDescuento === 'porcentaje') {
      valorTotal = valor - (valor * (existeCupon.descuento / 100));
    } else {
      valorTotal = valor - existeCupon.descuento;
    }

    if (valorTotal < 0) {
      return res.status(400).json({ msg: 'No es posible redimir el cupón dado que es mayor al costo del servicio' });
    }

    res.status(200).json({ _idCodigo: existeCupon._id, codigo: existeCupon.codigo, descuento: existeCupon.descuento, tipoDescuento: existeCupon.tipoDescuento, valor, valorTotal });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Listar cupones
couponRoutes.get('/list-coupons', checkAuth, async (req, res) => {
  try {
    const cuponesVigentes = await Coupon.find({ vencimiento: { $gte: new Date() }, eliminado: false }).populate({path: "reclamados", select: "nombre apellido _id telefono email" })
    const cuponesNoVigentes = await Coupon.find({ vencimiento: { $lt: new Date() }, eliminado: false }).populate({path: "reclamados", select: "nombre apellido _id telefono email" })

    res.json({ cuponesVigentes, cuponesNoVigentes });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Eliminar cupon
couponRoutes.patch('/delete/:cuponId', checkAuth, async (req, res) => {
  try {
    const cuponId = req.params.cuponId;

    const cupon = await Coupon.findById(cuponId);
    if (!cupon) {
      return res.status(404).json({ mdg: 'Cupón no encontrado' });
    }

    cupon.eliminado = true;
    await cupon.save();

    res.json({ msg: "Cupón eliminado exitosamente" });
  } catch (error) {

    res.status(400).json({ msg: error.message });
  }
});




export default couponRoutes;

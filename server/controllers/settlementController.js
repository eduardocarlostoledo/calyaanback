import Liquidacion from "../models/LiquidacionModel.js";

const createSettlement = async (req, res, next) => {
  try {
    const {
      numeroLiquidacion,
      estadoLiquidacion,
      profesional,
      ordenes,
      rangodefechasLiquidadas,
      totalLiquidacion
    } = req.body;

    if (!numeroLiquidacion || !estadoLiquidacion || !profesional || !ordenes || !rangodefechasLiquidadas || !totalLiquidacion) {
      res.status(400);
      throw new Error("Faltan datos para almacenar la liquidacion o existen datos no validos");
    }

    const liquidacion = new Liquidacion({
      numeroLiquidacion,
      estadoLiquidacion,
      profesional,
      ordenes,
      rangodefechasLiquidadas,
      totalLiquidacion
    });

    const createdLiquidacion = await liquidacion.save();
    res.status(201).json(createdLiquidacion);
  } catch (err) {
    next(err);
  }
};

const updateSettlement = async (req, res, next) => {
    console.log("updateSettlement", req.body)

  try {
    const {
      _id,
      numeroLiquidacion,
      estadoLiquidacion,
      profesional,
      ordenes,
      rangodefechasLiquidadas,
      totalLiquidacion
    } = req.body;

    if (!_id || !numeroLiquidacion || !estadoLiquidacion || !profesional || !ordenes || !rangodefechasLiquidadas || !totalLiquidacion) {
      res.status(400);
      throw new Error("Faltan datos para modificar la liquidacion o existen datos no validos");
    }

    const liquidacion = await Liquidacion.findById(_id)
      .populate({
        path: "profesional",
        select: "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault"
        }
      })
      .populate({ path: "ordenes", select: "-__v -orden -servicios" });
      

    if (!liquidacion) {
      res.status(404);
      throw new Error("Liquidacion no encontrada");
    }

    liquidacion.numeroLiquidacion = numeroLiquidacion;
    liquidacion.estadoLiquidacion = estadoLiquidacion;
    liquidacion.profesional = profesional;
    liquidacion.ordenes = ordenes;
    liquidacion.rangodefechasLiquidadas = rangodefechasLiquidadas;
    liquidacion.totalLiquidacion = totalLiquidacion;

    const updatedLiquidacion = await liquidacion.save();
    res.status(200).json(updatedLiquidacion);
  } catch (err) {
    next(err);
  }
};

const getAllSettlement = async (req, res, next) => {
  try {
    const liquidaciones = await Liquidacion.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "profesional",
        select: "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
        populate: {
          path: "creador",
          select: "_id nombre apellido email cedula telefono direccionDefault"
        }
      })
      .populate({ path: "ordenes", select: "-__v -orden -servicios" })
      .lean();

    res.status(200).json(liquidaciones);
  } catch (err) {
    next(err);
  }
};

const getSettlementById = async (req, res, next) => {
    try {
      const liquidacion = await Liquidacion.findById(req.params.id)
        .populate({
          path: "profesional",
          select: "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
          populate: {
            path: "creador",
            select: "_id nombre apellido email cedula telefono direccionDefault"
          }
        })
        .populate({ path: "ordenes", select: "-__v -orden -servicios" })
        .lean();
  
      if (!liquidacion) {
        res.status(404).json({ message: "No se encontró la liquidación" });
        return;
      }
  
      res.status(200).json(liquidacion);
    } catch (err) {
      next(err);
    }
  };
  

const deleteSettlement = async (req, res, next) => {
  try {
    const liquidacion = await Liquidacion.findById(req.params.id);

    if (!liquidacion) {
      res.status(404);
      throw new Error("Liquidacion no encontrada");
    }

    await liquidacion.remove();
    res.status(200).json({ message: "Liquidacion eliminada" });
  } catch (err) {
    next(err);
  }
};

const getSettlementesByUserId = async (req, res, next) => {
    
    try {
        console.log("getSettlementesByUserId", req.params.id)
      const liquidaciones = await Liquidacion.find({ profesional: req.params.id })
        .populate({
          path: "profesional",
          select: "-referidos -reservas -preferencias -especialidad -codigoreferido -createdAt -updatedAt -disponibilidad -localidadesLaborales",
          populate: {
            path: "creador",
            select: "_id nombre apellido email cedula telefono direccionDefault"
          }
        })
        .populate({ path: "ordenes", select: "-__v -orden -servicios" })
        .lean();
  
      if (!liquidaciones) {
        res.status(404);
        throw new Error("No se encontraron liquidaciones para el usuario");
      }
  
      res.status(200).json(liquidaciones);
    } catch (err) {
      if (err.kind === "ObjectId") {
        res.status(404);
        throw new Error("Usuario no encontrado");
      }
      next(err);
    }
  };
  

export {
    createSettlement, updateSettlement, getAllSettlement, getSettlementById, deleteSettlement, getSettlementesByUserId
};


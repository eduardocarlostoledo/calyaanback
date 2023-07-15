import Liquidacion from "../models/LiquidacionModel.js";
import Orden from "../models/OrderModel.js";
import PerfilProfesional from "../models/ProfessionalModel.js";


const createSettlement = async (req, res, next) => {
  try {
    const {
      numeroLiquidacion,
      estadoLiquidacion,
      profesional,
      ordenes,
      fechaInicio,
      fechaFin,
      totalLiquidacion
    } = req.body;

    if (!numeroLiquidacion || !estadoLiquidacion || !profesional || !ordenes || !fechaInicio || !fechaFin || !totalLiquidacion) {
      res.status(400);
      throw new Error("Faltan datos para almacenar la liquidacion o existen datos no validos");
    }
 // Buscar documentos correspondientes a los _id de ordenes en el modelo Ordenes
 const ordenesIds = await Promise.all(ordenes.map(async (ordenId) => {
    const orden = await Orden.findById(ordenId);
    if (!orden) {
      res.status(400);
      throw new Error(`No se encontró la orden con el ID: ${ordenId}`);
    }
    return orden._id;
  }));

  // Buscar el documento correspondiente al ID almacenado en la propiedad profesional
  const perfilProfesional = await PerfilProfesional.findById(profesional);
  if (!perfilProfesional) {
    res.status(400);
    throw new Error(`No se encontró el perfil profesional con el ID: ${profesional}`);
  }

  const liquidacion = new Liquidacion({
    numeroLiquidacion,
    estadoLiquidacion,
    profesional: perfilProfesional._id, // Almacenar el ObjectId del profesional en lugar del _id
    ordenes: ordenesIds, // Almacenar los ObjectId de las ordenes
    fechaInicio,
    fechaFin,
    totalLiquidacion
  });

    const createdLiquidacion = await liquidacion.save();
    res.status(201).json(createdLiquidacion);
  } catch (err) {
    next(err);
  }
};

const updateSettlement = async (req, res, next) => {
  console.log("updateSettlement", req.body);

  try {
    const {
      _id,
      numeroLiquidacion,
      estadoLiquidacion,
      profesional,
      ordenes,
      fechaInicio,
      fechaFin,
      totalLiquidacion
    } = req.body;

    if (!_id || !numeroLiquidacion || !estadoLiquidacion || !profesional || !ordenes || !fechaInicio ||
        !fechaFin || !totalLiquidacion) {
      res.status(400);
      throw new Error("Faltan datos para modificar la liquidacion o existen datos no validos");
    }

    // Buscar coincidencias dentro del modelo Ordenes y almacenar sus ObjectId
    const ordenesIds = await Promise.all(ordenes.map(async (ordenId) => {
      const orden = await Orden.findById(ordenId);
      if (!orden) {
        res.status(400);
        throw new Error(`No se encontró la orden con el ID: ${ordenId}`);
      }
      return orden._id;
    }));

    // Buscar coincidencias dentro del modelo PerfilProfesional y almacenar su ObjectId
    const perfilProfesional = await PerfilProfesional.findById(profesional);
    if (!perfilProfesional) {
      res.status(400);
      throw new Error(`No se encontró el perfil profesional con el ID: ${profesional}`);
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
    liquidacion.profesional = perfilProfesional._id; // Almacenar el ObjectId del profesional en lugar del _id
    liquidacion.ordenes = ordenesIds; // Almacenar los ObjectId de las ordenes
    liquidacion.fechaInicio = fechaInicio;
    liquidacion.fechaFin = fechaFin;
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


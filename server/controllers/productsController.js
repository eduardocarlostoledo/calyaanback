import Producto from "../models/ProductModel.js";

const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findOne({ idWP: id });

    if (!producto) {
      return res.json("El producto no existe");
    }

    return res.json(producto);
  } catch (error) {
    res.json(error);
  }
};
//solo para testing
const getProducts = async (req, res, next) => {
  try {
    const products = await Producto.find().select("-createdAt -updatedAt");
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getProductName = async (req, res, next) => {

  const {nombre} = req.params;

  try {
    const product = await Producto.findOne({nombre});
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};


export { obtenerProducto, getProducts,getProductName };

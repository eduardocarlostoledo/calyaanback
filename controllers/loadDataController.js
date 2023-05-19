import axios from "axios";
import Producto from "../models/ProductModel.js";

const cargarProductosWP = async (req, res) => {
  let { data } = await axios.get(
    "https://calyaan.com/wp-json/wc/v3/products?consumer_key=ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1&consumer_secret=cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc"
  );

  try {
    await data.map(async (productoState) => {
      let producto = await new Producto({
        nombre: productoState.name,
        idWP: productoState.id,
        img: productoState.images[0].src,
        descripcion: productoState.short_description,
        precio: productoState.price,
        precio_regular: productoState.regular_price,
        link: productoState.permalink
      });

      await producto.save();
    });

    const allProductos =  await Producto.find()

    return res.json(allProductos);
  } catch (error) {
    console.log(error);
  }
};

export { cargarProductosWP };

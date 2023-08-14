import axios from "axios";
import Producto from "../models/ProductModel.js";


const cargarProductosWP = async (req, res) => {
  //cargar primero la pagina 1 y luego la pagina 2 para llenar la db de productos.
  let { data } = await axios.get(
    "https://calyaan.com/wp-json/wc/v3/products?consumer_key=ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1&consumer_secret=cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc&per_page=100&page=1"
  );

  // let { data } = await axios.get(
  //   "https://calyaan.com/wp-json/wc/v3/products?consumer_key=ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1&consumer_secret=cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc&per_page=100&page=2"
  // );

  try {
    const allProductos = await Promise.all(data.map(async (productoState) => {
      const nombre = productoState.name ?? "";
      const idWP = productoState.id ?? "";
      const img = productoState.images?.[0]?.src ?? "";
      const descripcion = productoState.short_description ?? "";
      const precio = productoState.price ?? "";
      const precio_regular = productoState.regular_price ?? "";
      const link = productoState.permalink ?? "";

      const producto = new Producto({
        nombre,
        idWP,
        img,
        descripcion,
        precio,
        precio_regular,
        link
      });

      await producto.save();
      return producto;
    }));

    return res.json(allProductos);
  } catch (error) {
    console.log(error);
  }
};

export { cargarProductosWP };

// //este endpoint se usa para cargar 1 id de wordpress a app de calyaan
// const cargarProductosWP = async (req, res) => {
//   const productIds = [816];
//   const consumerKey = "ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1";
//   const consumerSecret = "cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc";

//   try {
//     const allProductos = [];

//     for (const id of productIds) {
//       const url = `https://calyaan.com/wp-json/wc/v3/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
//       const { data } = await axios.get(url);

//       const nombre = data.name ?? "";
//       const idWP = data.id ?? "";
//       const img = data.images?.[0]?.src ?? "";
//       const descripcion = data.short_description ?? "";
//       const precio = data.price ?? "";
//       const precio_regular = data.regular_price ?? "";
//       const link = data.permalink ?? "";

//       const producto = new Producto({
//         nombre,
//         idWP,
//         img,
//         descripcion,
//         precio,
//         precio_regular,
//         link
//       });

//       await producto.save();
//       allProductos.push(producto);
//     }

//     return res.json(allProductos);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Error al cargar los productos" });
//   }
// };

// export { cargarProductosWP };


import axios from "axios";
import Producto from "../models/ProductModel.js";


const cargarProductosWP = async (req, res) => {
  //cargar primero la pagina 1 y luego la pagina 2 para llenar la db de productos.
  try {      
     const { data } = await axios.get(
        "https://calyaan.com/wp-json/wc/v3/products?consumer_key=ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1&consumer_secret=cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc&per_page=100&page=1"
      );
  
      for (const productoState of data) {
        const nombre = productoState.name ?? "";
        const idWP = productoState.id ?? "";
        const img = productoState.images?.[0]?.src ?? "";
        const descripcion = productoState.short_description ?? "";
        const precio = productoState.price ?? "";
        const precio_regular = productoState.regular_price ?? "";
        const link = productoState.permalink ?? "";
  
        // Buscamos si el producto ya existe en la base de datos por su idWP
        const productoExistente = await Producto.findOne({ idWP });
  
        // Si el producto existe, actualizamos sus datos
        if (productoExistente) {
          productoExistente.nombre = nombre;
          productoExistente.img = img;
          productoExistente.descripcion = descripcion;
          productoExistente.precio = precio;
          productoExistente.precio_regular = precio_regular;
          productoExistente.link = link;
  
          await productoExistente.save();
        } else {
          // Si el producto no existe, lo creamos
          const nuevoProducto = new Producto({
            nombre,
            idWP,
            img,
            descripcion,
            precio,
            precio_regular,
            link
          });
  
          await nuevoProducto.save();
        }
      }
  
      res.json({ message: "Productos actualizados y creados exitosamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar los productos" });
    }
  }


// const cargarProductosWP = async (req, res) => {
//   let { data } = await axios.get(
//     "https://calyaan.com/wp-json/wc/v3/products?consumer_key=ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1&consumer_secret=cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc"
//   );

//   try {
//     await data.map(async (productoState) => {
//       let producto = await new Producto({
//         nombre: productoState.name,
//         idWP: productoState.id,
//         img: productoState.images[0].src,
//         descripcion: productoState.short_description,
//         precio: productoState.price,
//         precio_regular: productoState.regular_price,
//         link: productoState.permalink
//       });

//       await producto.save();
//     });

//     const allProductos =  await Producto.find()

//     return res.json(allProductos);
//   } catch (error) {
//     console.log(error);
//   }
// };

export { cargarProductosWP };

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

// Controlador para crear un nuevo producto
const crearNuevoProducto = async (req, res) => {
  try {
    //console.log(req.body);
    // Extrae los datos del cuerpo de la solicitud
    const { nombre, idWP, img, descripcion, precio, precio_regular, link } = req.body;

    // Crea una nueva instancia de Producto con los datos proporcionados
    const producto = new Producto({
      nombre,
      idWP,
      img,
      descripcion,
      precio,
      precio_regular,
      link
    });

    // Guarda el nuevo producto en la base de datos
    await producto.save();

    // Envía una respuesta con el producto creado
    return res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el producto" });
  }
};

// //este endpoint se usa para cargar 1 id de wordpress a app de calyaan
const crearNuevoProductoID = async (req, res) => {
  try {
    // Extrae el id del cuerpo de la solicitud se pasa solamente el ID DEL PRODUCTO DE WORDPRESS para que se guarde en la db de app calyaan
    const productIds = [req.body.id];
    const consumerKey = "ck_07f6b677aea21f6f0e0766ddefddd5ffdec3f7e1";
    const consumerSecret = "cs_bcbd1af0cd51ddcd8b65dcf87990100945b5fddc";

    const allProductos = [];

    for (const id of productIds) {
      const url = `https://calyaan.com/wp-json/wc/v3/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
      const { data } = await axios.get(url);

      const nombre = data.name ?? "";
      const idWP = data.id ?? "";
      const img = data.images?.[0]?.src ?? "";
      const descripcion = data.short_description ?? "";
      const precio = data.price ?? "";
      const precio_regular = data.regular_price ?? "";
      const link = data.permalink ?? "";

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
      allProductos.push(producto);
    }

    return res.json(allProductos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al cargar los productos" });
  }
};

export { cargarProductosWP, crearNuevoProducto, crearNuevoProductoID };

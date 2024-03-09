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
    const { nombre, idWP, img, descripcion, precio, precio_regular, link, porcetajeCalyaan, porcetajeProfesional } = req.body;

    // Crea una nueva instancia de Producto con los datos proporcionados
    const producto = new Producto({
      nombre,
      idWP,
      img,
      descripcion,
      precio,
      precio_regular,
      link,
      porcetajeCalyaan, 
      porcetajeProfesional,
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

const editarProducto = async (req, res) => {
  try {
    // Extrae el ID del producto a editar desde los parámetros de la URL
    const { _id } = req.body;

    // Busca el producto en la base de datos por su ID
    const producto = await Producto.findById(_id);

    // Si el producto no existe, devuelve un error 404
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Extrae los datos actualizados del cuerpo de la solicitud
    const { porcetajeCalyaan, porcetajeProfesional, nombre, idWP, img, descripcion, precio, precio_regular, link } = req.body;

    // Actualiza los campos del producto con los nuevos datos
    producto.porcetajeCalyaan = porcetajeCalyaan || producto.porcetajeCalyaan;
    producto.porcetajeProfesional= porcetajeProfesional || producto.porcetajeProfesional;
    producto.nombre = nombre || producto.nombre;
    producto.idWP = idWP || producto.idWP;
    producto.img = img || producto.img;
    producto.descripcion = descripcion || producto.descripcion;
    producto.precio = precio || producto.precio;
    producto.precio_regular = precio_regular || producto.precio_regular;
    producto.link = link || producto.link;
    


    // Guarda los cambios en la base de datos
    await producto.save();

    // Envía una respuesta con el producto actualizado
    return res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al editar el producto" });
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

/* funcion para llenar una db de productos directo en la api 

const cargarProductosWP = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://calyaanback-production.up.railway.app/api/products"
    );

    for (const productoState of data) {
      const {
        nombre,
        idWP,
        images,
        short_description,
        price,
        regular_price,
        permalink
      } = productoState;

      const img = images?.[0]?.src ?? "";
      const descripcion = short_description ?? "";
      const precio = price ? price : 0; // Reemplaza 0 con el valor predeterminado que desees en caso de que 'price' esté vacío
      const precio_regular = regular_price ?? "";
      const link = permalink ?? "";

      if (precio === '') {
        console.error('El precio del producto no puede estar vacío');
        continue; // Salta este producto y pasa al siguiente
      }

      let productoExistente = await Producto.findOne({ idWP });

      if (productoExistente) {
        Object.assign(productoExistente, {
          nombre,
          img,
          descripcion,
          precio,
          precio_regular,
          link
        });

        await productoExistente.save();
      } else {
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
    console.error(error);
    res.status(500).json({ error: "Error al actualizar los productos" });
  }
};

*/
export { cargarProductosWP, crearNuevoProducto, crearNuevoProductoID, editarProducto };

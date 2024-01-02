import fs from "fs";
import Usuario from "../models/UserModel.js";

import {
  subirCloudinary,
  limpiarCloudinary,
} from "../helpers/cloudinaryActions.js";

//setea la imagen del profesional en el perfil
const cargarImagen = async (req, res) => {

  try {

    const { _id } = req.usuario;
    const { file } = req;
  
    console.log(file)

    const usuario = await Usuario.findById(_id);

    if (!usuario) {
      const error = new Error("Usuario no esta registrado");
      return res.status(400).json({ msg: error.message });
    }

    const imageURL = await subirCloudinary(file.path, "assets");

    await limpiarCloudinary(usuario.img, "assets");

    usuario.img = imageURL;
    await usuario.save();

    res.json({
      msg: "imagen cargada correctamente",
      imageURL,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const cargarImagenFirmas = async (req, res) => {

  try {

    const { _id } = req.usuario;
    const { file } = req;
  
    //console.log(file)

    const usuario = await Usuario.findById(_id);

    if (!usuario) {
      const error = new Error("Usuario no esta registrado");
      return res.status(400).json({ msg: error.message });
    }

    const imageURL = await subirCloudinary(file.path, "assets");

    await limpiarCloudinary(usuario.img, "assets");
    
    await usuario.save();

    res.json({
      msg: "imagen cargada correctamente",
      imageURL,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { cargarImagen, cargarImagenFirmas };

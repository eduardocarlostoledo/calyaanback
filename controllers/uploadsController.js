import fs from "fs";
import Usuario from "../models/UserModel.js";

import {
  subirCloudinary,
  limpiarCloudinary,
} from "../helpers/cloudinaryActions.js";

const cargarImagen = async (req, res) => {
  const { _id } = req.usuario;
  const { file } = req;

  //console.log(file)

  const size = file.size / 1024 / 1024; // MB

  if (size > 2) {
    fs.unlinkSync(file.path);
    return res.status(400).json({
      message: "La imagen debe pesar menos de 2MB",
    });
  }
  try {
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

export { cargarImagen };

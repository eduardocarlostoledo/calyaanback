import fs from "fs";
import cloudinary from "../config/cloudinary.js";


const subirCloudinary = async (filePath, folder) => {
  try {   
    //console.log("SUBIR CLOUDINARY")
    const { secure_url } = await cloudinary.uploader.upload(filePath, {
      folder: `calyaan/${folder}`,
      overwrite: true,
      format: "jpg",
      quality: "auto:low",
    });
    //console.log("SUBIR CLOUDINARY OK")
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
    //console.log("SUBIR CLOUDINARY EXITO")
    return secure_url;

  } catch (error) {
    throw new Error(`Error al subir la imagen a Cloudinary: ${error.message}`);
  }
};



const limpiarCloudinary = (pathFile, folder) => {
  if (pathFile && pathFile !== "") {
    const clodinaryArray = pathFile.split("/");
    const ultimaImagen = clodinaryArray[clodinaryArray.length - 1];
    const cloudinaryId = ultimaImagen.split(".")[0];
    cloudinary.uploader.destroy(`calyaan/${folder}/${cloudinaryId}`);
  }
};

export { subirCloudinary, limpiarCloudinary };

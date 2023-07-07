import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const subirCloudinary = async (filePath, folder) => {
  const { secure_url } = await cloudinary.uploader.upload(filePath, {
    folder: `calyaan/${folder}`,
  });

  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });

  return secure_url;
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

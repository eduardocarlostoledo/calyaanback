import multer from "multer";
import * as path from "path";
import url from "url";

//dirname no estan dentro del scope de module ES6
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../temp/"));
    },
  }),

  fileFilter: (req, file, cb) => {
    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
    ];
    if (formatosPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error("Formatos permitidos: JPEG, PNG, JPG, GIF"));
    }
  },
});

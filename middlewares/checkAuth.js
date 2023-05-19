import Usuario from "../models/UserModel.js";
import jwt from "jsonwebtoken";
const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  let token;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1]; //seleccionar el token
      const decoded = jwt.verify(token, process.env.JWT_KEY); // lo verificamos

      //buscar el usuario en base de datos
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -token -confirmado -createdAt -updatedAt -__v -google -ciudad"
      );

      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "Token no valido" });
    }
  }
  // verificamos que si exista el token(JWT)
  if (!token) {
    const error = new Error("Token requerido");
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;

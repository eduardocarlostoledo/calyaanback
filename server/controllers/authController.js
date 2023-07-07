import axios from "axios";
import Usuario from "../models/UserModel.js";
import generarJWT from "../helpers/generateJWT.js";

// AUTENTICAR A LOS USUARIOS
const login = async (req, res) => {
  // verificamos si el email ya existe en nuestra base de datos
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("Usuario no registrado");
    return res.status(404).json({ msg: error.message });
  }
  if (usuario.google === true) {
    const error = new Error("Debe iniciar sesion por medio de google");
    return res.status(404).json({ msg: error.message });
  }
  if (!usuario.confirmado) {
    // Comprobar si el usuario esta confirmado
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar el password del usuario
  if (await usuario.comprobarPassword(password)) {

    usuario.ultimaConexion = new Date();

    await usuario.save()

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      confirmado: usuario.confirmado,
      profesionalId: usuario.profesional,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("Credenciales Incorrectas");
    return res.status(403).json({ msg: error.message });
  }
};
const googleSignIn = async (req, res) => {
  try {
    // Recibimos el token de acceso
    const { token } = req.body;

    // Hacemos la petición a la API de Google
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const nombre = response.data.given_name;
    const apellido = response.data.family_name;
    const email = response.data.email;
    const img = response.data.picture;

    let usuario = await Usuario.findOne({ email });

    // Usuario no existe, lo creamos
    if (!usuario) {
      const data = {
        nombre,
        apellido,
        email,
        password: ":",
        img,
        confirmado: true,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.confirmado) {
      throw new Error("Tu cuenta no ha sido confirmada");
    }
    if (usuario.rol === "PROFESIONAL") {
      throw new Error("No puedes iniciar sesión mediante Google");
    }

    const jwtToken = await generarJWT(usuario.id);
    usuario.token = jwtToken;

    res.json({
      _id: usuario._id,
      nombre,
      apellido,
      email,
      rol: usuario.rol,
      token: jwtToken,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


// const googleSignIn = async (req, res) => {
//   //recibimos el token de acceso
//   const { token } = req.body;

//   //hacemos la peticion a la api de google
//   axios
//     .get("https://www.googleapis.com/oauth2/v3/userinfo", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(async (response) => {
//       const nombre = response.data.given_name;
//       const apellido = response.data.family_name;
//       const email = response.data.email;
//       const img = response.data.picture;

//       let usuario = await Usuario.findOne({ email });

//       //usuario no existe, lo creamos

//       if (!usuario) {
//         const data = {
//           nombre,
//           apellido,
//           email,
//           password: ":",
//           img,
//           confirmado: true,
//           google: true,
//         };

//         usuario = new Usuario(data);
//         await usuario.save();
//       }

//       if (!usuario.confirmado) {
//         const error = new Error("Tu cuenta no ha sido confirmada");
//         return res.status(403).json({ msg: error.message });
//       }
//       if (usuario.rol === "PROFESIONAL") {
//         const error = new Error("No puedes iniciar sesion mediante google");
//         return res.status(403).json({ msg: error.message });
//       }

//       const token = await generarJWT(usuario.id);
//       usuario.token = token;

//       res.json({
//         nombre,
//         apellido,
//         email,
//         rol: usuario.rol,
//         token,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({ msg: "Token de acceso inválido" });
//     });
// };

export { login, googleSignIn };

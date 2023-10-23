import axios from 'axios';
import Usuario from '../models/UserModel.js';
import Log from '../models/LogModel.js';
import generarJWT from '../helpers/generateJWT.js';


const getLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener los logs', error);
    res.status(500).json({ error: 'Error al obtener los logs' });
  }
}


// Función para almacenar logs de inicio de sesión
const almacenarLog = async (nombre, email, rol, tipo) => {
  try {
    // Código para almacenar logs en la base de datos o en un archivo de registro
    const currentDateTime = new Date();
    // Aquí, podrías usar la lógica de almacenamiento que se proporcionó anteriormente
    const logEntry = new Log({
      nombre: nombre,
      email: email,
      rol: rol,
      tipo: tipo,
      fecha: currentDateTime
    });

    // Inserción del registro
    const result = await logEntry.save();
    console.log(`Registro de inicio de sesión - Nombre: ${nombre}, Email: ${email}, Rol: ${rol}, Tipo: ${tipo}`);
  } catch (error) {
    console.error('Error al almacenar el registro de inicio de sesión', error);
  }
};

// // AUTENTICAR A LOS USUARIOS (le agregamos validaciones y una respuesta de error mas amigable)

const login = async (req, res) => {
  try {
    const { email, password, rol } = req.body;
//console.log("login", req.body, email, password, rol)
    // Buscando al usuario en la base de datos
    const usuario = await Usuario.findOne({ email, rol });

    // Si no se encuentra ningún usuario con el email y rol proporcionados
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Si el usuario ha iniciado sesión a través de Google
    if (usuario.google === true) {
      return res.status(404).json({ msg: 'Debe iniciar sesión por medio de Google' });
    }

    // Si la cuenta del usuario no está confirmada
    if (!usuario.confirmado) {
      return res.status(403).json({ msg: 'Tu cuenta no ha sido confirmada' });
    }

    // Verificando la contraseña del usuario
    const isPasswordValid = await usuario.comprobarPassword(password);

    if (isPasswordValid) {
      // Actualizando la última conexión del usuario y guardando
      usuario.ultimaConexion = new Date();
      await usuario.save();

      // Generando un token JWT
      const token = generarJWT(usuario._id);

      // Almacenando un registro de inicio de sesión
      await almacenarLog(usuario.nombre, usuario.email, usuario.rol, 'login');

      // Respondiendo con los datos del usuario y el token
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        confirmado: usuario.confirmado,
        profesionalId: usuario.profesional,
        token: token,
      });
    } else {
      // Si las credenciales son incorrectas
      return res.status(403).json({ msg: 'Credenciales incorrectas' });
    }
  } catch (error) {
    // Si ocurre algún error durante el proceso
    console.error('Error durante el proceso de inicio de sesión:', error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};


// const login = async (req, res) => {
//   // verificamos si el email ya existe en nuestra base de datos
//   const { email, password, rol } = req.body;
// //console.log("LOGIN", email, password, rol)

//   const usuario = await Usuario.findOne({ email, rol });
//   console.log("USUARIO", usuario)
//   if (usuario===null) {
//     const error = new Error('No se han encontrado coincidencias o los datos son Incorrectos');
//     return res.status(404).json({ msg: error.message });
//   }

//   if (!usuario) {
//     const error = new Error('Usuario no registrado');
//     return res.status(404).json({ msg: error.message });
//   }
//   if (usuario.google === true) {
//     const error = new Error('Debe iniciar sesión por medio de google');
//     return res.status(404).json({ msg: error.message });
//   }
//   if (!usuario.confirmado) {
//     // Comprobar si el usuario está confirmado
//     const error = new Error('Tu cuenta no ha sido confirmada');
//     return res.status(403).json({ msg: error.message });
//   }

//   // Comprobar el password del usuario
//   if (await usuario.comprobarPassword(password)) {
//     usuario.ultimaConexion = new Date();
//     await usuario.save();

//     const token = generarJWT(usuario._id);
//     await almacenarLog(usuario.nombre, usuario.email, usuario.rol, 'login');

//     res.json({
//       _id: usuario._id,
//       nombre: usuario.nombre,
//       email: usuario.email,
//       rol: usuario.rol,
//       confirmado: usuario.confirmado,
//       profesionalId: usuario.profesional,
//       token: token,
//     });
//   } else {
//     const error = new Error('Credenciales Incorrectas');
//     return res.status(403).json({ msg: error.message });
//   }
// };

const googleSignIn = async (req, res) => {
  try {
    // Recibimos el token de acceso
    const { token } = req.body;

    // Hacemos la petición a la API de Google
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
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
        password: ':',
        img,
        confirmado: true,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.confirmado) {
      throw new Error('Tu cuenta no ha sido confirmada');
    }
    if (usuario.rol === 'PROFESIONAL') {
      throw new Error('No puedes iniciar sesión mediante Google');
    }

    const jwtToken = await generarJWT(usuario.id);
    usuario.token = jwtToken;

    await almacenarLog(usuario.nombre, usuario.email, usuario.rol, 'googleSignIn');

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

export { login, googleSignIn, getLogs };


//controlador sin almacen de logs, funciona bien.
// import axios from "axios";
// import Usuario from "../models/UserModel.js";
// import generarJWT from "../helpers/generateJWT.js";

// // AUTENTICAR A LOS USUARIOS
// const login = async (req, res) => {
//   // verificamos si el email ya existe en nuestra base de datos
//   const { email, password } = req.body;

//   const usuario = await Usuario.findOne({ email });

//   if (!usuario) {
//     const error = new Error("Usuario no registrado");
//     return res.status(404).json({ msg: error.message });
//   }
//   if (usuario.google === true) {
//     const error = new Error("Debe iniciar sesion por medio de google");
//     return res.status(404).json({ msg: error.message });
//   }
//   if (!usuario.confirmado) {
//     // Comprobar si el usuario esta confirmado
//     const error = new Error("Tu cuenta no ha sido confirmada");
//     return res.status(403).json({ msg: error.message });
//   }

//   // Comprobar el password del usuario
//   if (await usuario.comprobarPassword(password)) {

//     usuario.ultimaConexion = new Date();

//     await usuario.save()

//     res.json({
//       _id: usuario._id,
//       nombre: usuario.nombre,
//       email: usuario.email,
//       rol: usuario.rol,
//       confirmado: usuario.confirmado,
//       profesionalId: usuario.profesional,
//       token: generarJWT(usuario._id),
//     });
//   } else {
//     const error = new Error("Credenciales Incorrectas");
//     return res.status(403).json({ msg: error.message });
//   }
// };
// const googleSignIn = async (req, res) => {
//   try {
//     // Recibimos el token de acceso
//     const { token } = req.body;

//     // Hacemos la petición a la API de Google
//     const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const nombre = response.data.given_name;
//     const apellido = response.data.family_name;
//     const email = response.data.email;
//     const img = response.data.picture;

//     let usuario = await Usuario.findOne({ email });

//     // Usuario no existe, lo creamos
//     if (!usuario) {
//       const data = {
//         nombre,
//         apellido,
//         email,
//         password: ":",
//         img,
//         confirmado: true,
//         google: true,
//       };

//       usuario = new Usuario(data);
//       await usuario.save();
//     }

//     if (!usuario.confirmado) {
//       throw new Error("Tu cuenta no ha sido confirmada");
//     }
//     if (usuario.rol === "PROFESIONAL") {
//       throw new Error("No puedes iniciar sesión mediante Google");
//     }

//     const jwtToken = await generarJWT(usuario.id);
//     usuario.token = jwtToken;

//     res.json({
//       _id: usuario._id,
//       nombre,
//       apellido,
//       email,
//       rol: usuario.rol,
//       token: jwtToken,
//     });
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };


// // const googleSignIn = async (req, res) => {
// //   //recibimos el token de acceso
// //   const { token } = req.body;

// //   //hacemos la peticion a la api de google
// //   axios
// //     .get("https://www.googleapis.com/oauth2/v3/userinfo", {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     })
// //     .then(async (response) => {
// //       const nombre = response.data.given_name;
// //       const apellido = response.data.family_name;
// //       const email = response.data.email;
// //       const img = response.data.picture;

// //       let usuario = await Usuario.findOne({ email });

// //       //usuario no existe, lo creamos

// //       if (!usuario) {
// //         const data = {
// //           nombre,
// //           apellido,
// //           email,
// //           password: ":",
// //           img,
// //           confirmado: true,
// //           google: true,
// //         };

// //         usuario = new Usuario(data);
// //         await usuario.save();
// //       }

// //       if (!usuario.confirmado) {
// //         const error = new Error("Tu cuenta no ha sido confirmada");
// //         return res.status(403).json({ msg: error.message });
// //       }
// //       if (usuario.rol === "PROFESIONAL") {
// //         const error = new Error("No puedes iniciar sesion mediante google");
// //         return res.status(403).json({ msg: error.message });
// //       }

// //       const token = await generarJWT(usuario.id);
// //       usuario.token = token;

// //       res.json({
// //         nombre,
// //         apellido,
// //         email,
// //         rol: usuario.rol,
// //         token,
// //       });
// //     })
// //     .catch((err) => {
// //       res.status(400).json({ msg: "Token de acceso inválido" });
// //     });
// // };


// export { login, googleSignIn };

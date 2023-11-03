import express from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/fieldsValidation.js";
import checkAuth from "../middlewares/checkAuth.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import isSuperAdminRole from "../middlewares/isSuperAdminRole.js";

import {
  registrar,
  confirmar,
  olvidePassword,
  comprobarIdToken,
  actualizarPassword,
  perfil,
  actualizarPerfil,
  cambiarPassword,
  obtenerUsuario,
  desactivarUsuario,
  usuariosExcel,
  registrarProfesional,
  obtenerDirecciones,
  crearDireccion,
  clientesExcel,
  profesionalesExcel,
  administradoresExcel,
  horariosExcel,
  obtenerHistorial,
  eliminarDireccion,
  editarDireccion,
  GetPerfil,
  obtenerUsuarioEmail,
  registrarUsuarioReserva,
  getUser,
  confirmarEmail,
  actualizarUsuarioAdmin
} from "../controllers/userController.js";

// Instanciando el router de express
const usuarioRoutes = express.Router();

//Registro y confirmacion de usuarios

// crea un nuevo usuario
usuarioRoutes.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe ser de minimo 6 caracteres"
    ).isLength({ min: 6 }),
    check("email", "El email no es valido").isEmail(),
    validarCampos,
  ],
  registrar
);

// confirmar cuenta
usuarioRoutes.get("/confirmar/:token", confirmar);
usuarioRoutes.post("/confirmar/", confirmarEmail);

//validar token y definir nuevo password
usuarioRoutes.post(
  "/olvide-password",
  [check("email", "Debes suministar un email válido").isEmail(), validarCampos],
  olvidePassword
);

usuarioRoutes
  .route("/olvide-password/:token")
  .get(comprobarIdToken)
  .post(
    [
      check(
        "password",
        "El nuevo password es obligatorio y debe ser de mínimo 6 caracteres"
      ).isLength({ min: 6 }),
      validarCampos,
    ],
    actualizarPassword
  );

usuarioRoutes.get("/direcciones", checkAuth, obtenerDirecciones);

usuarioRoutes.post("/direcciones", checkAuth, crearDireccion);

usuarioRoutes.put("/direcciones/:id", checkAuth, editarDireccion);

usuarioRoutes.delete("/direccion/:id", checkAuth, eliminarDireccion);

//acceder al perfil
usuarioRoutes.get("/perfil", checkAuth, perfil);

// Obtener Usuario
usuarioRoutes.get("/obtener-usuario", checkAuth, getUser);

//acceder al perfil
usuarioRoutes.get("/perfil/:id", checkAuth, GetPerfil);

// actualizar el perfil de un usuario
usuarioRoutes.put("/actualizar-perfil", checkAuth, actualizarPerfil);

//definir un nuevo administrador
usuarioRoutes.put("/actualizar-usuario-admin", [checkAuth, isAdminRole], actualizarUsuarioAdmin);

//cambiar el password
usuarioRoutes.put("/cambiar-password", checkAuth, cambiarPassword);

//generar excel de usuarios
usuarioRoutes.get("/excel-usuarios", [checkAuth, isAdminRole], usuariosExcel);

//generar excel de clientes
usuarioRoutes.get("/excel-cliente", [checkAuth, isAdminRole], clientesExcel);

//generar excel de profesionales
usuarioRoutes.get("/excel-profesional", [checkAuth, isAdminRole], profesionalesExcel
);

//generar excel de administradores
usuarioRoutes.get("/excel-admin", [checkAuth, isAdminRole], administradoresExcel
);

//generar excel de horarios
usuarioRoutes.get("/excel-horarios", [checkAuth, isAdminRole], horariosExcel);

//obtener un usario
usuarioRoutes.get("/:id", [checkAuth, check("id", "no es un id válido").isMongoId(), validarCampos], obtenerUsuario);

//desactivar un usuario
usuarioRoutes.delete("/:id", [checkAuth, isAdminRole, check("id", "no es un id válido").isMongoId(), validarCampos, ], desactivarUsuario);

//PROFESIONAL
usuarioRoutes.post("/registro-profesional",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe ser de minimo 6 caracteres"
    ).isLength({ min: 6 }),
    check("email", "El email no es valido").isEmail(),
    validarCampos,
  ],
  registrarProfesional
);

// Obtener historial de reservas
usuarioRoutes.get("/historial/:id", checkAuth, obtenerHistorial);

// Obtener usuario por email
usuarioRoutes.post("/email",   checkAuth, isAdminRole, obtenerUsuarioEmail);

// Crear usuario en reserva 
usuarioRoutes.post("/reserva-usuario",   checkAuth, isAdminRole, registrarUsuarioReserva);


export default usuarioRoutes;

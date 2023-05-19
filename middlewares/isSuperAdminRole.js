const isSuperAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere validar el rol sin validar el token primero",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "SUPERADMIN") {
    return res.status(401).json({
      msg: `${nombre} no es un super administrador - No puedes realizar esta accion`,
    });
  }

  return next();
};
export default isSuperAdminRole;

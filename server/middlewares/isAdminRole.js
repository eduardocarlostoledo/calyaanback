const isAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere validar el rol sin validar el token primero",
    });
  }

  const { rol, nombre } = req.usuario;
  console.log(rol);

  if (!(rol === "ADMIN" || rol === "SUPERADMIN")) {
    return res.status(401).json({
      msg: `${nombre} no es un administrador - No puedes realizar esta accion`,
    });
  }

  return next();
};
export default isAdminRole;

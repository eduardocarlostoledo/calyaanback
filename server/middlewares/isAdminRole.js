const isAdminRole = (req, res, next) => {
  //console.log("VERIFICANDO ROL")
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere validar el rol sin validar el token primero",
    });
  }
//console.log("req.usuario ISADMINROLE",req.usuario);
  const { rol, nombre } = req.usuario;


  if (!(rol === "ADMIN" || rol === "SUPERADMIN")) {
    return res.status(401).json({
      msg: `${nombre} no es un administrador - No puedes realizar esta accion`,
    });
  }
console.log("ROL OK")
  return next();
};
export default isAdminRole;

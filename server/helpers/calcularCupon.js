const calcularCupon = (precio, descuento, esPorcentaje) => {
    if (esPorcentaje) {

      const porcentajeDescuento = descuento / 100;
      const montoDescuento = precio * porcentajeDescuento;
      const precioConDescuento = precio - montoDescuento;
      return precioConDescuento;
    } else {

      const precioConDescuento = precio - descuento;
      return precioConDescuento;
    }
};

export default calcularCupon;
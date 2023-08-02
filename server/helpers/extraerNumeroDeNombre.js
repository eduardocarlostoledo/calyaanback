// Función para extraer el número de la cadena "nombre" utilizando expresiones regulares
export function extraerNumeroDeNombre(productos) {
    if (!productos || productos.length === 0) {
      return 1; // Retorna 1 si productos es null o está vacío
    }
  
    const nombre = productos[0].nombre;
    const numeroEnNombre = nombre.match(/\d+/);
  
    if (numeroEnNombre && numeroEnNombre.length > 0) {
      return parseInt(numeroEnNombre[0], 10);
    } else {
      return 1; // Retorna 1 si no se puede extraer un número del nombre
    }
  }
  
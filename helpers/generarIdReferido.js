const generarIdReferido = (id) => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha + id;
  };

  export default generarIdReferido;
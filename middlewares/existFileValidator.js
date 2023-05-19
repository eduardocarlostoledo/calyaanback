import express from "express";

const existeArchivo = (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ msg: "Debes elegir una imagen para subir" });
    return;
  }

  next();
};

export default existeArchivo;

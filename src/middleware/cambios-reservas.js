function validarReemplazoReserva(req, res, next) {
  // PUT reemplaza todos los campos admitidos por el modelo Reserva.
  // La validación completa ya fue realizada por validarReserva.
  req.cambiosValidos = { ...req.reservaValidada };
  next();
}

function validarActualizacionReserva(req, res, next) {
  const datos = req.body;

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Enviá un objeto JSON." });
  }

  const campos = Object.keys(datos);
  if (campos.length === 0 || campos.some((campo) => campo !== "personas")) {
    return res.status(400).json({
      error: "Solo se puede actualizar el campo personas.",
    });
  }

  if (
    typeof datos.personas !== "number" ||
    !Number.isInteger(datos.personas) ||
    datos.personas < 1 ||
    datos.personas > 6
  ) {
    return res.status(400).json({
      error: "Personas debe ser un número entero entre 1 y 6.",
    });
  }

  req.cambiosValidos = { personas: datos.personas };
  next();
}

module.exports = { validarReemplazoReserva, validarActualizacionReserva };

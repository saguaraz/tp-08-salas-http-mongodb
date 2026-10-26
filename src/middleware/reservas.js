const { SALAS_PERMITIDAS, TURNOS_PERMITIDOS } = require("../modelos/reserva");

function validarReserva(req, res, next) {
  const valores = req.body ?? {};
  const estudiante = typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
  const email = typeof valores.email === "string" ? valores.email.trim() : "";
  const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
  const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";
  const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";
  
  const personasRecibidas = valores.personas;
  const esNumeroValido = typeof personasRecibidas === "number" || 
    (typeof personasRecibidas === "string" && personasRecibidas.trim() !== "");
  const personas = esNumeroValido ? Number(personasRecibidas) : NaN;

  const esValido = estudiante !== "" &&
    email !== "" &&
    email.includes("@") &&
    SALAS_PERMITIDAS.includes(sala) &&
    fecha !== "" &&
    TURNOS_PERMITIDOS.includes(turno) &&
    Number.isInteger(personas) &&
    personas >= 1 &&
    personas <= 6;

  if (!esValido) {
    const mensajeError = "Datos de reserva inválidos. Verificá todos los campos.";
    if (req.baseUrl.startsWith("/api/")) {
      return res.status(400).json({ error: mensajeError });
    }
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: mensajeError,
      valores
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}

module.exports = { validarReserva };

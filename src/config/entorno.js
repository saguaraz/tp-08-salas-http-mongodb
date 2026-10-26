function leerConfiguracion() {
  const puerto = Number(process.env.PORT) || 3000;
  const formatoRegistro = process.env.NODE_ENV === "production" ? "combined" : "dev";
  return { puerto, formatoRegistro };
}
module.exports = { leerConfiguracion };

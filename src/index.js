const { leerConfiguracion } = require("./config/entorno");
const { conectarBaseDatos, desconectarBaseDatos } = require("./config/base-datos");
const { crearServicioReservasMongo } = require("./servicios/reservas-mongo");
const { crearApp } = require("./app");

async function main() {
  const { puerto, formatoRegistro } = leerConfiguracion();
  
  await conectarBaseDatos();
  
  const servicioReservas = crearServicioReservasMongo();
  const app = crearApp({ servicioReservas, formatoRegistro });

  const servidor = app.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });

  let cerrando = false;
  function cerrar() {
    if (cerrando) return;
    cerrando = true;
    servidor.close(async () => {
      try {
        await desconectarBaseDatos();
      } catch (error) {
        console.error("Error al desconectar:", error.name);
        process.exitCode = 1;
      }
    });
  }

  process.once("SIGINT", cerrar);
  process.once("SIGTERM", cerrar);
}

main().catch(async (error) => {
  console.error("No se pudo iniciar la aplicación:", error.name);
  process.exitCode = 1;
  try {
    await desconectarBaseDatos();
  } catch (fallo) {
    console.error("Error al cerrar:", fallo.name);
  }
});

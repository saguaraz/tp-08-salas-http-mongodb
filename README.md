# tp-08-salas-http-mongodb
TP 08: Endpoints Persistentes de Reservas de Salas

Este proyecto implementa la migración de un sistema de reservas de salas hacia una capa de persistencia en MongoDB Atlas Free (M0) mediante la biblioteca Mongoose, exponiendo tanto una interfaz web (rutas HTML) como un contrato API JSON asíncrono.

1. Origen del Proyecto y Versiones
  Repositorio de origen: Copia individual del TP 07 (tp-07-salas-mongodb).
  Nombre sugerido: tp-08-salas-http-mongodb.
  Node.js: v20+ / v22+ (ejecución nativa con flag --env-file).
  Framework Web: Express v5 (express).
  ORM / ODM: Mongoose (mongoose).
  Motor de Plantillas: EJS (ejs, express-ejs-layouts).

2. Preparación de MongoDB Atlas, Entorno y DNS

  Base de Datos y Colección
  Base de Datos: reservas_salas_u8
  Colección: reservas
  Variables de Entorno (.env.example)
  Crear un archivo .env en la raíz del proyecto basándose en la siguiente plantilla:

    PORT=3000
    NODE_ENV=development
    MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority   
 
Nota de Seguridad: El archivo .env está excluido del control de versiones (.gitignore). No subir credenciales reales a GitHub.

Ajuste de DNS
En src/config/base-datos.js, se mantiene la configuración de resolución de nombres autorizada previa a la conexión:

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

3. Comando de Inicio y Ejecución

Para iniciar la aplicación cargando las variables de entorno de forma nativa:

node --env-file=.env src/index.js
O mediante el script configurado en package.json:

npm start

4. Estructura del Proyecto por Capas

  tp-08-salas-http-mongodb/
    src/
      index.js               # Punto de entrada (espera conexión MongoDB antes de listen)
      app.js                 # Configuración de Express, middlewares, rutas y 404
    config/
      entorno.js         # Lectura de variables de entorno
      base-datos.js      # Conexión y desconexión Mongoose con ajuste DNS
    modelos/
      reserva.js         # Esquema Mongoose con validaciones y default 'pendiente'
      servicios/
      reservas.js        # Servicio en memoria (referencia TP 07, no se importa)
      reservas-mongo.js  # Servicio asíncrono MongoDB (find, findById, create, lean)
    controladores/
      reservas.js        # Lógica de negocio (soporta HTML y API JSON)
    rutas/
      reservas.js        # Router para vistas HTML
      reservas-api.js    # Router para endpoints API JSON
    middleware/
      reservas.js        # Validación estricta de entrada (HTML / API)
      errores.js         # Manejador centralizado de errores (Express 5)
    views/                     # Vistas EJS (inicio, lista, nueva, detalle, estado, 404)
    public/                    # Archivos estáticos (CSS)
    .env.example               # Plantilla pública de entorno
    .gitignore                 # Exclusión de .env y node_modules
    package.json               # Dependencias y scripts
    README.md                  # Documentación del proyecto


5. Tabla de Endpoints
Método	Ruta	Descripción	Respuesta Exitosa

GET	/	                                Página de inicio HTML	                  200 OK (HTML)
GET	/reservas	                        Listado de reservas HTML	              200 OK (HTML)
GET	/reservas/nueva	                  Formulario de creación HTML	            200 OK (HTML)
GET	/reservas/:id	                    Detalle de reserva HTML	                200 OK (HTML)
POST	/reservas	                      Creación de reserva desde formulario	  302 Found (Redirección)
GET	/estado	                          Estado del sistema y total persistido	  200 OK (HTML)
GET	/api/reservas	                    Listar todas las reservas	              200 OK (Array JSON)
GET	/api/reservas?sala=Sala%20Norte	  Filtrar reservas por sala exacta	      200 OK (Array JSON)
GET	/api/reservas/:id	                Consulta de reserva por ID (24 hex)	    200 OK (Objeto JSON)
POST	/api/reservas	                  Crear nueva reserva JSON	              201 Created + Location

6. Ejemplos de Solicitud y Respuesta JSON

Solicitud de Creación (POST /api/reservas)

{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}

Respuesta de Creación (201 Created)
Headers de Respuesta: Location: /api/reservas/653d...
Body:

{
  "id": "653d8a1f2b4c5e6f7a8b9c0d",
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2,
  "estado": "pendiente"
}


7. Guía de Ejecución de Pruebas en Postman

Listar Colección Inicial (GET /api/reservas):
    Método: GET | URL: http://localhost:3000/api/reservas | Body: none
    Estado esperado: 200 OK | Resultado: [] (si la base está vacía).
Crear Reserva (POST /api/reservas):
    Método: POST | URL: http://localhost:3000/api/reservas
    Headers: Content-Type: application/json
    Body (raw -> JSON): Enviar el JSON de ejemplo.
    Estado esperado: 201 Created | Verificar cabecera Location y campo "estado": "pendiente".
Consultar por Location (GET /api/reservas/:id):
    Método: GET | URL: http://localhost:3000/api/reservas/ID_RECIBIDO
    Estado esperado: 200 OK | Verificar que devuelve el objeto idéntico.
Validación de Filtro (GET /api/reservas?sala=Sala%20Norte):
    Método: GET | Params: sala = Sala Norte
    Estado esperado: 200 OK | Array con las coincidencias exactas.

8. Matriz de Resultados

Caso de Prueba	    Entrada / Condición	                                    Estado Esperado	       Evidencia / Resultado Observado

Listado inicial	        Base nueva	                                         200 OK	                Arreglo vacío [] sin inserción automática
Creación válida	              POST con 6 campos válidos	                     201 Created	          Reserva guardada, Location devuelto, estado: "pendiente"
Consulta por ID	              ID recibido en Location	                       200 OK	                Mismo recurso recuperado de MongoDB
Reinicio de servidor	        GET al mismo ID tras restart	                 200 OK	                Recurso recuperado, persistencia comprobada
ID mal formado	              GET /api/reservas/1	                           400 Bad Request	      JSON con mensaje de ID hexadecimal inválido
ID válido inexistente	        GET /api/reservas/000000000000000000000000	   404 Not Found	        JSON con error "Reserva no encontrada"
Estudiante / Email inválido	  Texto vacío o sin @	                           400 Bad Request	      Sin incremento en total de documentos
Sala / Turno no permitido	    Sala o turno fuera del enum	                   400 Bad Request	      Rechazado antes de Mongoose
Personas fuera de rango	      0, 7, 2.5 o "abc"	                             400 Bad Request	                                                                                           Rechazado por validación de entero [1, 6]
Tipo de dato inválido	personas: true, [] u {}	                               400 Bad Request	      Rechazado sin escritura
Inyección de campos extra	  Envío de estado: "confirmada" o _id	             201 Created	          Se ignoran campos extra, asigna default pendiente
Filtro exacto por sala	?   sala=Sala%20Norte                               200 OK	                Devuelve solo coincidencias exactas
Parametro repetido	?       sala=Sala%20Norte&sala=Sala%20Sur	              400 Bad Request	        Rechaza filtro en forma de array
Formulario HTML válido	    POST desde /reservas/nueva	                    302 Found	              Escritura await y redirección a /reservas
Formulario HTML inválido	  POST con datos incompletos	                    400 Bad Request	        Renderiza formulario conservando valores cargados
Conexión ausente al iniciar	URI inválida en .env	                          Sin escucha	            Cierra aplicación sin anunciar puerto disponible


9. Demostración de Persistencia
    Se ejecutó la solicitud POST /api/reservas obteniendo el ID 653d8a1f2b4c5e6f7a8b9c0d (Status 201).
    Se detuvo completamente el proceso Node.js (Ctrl + C).
    Se volvió a iniciar el servidor (node --env-file=.env src/index.js).
    Se ejecutó una consulta GET /api/reservas/653d8a1f2b4c5e6f7a8b9c0d sin reenviar el POST.
    Se obtuvo Status 200 OK con la reserva exactamente como fue guardada, confirmando la persistencia en MongoDB Atlas.

10. Comparación con TP 07 y Límites del Modelo
    Cambios respecto a TP 07
      Persistencia real: Se reemplazó el arreglo de memoria (src/servicios/reservas.js) por Mongoose en src/servicios/reservas-mongo.js. El archivo anterior se mantiene sin importar como referencia histórica.
      Identificador: Se pasa de IDs numéricos autoincrementales a ObjectId de 24 caracteres hexadecimales de MongoDB (mapeado como propiedad id de tipo string mediante lean()).
      Control de errores: Se centraliza el manejo de errores HTTP y de Mongoose mediante un middleware en src/middleware/errores.js.
    Alcance y Límites de Validación
      Campos adicionales: El esquema agrega el campo estado con default "pendiente". La API de esta unidad no expone endpoints para confirmar reservas (PUT/PATCH).
      Límites: El modelo valida la presencia de @ en el email y los formatos de fecha/turno/sala, pero no realiza verificación de disponibilidad de fechas en calendario, solapamiento de horarios ni límites de cupo por sala. Tampoco incluye autenticación ni autorización.

const fs = require('fs');
const path = require('path');

const views = {
  // Layout principal (views/layouts/main.ejs)
  'views/layouts/main.ejs': `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= titulo %></title>
  <link rel="stylesheet" href="/css/estilos.css">
</head>
<body>
  <header>
    <nav>
      <a href="/">Inicio</a> | 
      <a href="/reservas">Reservas</a> | 
      <a href="/reservas/nueva">Nueva Reserva</a> | 
      <a href="/estado">Estado</a>
    </nav>
  </header>
  <main>
    <%- body %>
  </main>
</body>
</html>`,

  // Vista Inicio (views/inicio.ejs)
  'views/inicio.ejs': `<h1>Gestión de Reservas de Salas</h1>
<p>Bienvenido al sistema de reservas persistente con MongoDB.</p>
<p><a href="/reservas">Ver listado de reservas</a></p>`,

  // Lista de Reservas (views/reservas/lista.ejs)
  'views/reservas/lista.ejs': `<h1>Listado de Reservas</h1>
<% if (reservas.length === 0) { %>
  <p>No hay reservas registradas en el sistema.</p>
<% } else { %>
  <ul>
    <% reservas.forEach(reserva => { %>
      <li>
        <strong><%= reserva.estudiante %></strong> - <%= reserva.sala %> (<%= reserva.fecha %>, <%= reserva.turno %>)
        <a href="/reservas/<%= reserva.id %>">Ver detalle</a>
      </li>
    <% }) %>
  </ul>
<% } %>
<p><a href="/reservas/nueva">Crear nueva reserva</a></p>`,

  // Formulario Nueva Reserva (views/reservas/nueva.ejs)
  'views/reservas/nueva.ejs': `<h1>Nueva Reserva</h1>

<% if (error) { %>
  <div style="color: red; margin-bottom: 1em;">
    <p><%= error %></p>
  </div>
<% } %>

<form action="/reservas" method="POST">
  <div>
    <label>Estudiante:</label><br>
    <input type="text" name="estudiante" value="<%= valores.estudiante || '' %>" required>
  </div>
  <div>
    <label>Email:</label><br>
    <input type="email" name="email" value="<%= valores.email || '' %>" required>
  </div>
  <div>
    <label>Sala:</label><br>
    <select name="sala" required>
      <option value="">Seleccione una sala</option>
      <option value="Sala Norte" <%= valores.sala === 'Sala Norte' ? 'selected' : '' %>>Sala Norte</option>
      <option value="Sala Sur" <%= valores.sala === 'Sala Sur' ? 'selected' : '' %>>Sala Sur</option>
      <option value="Sala Multimedia" <%= valores.sala === 'Sala Multimedia' ? 'selected' : '' %>>Sala Multimedia</option>
    </select>
  </div>
  <div>
    <label>Fecha:</label><br>
    <input type="text" name="fecha" placeholder="YYYY-MM-DD" value="<%= valores.fecha || '' %>" required>
  </div>
  <div>
    <label>Turno:</label><br>
    <select name="turno" required>
      <option value="">Seleccione un turno</option>
      <option value="Mañana" <%= valores.turno === 'Mañana' ? 'selected' : '' %>>Mañana</option>
      <option value="Tarde" <%= valores.turno === 'Tarde' ? 'selected' : '' %>>Tarde</option>
      <option value="Noche" <%= valores.turno === 'Noche' ? 'selected' : '' %>>Noche</option>
    </select>
  </div>
  <div>
    <label>Personas (1 a 6):</label><br>
    <input type="number" name="personas" min="1" max="6" value="<%= valores.personas || '' %>" required>
  </div>
  <br>
  <button type="submit">Guardar Reserva</button>
</form>`,

  // Detalle de Reserva (views/reservas/detalle.ejs)
  'views/reservas/detalle.ejs': `<h1>Detalle de Reserva</h1>
<p><strong>ID:</strong> <%= reserva.id %></p>
<p><strong>Estudiante:</strong> <%= reserva.estudiante %></p>
<p><strong>Email:</strong> <%= reserva.email %></p>
<p><strong>Sala:</strong> <%= reserva.sala %></p>
<p><strong>Fecha:</strong> <%= reserva.fecha %></p>
<p><strong>Turno:</strong> <%= reserva.turno %></p>
<p><strong>Personas:</strong> <%= reserva.personas %></p>
<p><strong>Estado:</strong> <%= reserva.estado %></p>
<p><a href="/reservas">Volver al listado</a></p>`,

  // Estado del Sistema (views/estado.ejs)
  'views/estado.ejs': `<h1>Estado del Sistema</h1>
<p><strong>Total de reservas persistidas en MongoDB:</strong> <%= total %></p>`,

  // Página 404 / Error (views/no-encontrado.ejs)
  'views/no-encontrado.ejs': `<h1><%= titulo %></h1>
<p><%= mensaje %></p>
<p><a href="/">Volver al inicio</a></p>`,

  // Estilos CSS básicos (public/css/estilos.css)
  'public/css/estilos.css': `body { font-family: sans-serif; margin: 20px; line-height: 1.6; }
header { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ccc; }
form div { margin-bottom: 10px; }
label { font-weight: bold; }`
};

Object.entries(views).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Vista creada: ${filePath}`);
});
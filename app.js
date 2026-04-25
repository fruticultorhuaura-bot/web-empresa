const express = require('express');
const fs = require('fs');
const axios = require('axios'); // Nueva librería para pedir datos externos
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync('visitas.txt')) { fs.writeFileSync('visitas.txt', ''); }

app.get('/', async (req, res) => {
  const nombres = fs.readFileSync('visitas.txt', 'utf8').split('\n').filter(n => n);
  
  // Pedimos el clima a una API gratuita (sin necesidad de llaves para este ejemplo rápido)
  let climaInfo = "Cargando clima...";
  try {
    const respuesta = await axios.get('https://wttr.in/Lima');
    climaInfo = respuesta.data;
  } catch (error) {
    climaInfo = "Clima no disponible";
  }

  res.send(`
    <link rel="stylesheet" href="/style.css">
    <div class="card">
      <div style="background: #fff3cd; padding: 10px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;">
        🌍 <b>Estado actual:</b> ${climaInfo}
      </div>
      <h1>⭐ Mi App Pro</h1>
      <form action="/guardar" method="POST">
        <input type="text" name="nombre" placeholder="Tu nombre..." required>
        <button type="submit">Guardar en Memoria</button>
      </form>
      <div class="list">
        <h3>Historial de visitas:</h3>
        <ul>${nombres.map(n => `<li>👤 ${n}</li>`).join('')}</ul>
      </div>
    </div>
  `);
});

app.post('/guardar', (req, res) => {
  fs.appendFileSync('visitas.txt', req.body.nombre + '\n');
  res.redirect('/');
});

app.listen(3000, () => console.log('App completa en http://localhost:3000'));



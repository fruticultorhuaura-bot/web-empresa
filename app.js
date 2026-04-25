const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Archivo para guardar los pedidos de insecticidas
if (!fs.existsSync('pedidos_agricolas.txt')) fs.writeFileSync('pedidos_agricolas.txt', '');

app.get('/', (req, res) => {
  const pedidos = fs.readFileSync('pedidos_agricolas.txt', 'utf8').split('\n').filter(p => p);
  
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <div class="card" style="width: 550px; border-top: 10px solid #2ecc71;">
      <h1>🚜 Agro-Insumos Huaura</h1>
      <p style="color: #666;">Venta de Insecticidas y Fertilizantes</p>
      
      <div style="background: #e8f5e9; padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 1px solid #c8e6c9;">
        <h3 style="color: #2e7d32;">📦 Registrar Pedido</h3>
        <form action="/pedido" method="POST">
          <input type="text" name="cliente" placeholder="Nombre del Agricultor / Empresa" required>
          
          <select name="producto" style="width: 90%; padding: 12px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc;">
            <option value="" disabled selected>Seleccione Insecticida</option>
            <option value="Abamectina">Abamectina (Control de ácaros)</option>
            <option value="Imidacloprid">Imidacloprid (Pulgones/Mosca blanca)</option>
            <option value="Cipermetrina">Cipermetrina (Masticadores)</option>
            <option value="Fertilizante Foliar">Fertilizante Foliar</option>
          </select>

          <input type="number" name="cantidad" placeholder="Cantidad (Litros/Kilos)" required style="width: 85%;">
          
          <button type="submit" style="background: #2e7d32; font-weight: bold; margin-top: 10px;">GENERAR ORDEN</button>
        </form>
      </div>

      <div class="list" style="max-height: 200px; overflow-y: auto;">
        <h3 style="border-bottom: 2px solid #eee;">📋 Pedidos por Despachar:</h3>
        <ul style="list-style: none; padding: 0;">
          ${pedidos.reverse().map(p => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">📍 ${p}</li>`).join('')}
        </ul>
      </div>
    </div>
  `);
});

app.post('/pedido', (req, res) => {
  const { cliente, producto, cantidad } = req.body;
  const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
  const registro = `${fecha} | ${cliente} solicitó ${cantidad} ud. de ${producto}`;
  
  fs.appendFileSync('pedidos_agricolas.txt', registro + '\n');
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Agro-Tienda lista'));



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controlador = require('./controladores/controlador')

const app = express();

// Permitir conexiones al servidor
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Rutas
app.get('/competencias', controlador.obtenerCompetencias);
app.get('/competencias/:id/peliculas', controlador.obtenerOpciones);
app.post('/competencias/:id/voto', controlador.sumarVoto);


// Puerto donde corre el servidor
const puerto = '3000';

app.listen(puerto, function () {
  console.log("Servidor corriendo en el puerto",puerto);
});
// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');
const { BDAnimes } = require('../models/consultas.js');

document.addEventListener('DOMContentLoaded', async function () {
    let consultas = new BDAnimes();
    let datos = await consultas.animesViendo();
    let historial = new Historial();
    if (datos.length > 0) {
        historial.capitulosVistos(datos);
    } else {
        historial.paginaBlancoConImagen();
    }
});

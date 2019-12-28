// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');

document.addEventListener('DOMContentLoaded', async function () {
    let historial = new Historial();
    historial.numCapRestantes();
});

// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');
const { BDAnimes } = require('../models/consultas.js');

document.addEventListener('DOMContentLoaded', async function () {
    let consultas = new BDAnimes();
    let { datos, salto, totalReg, pag } = await consultas.cargarHistorial(1, 1);
    let historial = new Historial();
    historial.imprimirHistorial(datos, salto);
    historial.imprimirPagination(totalReg, pag);
    historial.configurarBuscador();
    // Comprueba en que versión esta y migra si es necesario
    await historial.comprobarVersion(consultas);
});



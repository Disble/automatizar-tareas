// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Opciones } = require('../models/Opciones');

document.addEventListener('DOMContentLoaded', async function () {
    let opciones = new Opciones();
    opciones.initHTML();
});

// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderPendiente } = require('../models/RenderPendiente.js');

document.addEventListener('DOMContentLoaded', async function () {
    let render = new RenderPendiente();
    render.getAllData();
    render.setDragDrop();
});
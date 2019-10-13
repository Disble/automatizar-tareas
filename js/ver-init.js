// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderVerAnime } = require('../models/RenderVerAnime');
const { BDAnimes } = require('../models/consultas.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', async function () {
    let render = new RenderVerAnime();
    render.initVerAnime();
});
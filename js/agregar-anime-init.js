// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderNuevoAnime } = require('../models/RenderNuevoAnime');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', function () {
    let render = new RenderNuevoAnime();
    render.initAgregarAnime();
    M.FormSelect.init(document.querySelectorAll('select'));
});

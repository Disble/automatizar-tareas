// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderEditarAnime } = require('../models/RenderEditarAnime');

document.addEventListener('DOMContentLoaded', function () {
    let render = new RenderEditarAnime();
    render.initEditAnime();
});

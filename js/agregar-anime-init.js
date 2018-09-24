// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Render } = require('../models/render.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', function () {
    let render = new Render();
    render.initAgregarAnime();
    M.FormSelect.init(document.querySelectorAll('select'));
});

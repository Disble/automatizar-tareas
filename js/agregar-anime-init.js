// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Render } = require('./render.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', function () {
    let render = new Render();
    render.initAgregarAnime();
    // render.initEditAnime();
    M.FormSelect.init(document.querySelectorAll('select'));
});

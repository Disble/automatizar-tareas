// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Render } = require('../models/render.js');

document.addEventListener('DOMContentLoaded', function () {
	let render = new Render();
    render.initEditAnime();
});


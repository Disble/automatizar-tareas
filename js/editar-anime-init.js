// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderEditarAnime } = require('../models/RenderEditarAnime');
const { BDAnimes } = require('../models/consultas.js');

document.addEventListener('DOMContentLoaded', async function () {
    let render = new RenderEditarAnime();
    render.initEditAnime();
    let consultas = new BDAnimes();
    let listaCompleta = await consultas.buscarTodoActivos();
    let { lista, antiguo } = await render.reconocerAnimeAntiguo(listaCompleta);
    if (antiguo) {
        render.advertenciaVersion1();
    }
});

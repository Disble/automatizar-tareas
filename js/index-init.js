// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Render } = require('../models/render.js');
const { BDAnimes } = require('../models/consultas.js');
const { Menu } = require('../models/defaults-config.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', async function () {
	let menuRender = settings.get('menu', Menu);
	let render = new Render(menuRender);
	let consultas = new BDAnimes();
	render.initProgramDownloader();
	render.menuRender();
	let instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
	instances[0].open(0);
	let dia = render.diaSemana();
	let diaRender = render.buscarTituloDia(dia);
	let { datos } = await consultas.buscar(dia);
	render.actualizarLista(datos, diaRender);
	let listaCompleta = await consultas.buscarTodoActivos();
	let { lista, antiguo } = await render.reconocerAnimeAntiguo(listaCompleta);
	if (antiguo) {
		await render.advertenciaVersion1();
	}
});
// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Render } = require('./render.js');
const { BDAnimes } = require('./consultas.js');
const { Menu } = require('./defaults-config.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', async function () {
	let menuRender = settings.get('menu', Menu);
	let render = new Render(menuRender);
	let consultas = new BDAnimes();
	let dia = render.diaSemana();
	let { datos } = await consultas.buscar(dia);
	render.actualizarLista(datos, dia);
	render.menuRender();

	var instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
	instances[0].open(0);
});
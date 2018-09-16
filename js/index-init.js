// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');

//
const { Render } = require('./render.js');
const { BDAnimes } = require('./consultas.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', async function () {
	let menu = settings.get('menu', {
		'día': {
			'lunes': {
				'href': '#!',
				'id': "lunes",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'martes': {
				'href': '#!',
				'id': "martes",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'miércoles': {
				'href': '#!',
				'id': "miercoles",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'jueves': {
				'href': '#!',
				'id': "jueves",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'viernes': {
				'href': '#!',
				'id': "viernes",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'sábado': {
				'href': '#!',
				'id': "sabado",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'domingo': {
				'href': '#!',
				'id': "domingo",
				'class': 'collection-item no-link btn-buscar-animes'
			}
		},
		'estrenos': {
			'Sin ver': {
				'href': '#!',
				'id': "sin ver",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'Visto': {
				'href': '#!',
				'id': "visto",
				'class': 'collection-item no-link btn-buscar-animes'
			},
			'Ver hoy': {
				'href': '#!',
				'id': "ver hoy",
				'class': 'collection-item no-link btn-buscar-animes'
			}
		}
	});
	let render = new Render(menu);
	let consultas = new BDAnimes();
	let dia = render.diaSemana();
	let { datos } = await consultas.buscar(dia);
	render.actualizarLista(datos, dia);
	render.menuRender();

	var instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
	instances[0].open(0);
});
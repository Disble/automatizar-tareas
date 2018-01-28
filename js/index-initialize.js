$(document).ready(() => {
	render = new Render();
	buscar(render.diaSemana());
	render.menuRender({
		'día': {
			'lunes': {
				'href': '#!',
				'onclick': "buscar('lunes');",
				'class': 'collection-item no-link'
			},
			'martes': {
				'href': '#!',
				'onclick': "buscar('martes');",
				'class': 'collection-item no-link'
			},
			'miércoles': {
				'href': '#!',
				'onclick': "buscar('miercoles');",
				'class': 'collection-item no-link'
			},
			'jueves': {
				'href': '#!',
				'onclick': "buscar('jueves');",
				'class': 'collection-item no-link'
			},
			'viernes': {
				'href': '#!',
				'onclick': "buscar('viernes');",
				'class': 'collection-item no-link'
			},
			'sábado': {
				'href': '#!',
				'onclick': "buscar('sabado');",
				'class': 'collection-item no-link'
			},
			'domingo': {
				'href': '#!',
				'onclick': "buscar('domingo');",
				'class': 'collection-item no-link'
			}
		},
		'estrenos': {
			'Sin ver': {
				'href': '#!',
				'onclick': "buscar('sin ver');",
				'class': 'collection-item no-link'
			},
			'Visto': {
				'href': '#!',
				'onclick': "buscar('visto');",
				'class': 'collection-item no-link'
			},
			'Ver hoy': {
				'href': '#!',
				'onclick': "buscar('ver hoy');",
				'class': 'collection-item no-link'
			}
		}
	});
	$('.collapsible').collapsible('open', 0);
})

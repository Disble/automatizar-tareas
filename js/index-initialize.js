$(document).ready(() => {
	render = new Render()
	render.menuRender({
		'día': {
			'lunes': {
				'href': '#!',
				'onclick': "buscar('lunes');",
				'class': 'collection-item'
			},
			'martes': {
				'href': '#!',
				'onclick': "buscar('martes');",
				'class': 'collection-item'
			},
			'miércoles': {
				'href': '#!',
				'onclick': "buscar('miercoles');",
				'class': 'collection-item'
			},
			'jueves': {
				'href': '#!',
				'onclick': "buscar('jueves');",
				'class': 'collection-item'
			},
			'viernes': {
				'href': '#!',
				'onclick': "buscar('viernes');",
				'class': 'collection-item'
			},
			'sábado': {
				'href': '#!',
				'onclick': "buscar('sabado');",
				'class': 'collection-item'
			},
			'domingo': {
				'href': '#!',
				'onclick': "buscar('domingo');",
				'class': 'collection-item'
			}
		}
	});
	render.cargarTablasAnime();
	buscar(render.diaSemana());
	$('.collapsible').collapsible('open', 0);
});

$(document).ready(() => {
	render = new Render()
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
		}
	});
	render.cargarTablasAnime()
	buscar(render.diaSemana())
	$('.collapsible').collapsible('open', 0)
})

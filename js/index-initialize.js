$(document).ready(() => {
	menuRender();
	cargarTablasAnime();
	buscar(diaSemana());
	$('.collapsible').collapsible('open', 0);
	contNewFolder = 0;
});

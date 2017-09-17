$(document).ready(() => {
	buscarTodo();
	document.addEventListener('dragover', function (e) {
		e.preventDefault();
		e.stopPropagation();
	});
	document.addEventListener('drop', function (e) {
		e.preventDefault();
		e.stopPropagation();
	});
});

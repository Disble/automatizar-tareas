function actualizarLista(consulta, dia) {
	var tblListaAnimes = "";
	$.each(consulta, function(i, item){
		tblListaAnimes += `<tr>
								<td>${consulta[i].nombre}</td>
								<td class='center'>${consulta[i].nrocapvisto}</td>
								<td>${consulta[i].pagina}</td>
								<td>
									<div class="btnIncremento">
									<a class="btn-floating btn waves-effect waves-light red" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto - 1)});" >-</a>
									<a class="btn-floating btn waves-effect waves-light blue" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto + 1)});" >+</a>
									</div>
								</td>
								<td>
									<button class="btn btn-small green" onclick="abrirCarpeta('${(consulta[i].carpeta)}');">Abrir</button>
								</td>
							</tr>"`;
	});
	$('#contenido').html(tblListaAnimes);
	$('.titulo').html(dia);
}
function increNuevosAnimes(){
	let nuevaConsulta = `<tr>
							<td><input type="number" name="orden" required></td>
							<td><input type="text" name="nombre" required></td>
							<td><input type="text" name="dia" required></td>
							<td><input type="number" name="nrocapvisto" required></td>
							<td><input type="text" name="pagina" required></td>
							<td>
								<input type="file" name="carpeta" onchange="getFolder(this)" id="file" class="inputfile" webkitdirectory />
								<label for="file">Escoja una carpeta</label>
							</td>
						</tr>`;
	$('#agregarNuevoAnime').parent().parent().parent().before(nuevaConsulta);
}
function crearJSON(){
	var inputs = $("input[type]");
	var listaEnviar = Array();
	var contenido = Array();
	inputs.each(function(key, value) {
		let llave = inputs[key].getAttribute('name');
		let valor = inputs[key].value;
		if (llave == "orden" || llave == "nrocapvisto")
			contenido[llave] = parseInt(valor);
		else
			contenido[llave] = valor;
		//console.log(contenido);
		if(llave=="carpeta"){
			var json = {
				'orden' : contenido['orden'],
				'nombre': contenido['nombre'],
				'dia': contenido['dia'].toLowerCase(),
				'nrocapvisto': contenido['nrocapvisto'],
				'pagina': contenido['pagina'].toLowerCase(),
				'carpeta': inputs[key].getAttribute('value')
			};
			listaEnviar.push(json);
			contenido = Array();
		}
		//console.log(listaEnviar);
	});
	console.log(listaEnviar);
	return listaEnviar;
}

function menuRender(){
	var menu = {
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
			'miercoles': {
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
			'sabado': {
				'href': '#!',
				'onclick': "buscar('sabado');",
				'class': 'collection-item'
			},
			'domingo': {
				'href': '#!',
				'onclick': "buscar('domingo');",
				'class': 'collection-item'
			}
		},
		'opciones': {
			'Ver Anime': {
				'href': 'index.html',
				'class': 'collection-item'
			},
			'Agregar Anime': {
				'href': 'agregar-animes.html',
				'class': 'collection-item'
			},
			'Editar Anime': {
				'href': '#!',
				'class': 'collection-item'
			},
			'Pendientes': {
				'href': 'pendientes.html',
				'class': 'collection-item'
			},
			'Agregar Pendientes': {
				'href': 'editar-pendientes.html',
				'class': 'collection-item'
			}
		}
	};
	var salidaMenu = '';
	$.each(menu, function(nivel1, value1){
		salidaMenu += `<li>
							<div class="collapsible-header">${firstUpperCase(nivel1)}</div>`;
		if (value1 != null){
			salidaMenu += `<div class="collapsible-body no-padding">
								<div class="collection">`;
		}
		$.each(value1, function(nivel2, value2){
			salidaMenu += `<a `;
			$.each(value2, function(nivel3, value2){
				salidaMenu += `${nivel3}="${value2}" `;
			});
			salidaMenu += `>${firstUpperCase(nivel2)}</a>`;
		});
		if (value1 != null){
			salidaMenu += `</div>
					  </div>`;
		}
		salidaMenu += `</li>`;
	});
	//console.log(salidaMenu);
	$('#menu').html(salidaMenu);
}

function cargarTablasAnime(){
	var anime = [
				"Nombre",
				"Cap Visto",
				"Pagina",
				"Min/Add",
				"Carpeta"
			];
	var myHtml = "";
	$.each(anime, function(i, item){
		myHtml += "<th class=\"lenguajes\">" + item + "</th>";
	});
	$('#cabecera').html(myHtml);
}

function firstUpperCase(value){
	return value.charAt(0).toUpperCase() + value.slice(1);;
}

function diaSemana(){
	var diasSemana = new Array("domingo","lunes","martes","miércoles","jueves","viernes","sábado");
	var f=new Date();
	return diasSemana[f.getDay()];
}

function abrirCarpeta(folder){
	console.log(`D:/Anime/${folder}/*`);
	//if (shell.showItemInFolder(`D:\\Anime\\${folder}\\*`))
	if (shell.showItemInFolder(`${folder}/*`))
		console.log('SI');
	else
		console.log('NO');
}

function getFolder(dir){
	console.log(dir);
	let folder = dir.files[0].path
	let tam = folder.length;
	let path = '';
	for(let i = 0; i < tam; i++){
		if (folder.charCodeAt(i) === 92){
			path += '/';
			continue;
		}
		path += folder[i];
	}
	console.log(path);
	$(dir).attr('value', path)
	console.log($(dir).value);
}

$(document).ready(() => {
	menuRender();
	cargarTablasAnime();
	buscar(diaSemana());
	$('.collapsible').collapsible('open', 0);
});

/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
function actualizarListaCompleta(consulta) {
	let tblListaAnimes = '';
	let cont = 0;
	$.each(consulta, function(i, item){
		tblListaAnimes += `<tr>
								<td><input class="btn btn-small" type="button" id="eraser${++cont}" value="${cont}" /></td>
								<td>${consulta[i].nombre}</td>
								<td>${consulta[i].dia}</td>
								<td>${consulta[i].orden}</td>
								<td>${consulta[i].nrocapvisto}</td>
								<td>${consulta[i].pagina}</td>
								<td>${consulta[i].carpeta}</td>
								<td class="hidden">${consulta[i]._id}</td>
							</tr>"`;
	});
	$('#contenido').html(tblListaAnimes);
}

function actualizarLista(consulta, dia) {
	let tblListaAnimes = '';
	$.each(consulta, function(i, item){
		tblListaAnimes += `<tr>
								<td>${consulta[i].nombre}</td>
								<td>${consulta[i].nrocapvisto}</td>
								<td>${consulta[i].pagina}</td>
								<td>
									<div class="btnIncremento">
									<a class="btn-floating btn waves-effect waves-light red" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto - 1)});" >-</a>
									<a class="btn-floating btn waves-effect waves-light blue" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto + 1)});" >+</a>
									</div>
								</td>
								<td>
									<button class="btn btn-small green ${consulta[i].carpeta === null || consulta[i].carpeta === undefined ? 'disabled': ''}" onclick="abrirCarpeta('${consulta[i].carpeta}');">Abrir</button>
								</td>
							</tr>"`;
	});
	$('#contenido').html(tblListaAnimes);
	$('.titulo').html(dia);
}

function menuRender(menu){
	var salidaMenu = '';
	$.each(menu, function(nivel1, value1){
		salidaMenu += `<li>
							<div class="collapsible-header flex-center">${firstUpperCase(nivel1)}</div>`;
		if (value1 != null){
			salidaMenu += `<div class="collapsible-body no-padding">
								<div class="collection">`;
		}
		$.each(value1, function(nivel2, value2){
			salidaMenu += `<a `;
			$.each(value2, function(nivel3, value3){
				salidaMenu += `${nivel3}="${value3}" `;
			});
			salidaMenu += `>${firstUpperCase(nivel2)}</a>`;
		});
		if (value1 != null){
			salidaMenu += `</div>
					  </div>`;
		}
		salidaMenu += `</li>`;
	});
	$('#menu').html(salidaMenu);
}

function cargarTablasAnime(){
	let anime = [
				'Nombre',
				'Capítulo Visto',
				'Página',
				'Min/Add',
				'Carpeta'
			];
	let myHtml = '';
	$.each(anime, function(i, item){
		myHtml += `<th>${item}</th>`;
	});
	$('#cabecera').html(myHtml);
}

/*------------------------- RENDER DINAMICO ---------------------------------------*/

function increNuevosAnimes(){
	let nuevaConsulta = `<tr>
							<td><input type="number" name="orden" required></td>
							<td><input type="text" name="nombre" required></td>
							<td><input type="text" name="dia" required></td>
							<td><input type="number" name="nrocapvisto" required></td>
							<td><input type="text" name="pagina" required></td>
							<td>
								<input type="file" name="carpeta" onchange="getFolder(this)" id="file${++contNewFolder}" class="inputfile" webkitdirectory />
								<label for="file${contNewFolder}" class="tooltipped blue" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
							</td>
						</tr>`;
	$('#agregarNuevoAnime').parent().parent().parent().before(nuevaConsulta);
	$('.tooltipped').tooltip({delay: 50});
}

function crearJSON(){
	var inputs = $('input[type]');
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
	});
	//console.log(listaEnviar);
	return listaEnviar;
}

function crearJSONActualizar(row){
	let json = {
		'orden' : parseInt(row[2]),
		'nombre': row[0],
		'dia': row[1],
		'nrocapvisto': parseInt(row[3]),
		'pagina': row[4],
		'carpeta': row[5]
	}
	return json;
}

function abrirCarpeta(folder){
	if (!shell.showItemInFolder(`${folder}/*`))
		alert('Hubo problemas al abrir la carpeta.\nPor favor revise el formato de la dirección de la carpeta en Editar Animes.', 'Error');
}

function getFolder(dir){
	if (dir === undefined || dir === null || dir.files[0] === undefined) return;
	let folder = dir.files[0].path;
	let tam = folder.length;
	let path = '';
	for(let i = 0; i < tam; i++){
		if (folder.charCodeAt(i) === 92){
			path += '/';
			continue;
		}
		path += folder[i];
	}
	$(dir).attr('value', path);
	$(dir).siblings().html('Cargado');
	$(dir).siblings().attr('data-tooltip', path);
	$(dir).siblings().removeClass('blue');
	$(dir).siblings().addClass('green');
	$('.tooltipped').tooltip({delay: 50});
}

function cellEdit(){
	$('td').each(function(key, value){
		$(value).dblclick(function(){
			$(this).attr('contenteditable', 'true')
			$(this).focus()
		})
		$(value).focusout(function(){
			$(this).removeAttr('contenteditable')
			let row = Array()
			$(this).parent().children().each((key, value) => {
				if (key != 0)
					row.push(value.textContent)
			})
			let id = row[6]
			actualizarFila(id, crearJSONActualizar(row))
		})
		$(value).bind('keypress', function(e) {
			if(e.keyCode==13)
				$(this).trigger('focusout')
		})
	})
}

function eraserRow(){
	let btnBorrar = $('td').find('input')
	btnBorrar.parent().unbind()
	btnBorrar.each(function(key, value){
		$(value).click(function(e){
			if (confirm('¿Estás seguro que quieres borrar esta fila?','Advertencia')){
				let id = ''
				$(this).parent().parent().find('.hidden').each((key, value) => id = value.textContent)
				borrarFila(id)
			}
		})
	})
}

/*------------------------- FUNCIONES ADICIONALES ---------------------------------------*/
function firstUpperCase(value){
	return value.charAt(0).toUpperCase() + value.slice(1)
}

function diaSemana(){
	let diasSemana = new Array("domingo","lunes","martes","miercoles","jueves","viernes","sabado")
	let f = new Date()
	return diasSemana[f.getDay()]
}

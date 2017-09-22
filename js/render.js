class Render {
	constructor() {
		this.contNewFolder = 0
	}
	/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
	actualizarListaCompleta(consulta) {
		let tblListaAnimes = ''
		let cont = 0
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
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	actualizarLista(consulta, dia) {
		let tblListaAnimes = ''
		$.each(consulta, function(i, item){
			tblListaAnimes += `<tr>
									<td>${consulta[i].nombre}</td>
									<td>${consulta[i].nrocapvisto}</td>
									<td>${consulta[i].pagina}</td>
									<td>
										<div class="btnIncremento">
										<a class="btn-floating btn waves-effect waves-light red" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto - 1)})" >-</a>
										<a class="btn-floating btn waves-effect waves-light blue" onclick="actualizar('${consulta[i].dia}', ${consulta[i].orden}, ${(consulta[i].nrocapvisto + 1)})" >+</a>
										</div>
									</td>
									<td>
										<button class="btn btn-small green ${consulta[i].carpeta === null || consulta[i].carpeta === undefined ? 'disabled': ''}" onclick="render.abrirCarpeta('${consulta[i].carpeta}')">Abrir</button>
									</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
		$('.titulo').html(dia)
	}

	menuRender(menu){
		var salidaMenu = ''
		let that = this
		$.each(menu, function(nivel1, value1){
			salidaMenu += `<li>
								<div class="collapsible-header flex-center">${that.firstUpperCase(nivel1)}</div>`
			if (value1 != null){
				salidaMenu += `<div class="collapsible-body no-padding">
									<div class="collection">`
			}
			$.each(value1, function(nivel2, value2){
				salidaMenu += `<a `
				$.each(value2, function(nivel3, value3){
					salidaMenu += `${nivel3}="${value3}" `
				})
				salidaMenu += `>${that.firstUpperCase(nivel2)}</a>`
			})
			if (value1 != null){
				salidaMenu += `</div>
						  </div>`
			}
			salidaMenu += `</li>`
		})
		$('#menu').html(salidaMenu)
	}

	cargarTablasAnime(){
		let anime = [
					'Nombre',
					'Capítulo Visto',
					'Página',
					'Min/Add',
					'Carpeta'
				]
		let myHtml = ''
		$.each(anime, function(i, item){
			myHtml += `<th>${item}</th>`
		})
		$('#cabecera').html(myHtml)
	}

	/*------------------------- RENDER DINAMICO ---------------------------------------*/

	increNuevosAnimes(){
		let nuevaConsulta = `<tr>
								<td><input type="number" name="orden" required></td>
								<td><input type="text" name="nombre" required></td>
								<td><input type="text" name="dia" required></td>
								<td><input type="number" name="nrocapvisto" required></td>
								<td><input type="text" name="pagina" required></td>
								<td>
									<input type="file" name="carpeta" onchange="render.getFolder(this)" id="file${++this.contNewFolder}" class="inputfile" webkitdirectory />
									<label for="file${this.contNewFolder}" class="tooltipped blue" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
								</td>
							</tr>`
		$('#agregarNuevoAnime').parent().parent().parent().before(nuevaConsulta)
		$('.tooltipped').tooltip({delay: 50})
	}

	crearJSON(){
		var inputs = $('input[type]')
		var listaEnviar = Array()
		var contenido = Array()
		inputs.each(function(key, value) {
			let llave = inputs[key].getAttribute('name')
			let valor = inputs[key].value
			if (llave == "orden" || llave == "nrocapvisto")
				contenido[llave] = parseInt(valor)
			else
				contenido[llave] = valor
			//console.log(contenido)
			if(llave=="carpeta"){
				var json = {
					'orden' : contenido['orden'],
					'nombre': contenido['nombre'],
					'dia': contenido['dia'].toLowerCase(),
					'nrocapvisto': contenido['nrocapvisto'],
					'pagina': contenido['pagina'].toLowerCase(),
					'carpeta': inputs[key].getAttribute('value')
				}
				listaEnviar.push(json)
				contenido = Array()
			}
		})
		//console.log(listaEnviar)
		return listaEnviar
	}

	crearJSONActualizar(row){
		let json = {
			'orden' : parseInt(row[2]),
			'nombre': row[0],
			'dia': row[1],
			'nrocapvisto': parseInt(row[3]),
			'pagina': row[4],
			'carpeta': row[5] == 'null' || row[5] == '' ? null : this.slashFolder(row[5])
		}
		return json
	}

	abrirCarpeta(folder){
		if (!shell.showItemInFolder(`${folder}/*`))
			alert('Hubo problemas al abrir la carpeta.\nPor favor revise el formato de la dirección de la carpeta en Editar Animes.', 'Error')
	}

	getFolder(dir){
		if (dir === undefined || dir === null || dir.files[0] === undefined) return
		let folder = dir.files[0].path
		let path = this.slashFolder(folder)
		console.log(path)
		$(dir).attr('value', path)
		$(dir).siblings().html('Cargado')
		$(dir).siblings().attr('data-tooltip', path)
		$(dir).siblings().removeClass('blue')
		$(dir).siblings().addClass('green')
		$('.tooltipped').tooltip({delay: 50})
		return path
	}

	slashFolder(folder){
		let path = ''
		for(let i in folder){
			if (folder.charCodeAt(i) === 92){
				path += '/'
				continue
			}
			path += folder[i]
		}
		return path
	}

	cellEdit(){
		let that = this
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
				actualizarFila(id, that.crearJSONActualizar(row))
			})
			$(value).bind('keypress', function(e) {
				if(e.keyCode==13)
					$(this).trigger('focusout')
			})
		})
	}

	eraserRow(){
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
	firstUpperCase(value){
		return value.charAt(0).toUpperCase() + value.slice(1)
	}

	diaSemana(){
		let diasSemana = new Array("domingo","lunes","martes","miercoles","jueves","viernes","sabado")
		let f = new Date()
		return diasSemana[f.getDay()]
	}
}

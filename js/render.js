'use strict'
class Render {
	constructor() {
		this.contNewFolder = 0
	}
	/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
	actualizarListaCompleta(consulta) {
		let tblListaAnimes = ''
		let cont = 0
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td><input class="btn btn-small" type="button" id="eraser${++cont}" value="${cont}" /></td>
									<td>${consulta[i].nombre}</td>
									<td>${this._addDiasAccents(consulta[i].dia)}</td>
									<td>${consulta[i].orden}</td>
									<td>${this._isFinalizado(consulta[i].nrocapvisto)}</td>
									<td>${consulta[i].pagina}</td>
									<td>${consulta[i].carpeta}</td>
									<td class="hidden">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	actualizarLista(consulta, dia) {
		let tblListaAnimes = ''
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td>${consulta[i].nombre}</td>
									<td>${this._isFinalizado(consulta[i].nrocapvisto)}</td>
									<td>${this._paginaConstructor(consulta[i].pagina)}</td>
									<td>
										<div class="btnIncremento">
										<a class="btn-floating btn waves-effect waves-light red" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${consulta[i].nrocapvisto < 0 ? -1 : (consulta[i].nrocapvisto - 1)})" >-</a>
										<a class="btn-floating btn waves-effect waves-light blue" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${(consulta[i].nrocapvisto + 1)})" >+</a>
										</div>
									</td>
									<td>
										<button class="btn btn-small green ${consulta[i].carpeta === null || consulta[i].carpeta === undefined ? 'disabled': ''}" onclick="render.abrirCarpeta('${consulta[i].carpeta}')">Abrir</button>
									</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
		$('.titulo').html(this._addDiasAccents(dia))
		$('.url-external').click(function (e) {
			e.preventDefault()
			e.stopPropagation()
			$(this).each(function(key, value) {
				if (!shell.openExternal(value.href))
					alert('Hubo problemas al abrir la url.\nPor favor revise el formato de la url en Editar Animes.', 'Error')
			})
		})
	}

	menuRender(menu){
		var salidaMenu = ''
		$.each(menu, (nivel1, value1) => {
			salidaMenu += `<li>
								<div class="collapsible-header flex-center">${this._firstUpperCase(nivel1)}</div>`
			if (value1 != null){
				salidaMenu += `<div class="collapsible-body no-padding">
									<div class="collection">`
			}
			$.each(value1, (nivel2, value2) => {
				salidaMenu += `<a `
				$.each(value2, (nivel3, value3) => {
					salidaMenu += `${nivel3}="${value3}" `
				})
				salidaMenu += `>${this._firstUpperCase(nivel2)}</a>`
			})
			if (value1 != null){
				salidaMenu += `</div>
						  </div>`
			}
			salidaMenu += `</li>`
		})
		$('#menu').html(salidaMenu)
		$('.no-link').click(function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
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

	crearJson(){
		var inputs = $('input[type]')
		var listaEnviar = Array()
		var contenido = Array()
		inputs.each((key, value) => {
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
					'dia': this._quitaAcentos(contenido['dia']),
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

	crearJsonActualizar(row){
		let json = {
			'orden' : parseInt(row[2]) < 0 ? 0 : parseInt(row[2]),
			'nombre': row[0],
			'dia': this._quitaAcentos(row[1]),
			'nrocapvisto': this._estadoNumCap(row[3]),
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
				actualizarFila(id, that.crearJsonActualizar(row))
			})
			$(value).bind('keypress', function(e) {
				if(e.keyCode==13)
					$(this).trigger('focusout')
			})
		})
	}

	actualizarCapitulo(dia, fila, cont){
		let id = $(fila).parent().parent().parent().find('#key').text()
		actualizar(dia, id, cont)
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
	diaSemana(){
		let diasSemana = new Array("domingo","lunes","martes","miercoles","jueves","viernes","sabado")
		let f = new Date()
		return diasSemana[f.getDay()]
	}

	_addDiasAccents(dia){
		if (dia == 'sabado')
			return 'sábado'
		else if (dia === 'miercoles')
			return 'miércoles'
		else
			return dia
	}

	_firstUpperCase(value){
		return value.charAt(0).toUpperCase() + value.slice(1)
	}

	_estadoNumCap(numCap){
		numCap = parseInt(numCap)
		if (numCap < -1 || isNaN(numCap))
			return 0
		else
			return numCap
	}

	_isFinalizado(numCap){
		numCap = parseInt(numCap)
		if (numCap == -1)
			return 'Finalizado'
		else if (numCap < -1)
			return 'Hackerman :V'
		else
			return numCap
	}

	_paginaConstructor(pagina){
		if (this._isUrl(pagina))
			return this._redirectExternalConstructor(pagina)
		else
			return this._firstUpperCase(pagina)
	}

	_isUrl(path) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(path)
	}

	_redirectExternalConstructor(path){
		let url = document.createElement('a')
		url.href = path
		url.innerText = this._firstUpperCase(url.hostname)
		url.setAttribute('class', 'url-external')
		return url.outerHTML
	}

	_quitaAcentos(str) {
		var res = str.toLowerCase()
		res = res.replace(new RegExp(/\s/g),'')
		res = res.replace(new RegExp(/[àáâãäå]/g),'a')
		res = res.replace(new RegExp(/[èéêë]/g),'e')
		res = res.replace(new RegExp(/[ìíîï]/g),'i')
		res = res.replace(new RegExp(/ñ/g),'n')
		res = res.replace(new RegExp(/[òóôõö]/g),'o')
		res = res.replace(new RegExp(/[ùúûü]/g),'u')
		return res
	}
}

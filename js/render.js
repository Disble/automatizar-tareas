'use strict'
/*NOTE: Quitar comentarios al acabar*/
class Render {
	constructor() {
		this.contNewFolder = 0
		this.numReg = 10
		/*Bloquea el drag and drop en la pagina*/
		document.addEventListener('dragover', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		document.addEventListener('drop', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
	}
	/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
	actualizarListaCompleta(consulta, salto) {
		let tblListaAnimes = ''
		let cont = salto
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td><input class="btn btn-small" type="button" id="eraser${++cont}" value="${cont}" /></td>
									<td>${consulta[i].nombre}</td>
									<td>${this._addDiasAccents(consulta[i].dia)}</td>
									<td>${consulta[i].orden}</td>
									<td>${consulta[i].nrocapvisto}</td>
									<td>${consulta[i].pagina}</td>
									<td>${this.isNoData(consulta[i].carpeta) ? '' : consulta[i].carpeta}</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	actualizarLista(consulta, dia) {
		let tblListaAnimes = ''
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td>
										<button data-target="modal${i}" class="btn btn-small modal-trigger">${consulta[i].orden}</button>
										<div id="modal${i}" class="modal">
											<div class="modal-footer">
												<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">X</a>
											</div>
											<div class="modal-content">
												<h4>Mensaje de confirmación</h4>
												<p>Escoga uno de los siguientes estados</p>
												<button class="btn btn-small modal-close green" onclick="estadoCap('${dia}', '${consulta[i]._id}', ${0})"><i class="icon-play"></i> Viendo</button>
												<button class="btn btn-small modal-close" onclick="estadoCap('${dia}', '${consulta[i]._id}', ${1})"><i class="icon-ok-squared"></i> Finalizar</button>
												<button class="btn btn-small modal-close red" onclick="estadoCap('${dia}', '${consulta[i]._id}', ${2})"><i class="icon-emo-unhappy"></i> No me Gusto</button>
											</div>
											<div class="modal-footer">
											</div>
										</div>
									</td>
									<td>${consulta[i].nombre}</td>
									<td>${this._blockSerie(consulta[i].estado) ? this._estadoSerie(consulta[i].estado) : consulta[i].nrocapvisto}</td>
									<td>${this._paginaConstructor(consulta[i].pagina)}</td>
									<td>
										<div class="btnIncremento">
										<a class="btn-floating btn waves-effect waves-light red ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${consulta[i].nrocapvisto <= 0 ? 0 : (consulta[i].nrocapvisto - 1)})" >-</a>
										<a class="btn-floating btn waves-effect waves-light blue ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${(consulta[i].nrocapvisto + 1)})" >+</a>
										</div>
									</td>
									<td>
										<button class="btn btn-small green ${this.isNoData(consulta[i].carpeta) ? 'disabled': ''}" onclick="render.abrirCarpeta('${consulta[i].carpeta}')"><span style="display: flex" class="tooltipped" data-position="left" data-delay="500" data-tooltip="Abrir carpeta"><i class="icon-folder-open"></i></span></button>
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
		$('.tooltipped').tooltip({delay: 50})
		$('.modal').modal()
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
					'Órden/\nEstado',
					'Nombre',
					'Capítulos Vistos',
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
								<td><input type="number" name="orden" min="1" required></td>
								<td><input type="text" name="nombre" required></td>
								<td><input type="text" name="dia" required></td>
								<td><input type="number" name="nrocapvisto" min="0" required></td>
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
					'carpeta': inputs[key].getAttribute('value'),
					'estado' : 0,
					'activo' : true,
					'fechaCreacion' : new Date()
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
			'nombre': row[0],
			'dia': this._quitaAcentos(row[1]),
			'orden': parseInt(row[2]) < 1 ? 1 : parseInt(row[2]),
			'nrocapvisto': this._estadoNumCap(row[3]),
			'pagina': row[4],
			'carpeta': this.isNoData(row[6]) ? null : this.slashFolder(row[5])
		}
		//console.log(json)
		return json
	}

	abrirCarpeta(folder){
		if (!shell.showItemInFolder(`${folder}/*`))
			alert('Hubo problemas al abrir la carpeta.\nPor favor revise el formato de la dirección de la carpeta \nen Editar Animes o compruebe que la carpeta exista.', 'Error')
	}

	getFolder(dir){
		if (this.isNoData(dir) || dir.files[0] === undefined) return
		let folder = dir.files[0].path
		let path = this.slashFolder(folder)
		//console.log(path)
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
	/*NOTE: Borrar el estado de aqui y los que sigan, para futuras actualizaciones*/
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
					if (key != 0 && key != this.length)
						row.push(value.textContent)
				})
				let id = $(this).parent().find('#key').text()
				//console.log('id : ' + id)
				let pag = parseInt($('#paginas').find('.active a').text())
				actualizarFila(id, that.crearJsonActualizar(row), pag)
			})
			$(value).bind('keypress', function(e) {
				if(e.keyCode==13)
					$(this).trigger('focusout')
			})
		})
	}

	actualizarCapitulo(dia, fila, cont){
		let id = $(fila).parent().parent().parent().find('#key').text()
		actualizarCap(dia, id, cont)
	}

	eraserRow(){
		let btnBorrar = $('td').find('input')
		btnBorrar.parent().unbind()
		btnBorrar.each(function(key, value){
			$(value).click(function(){
				if (confirm('¿Estás seguro que quieres borrar esta fila?','Advertencia')){
					let id = ''
					$(this).parent().parent().find('.hidden').each((key, value) => id = value.textContent)
					let pag = parseInt($('#paginas').find('.active a').text())
					//console.log(pag);
					borrarFila(id, pag)
				}
			})
		})
	}

	changeState(){
		let that = this
		let btnBorrar = $('td').find('input')
		btnBorrar.parent().unbind()
		btnBorrar.each(function(key, value){
			$(value).click(function(){
				if (confirm('¿Desea marcar este anime como Finalizado?','Advertencia')){
					let id = ''
					$(this).parent().parent().find('.hidden').each((key, value) => id = value.textContent)
					let dia = that._quitaAcentos($('.titulo').text().toLowerCase())
					estadoCap(dia, id, 1)
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
		if (dia === 'sabado')
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
		res = res.replace(new RegExp(/[àáâãäå]/g),'a')
		res = res.replace(new RegExp(/[èéêë]/g),'e')
		res = res.replace(new RegExp(/[ìíîï]/g),'i')
		res = res.replace(new RegExp(/ñ/g),'n')
		res = res.replace(new RegExp(/[òóôõö]/g),'o')
		res = res.replace(new RegExp(/[ùúûü]/g),'u')
		return res
	}

	_estadoSerie(estado){
		let nombreEstado = ['Viendo', 'Finalizado', 'No me gusto']
		if (this.isNoData(estado))
			return
		return nombreEstado[estado]
	}

	_blockSerie(estado){
		if (estado == undefined || estado == 0)
			return false
		else if (estado === 1 || estado == 2)
			return true
	}

	isNoData(data){
		return data === undefined || data === null
	}

	_totalPag(totalReg) {
		return Math.ceil(totalReg / this.numReg)
	}

	saltoPaginacion(pag, totalReg) {
		return this.numReg  * (pag - 1)
	}

	limitePaginas(todasPag) {
		/*10 es el límite de las paginas a mostrar*/
		return todasPag > 10
	}

	limitePaginasInicio(pagActual, totalPag) {
		let inicio = pagActual - 5
		let passLimitEnd = totalPag - 9
		if (inicio < 2)
			return 1
		else
			return pagActual + 4 > totalPag ? passLimitEnd : inicio
	}

	limitePaginasFin(pagActual, totalPag) {
		let inicio = pagActual - 5
		let fin = pagActual + 4 > totalPag ? totalPag : pagActual + 4
		if (inicio < 2)
			return 10
		else
			return fin
	}

	imprimirPagination(totalReg, actual) {
		let todasPag = this._totalPag(totalReg)
		let ini = this.limitePaginas(todasPag) ? this.limitePaginasInicio(actual, todasPag) : 1
		let fin = this.limitePaginas(todasPag) ? this.limitePaginasFin(actual, todasPag) : todasPag
		let paginas = `<li class="waves-effect ${actual == ini ? 'disabled' : ''}"><a href="#!" ${actual == ini ? '' : `onclick="cargarEditar(1);"`}><i class="icon-pag icon-left-open"></i></a></li>`
		for (let i = ini; i <= fin; i++) {
			paginas += `<li class="waves-effect ${actual == i ? 'active' : ''}"><a href="#!" onclick="cargarEditar(${i});">${i}</a></li>`
		}
		paginas += `<li class="waves-effect ${actual == fin ? 'disabled' : ''}"><a href="#!" ${actual == fin ? '' : `onclick="cargarEditar(${todasPag});"`}><i class="icon-pag icon-right-open"></i></a></li>`
		$('#paginas').html(paginas)
		//console.log("total reg :" + totalReg, ', todas pag : ' + todasPag, ', pag actual : ' + actual);
	}
}

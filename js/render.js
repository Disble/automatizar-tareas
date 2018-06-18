'use strict'
/*NOTE: Quitar comentarios al acabar*/
require('sweetalert');
class Render {
	constructor() {
		this.contNewFolder = 0;
		this.numReg = 10;
		/*Bloquea el drag and drop en la pagina*/
		document.addEventListener('dragover', function (e) {
			e.preventDefault();
			e.stopPropagation();
		})
		document.addEventListener('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
		})
	}
	/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
	actualizarListaCompleta(consulta, salto) {
		let tblListaAnimes = ''
		let cont = salto
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr ${this.isNoData(consulta[i].estado) ? '' : `class="${this.getState(consulta[i].estado).backgroundColor} lighten-4"`}>
									<td><input class="btn btn-small" type="button" id="eraser${++cont}" value="${cont}" /></td>
									<td>${consulta[i].nombre}</td>
									<td>${this._addDiasAccents(consulta[i].dia)}</td>
									<td>${consulta[i].orden}</td>
									<td>${consulta[i].nrocapvisto}</td>
									<td>${this.isNoData(consulta[i].totalcap) ? '' : consulta[i].totalcap}</td>
									<td>${consulta[i].pagina}</td>
									<td>${this.isNoData(consulta[i].carpeta) ? '' : consulta[i].carpeta}</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	actualizarLista(consulta, dia) {
		let tblListaAnimes = '';
		$.each(consulta, (i, item) => {
			tblListaAnimes += /*html*/`<tr>
									<td>
										<button data-target="modal${i}" class="btn btn-small modal-trigger">${consulta[i].orden}</button>
										<div id="modal${i}" class="modal">
											<div class="modal-footer">
												<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">X</a>
											</div>
											<div class="modal-content">
												<h4>Mensaje de confirmación</h4>
												<p>Escoga uno de los siguientes estados</p>
												<button class="btn btn-small modal-close green" onclick="estadoCap('${dia}', '${consulta[i]._id}', 0)"><i class="icon-play"></i> Viendo</button>
												<button class="btn btn-small modal-close" onclick="estadoCap('${dia}', '${consulta[i]._id}', 1)"><i class="icon-ok-squared"></i> Finalizar</button>
												<button class="btn btn-small modal-close red" onclick="estadoCap('${dia}', '${consulta[i]._id}', 2)"><i class="icon-emo-unhappy"></i> No me Gusto</button>
											</div>
											<div class="modal-footer">
											</div>
										</div>
									</td>
									<td>${consulta[i].nombre}</td>
									<td><span onmouseover="render.numCapituloInvertido(this, '${this._setNumCapitulo(consulta, i)}', ${consulta[i].totalcap})" onmouseout="render.numCapituloNormal(this, '${this._setNumCapitulo(consulta, i)}')" >${this._setNumCapitulo(consulta, i)}</span></td>
									<td>${this._paginaConstructor(consulta[i].pagina)}</td>
									<td>
										<div class="btnIncremento">
										<a class="btn-floating btn waves-effect waves-light red ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${consulta[i].nrocapvisto <= 0 ? 0 : (consulta[i].nrocapvisto - 1)})" ><i class="icon-minus icon-normal"></i></a>
										<a class="btn-floating btn waves-effect waves-light blue ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${(consulta[i].nrocapvisto + 1)})" ><i class="icon-plus icon-normal"></i></a>
										</div>
									</td>
									<td>
										<button class="btn btn-small green ${this.isNoData(consulta[i].carpeta) ? 'disabled': ''}" onclick="render.abrirCarpeta('${consulta[i].carpeta}')"><span style="display: flex" class="tooltipped" data-position="left" data-delay="500" data-tooltip="Abrir carpeta"><i class="icon-folder-open"></i></span></button>
									</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		});
		$('#contenido').html(tblListaAnimes);
		$('.titulo').html(this._addDiasAccents(dia));
		$('.url-external').click(function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).each(function(key, value) {
				if (!shell.openExternal(value.href))
					swal("Hubo problemas al abrir la url.", "Por favor revise el formato de la url en Editar Animes.", "error");
			});
		});
		$('.tooltipped').tooltip({delay: 50});
		$('.modal').modal();
	}

	_setNumCapitulo(consulta, i) {
		return this._blockSerie(consulta[i].estado) ? this.getState(consulta[i].estado).name : consulta[i].nrocapvisto;
	}

	numCapituloInvertido(el, num, total) {
		if (typeof total == "number" && num <= total) {
			num = parseInt(num);
			let capInv = total - num;
			el.innerText = '- ' + capInv;
		}
	}

	numCapituloNormal(el, num) {
		el.innerText = num;
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
				salidaMenu += `>${this._firstUpperCase(nivel2)} </a>`
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
		buscarMedallasDia(menu)
	}

	cargarMedallas(dia, cont) {
		//console.log($('#menu').find('a')[dia], cont)
		if (cont > 0) {
			let tagDia = $($('#menu').find('a')[dia])
			tagDia.append(`<span class="badge">${cont}</span>`)
		}
	}

	/*------------------------- RENDER DINAMICO ---------------------------------------*/
	increNuevosAnimes(){
		let nuevaConsulta = /*html*/`<tr>
								<td><input type="number" name="orden" min="1" required></td>
								<td><input type="text" name="nombre" required></td>
								<td><input type="text" name="dia" required></td>
								<td><input type="number" name="nrocapvisto" min="0" required></td>
								<td><input type="number" name="totalcap" min="0"  class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio"></td>
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
		let inputs = $('input[type]')
		let listaEnviar = []
		let contenido = []
		inputs.each((key, value) => {
			let llave = inputs[key].getAttribute('name')
			let valor = inputs[key].value
			if (llave == "orden" || llave == "nrocapvisto" || llave == "totalcap")
				contenido[llave] = parseInt(valor)
			else
				contenido[llave] = valor
			// console.log(contenido)
			if(llave=="carpeta"){
				let json = {
					orden : contenido['orden'],
					nombre: contenido['nombre'],
					dia: this._quitaAcentos(contenido['dia']),
					nrocapvisto: contenido['nrocapvisto'],
					totalcap: contenido['totalcap'],
					pagina: contenido['pagina'].toLowerCase(),
					carpeta: inputs[key].getAttribute('value'),
					estado : 0,
					activo : true,
					fechaCreacion : new Date()
				}
				listaEnviar.push(json)
				contenido = []
			}
		})
		// console.log(listaEnviar)
		return listaEnviar
	}

	crearJsonActualizar(row){
		let json = {
			nombre: row[0],
			dia: this._quitaAcentos(row[1]),
			orden: parseInt(row[2]) < 1 ? 1 : parseInt(row[2]),
			nrocapvisto: this._estadoNumCap(row[3]),
			totalcap: row[4] === '' ? undefined : row[4],
			pagina: row[5],
			carpeta: this.isNoData(row[6]) || row[6].length == 0 ? null : this.slashFolder(row[6])
		}
		// console.log(json)
		return json
	}

	abrirCarpeta(folder){
		if (!shell.showItemInFolder(`${folder}/*`)) {
			//swal("Hubo problemas al abrir la carpeta.", "Por favor revise el formato de la dirección de la carpeta en Editar Animes o compruebe que la carpeta exista.", "error");
			swal("Hubo problemas al abrir la carpeta.", "Es posible que la dirección haya cambiado o que la carpeta ha sido borrada.\n\n¿Quieres volver a escoger la carpeta?", "info", {
				buttons: ['No', 'Si']
			})
				.then((confirm) => { // escoge la direccion de una nueva carpeta
					if (confirm) {
						console.log('Nueva Carpeta');
					} else {
						swal("No hay problema.", "También es posible cambiar la dirección de la carpeta en Editar Animes.", "success")
					}
				});
		}
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
				swal({
				  title: "¿Estás seguro?",
				  text: "¡Una vez borrado aún se podra restaurar en historial!",
				  icon: "warning",
				  buttons: ["Cancelar", "OK"],
				  dangerMode: true,
				})
				.then((willDelete) => {
				  if (willDelete) {
						let id = '';
						$(this).parent().parent().find('.hidden').each((key, value) => id = value.textContent);
						let pag = parseInt($('#paginas').find('.active a').text());
						//console.log(pag);
						borrarFila(id, pag);
				  } else {
				    swal("¡Acción cancelada!", "", "info");
				  }
				});
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

	getState(estado) {
		return {
			0 : {
				name : 'Viendo',
				icon : 'icon-play',
				color : 'green-text',
				backgroundColor : 'green'
			},
			1 : {
				name : 'Finalizado',
				icon : 'icon-ok-squared',
				color : 'teal-text',
				backgroundColor : 'teal'
			},
			2 : {
				name : 'No me gusto',
				icon : 'icon-emo-unhappy',
				color : 'red-text',
				backgroundColor : 'red'
			}
		}[estado]
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

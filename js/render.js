'use strict'
/*NOTE: Quitar comentarios al acabar*/
require('sweetalert');
class Render {
	constructor(menu) {
		this.contNewFolder = 0;
		this.numReg = 10;
		this.menu = menu;
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
										<a class="btn-floating btn waves-effect waves-light btn-right-click-minus red ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${consulta[i].nrocapvisto <= 0.5 ? 0 : (consulta[i].nrocapvisto - 1)})" ><i class="icon-minus icon-normal"></i></a>
										<a class="btn-floating btn waves-effect waves-light btn-right-click-plus blue ${this._blockSerie(consulta[i].estado) ? 'disabled': ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}" onclick="render.actualizarCapitulo('${consulta[i].dia}', this, ${(consulta[i].nrocapvisto + 1)})" ><i class="icon-plus icon-normal"></i></a>
										</div>
									</td>
									<td>
										<button class="btn btn-small green ${this.isNoData(consulta[i].carpeta) ? 'disabled': ''}" onclick="render.abrirCarpeta('${this._noApostrophe(consulta[i].carpeta)}', '${consulta[i].dia}', '${consulta[i]._id}')"><span style="display: flex" class="tooltipped" data-position="left" data-delay="500" data-tooltip="Abrir carpeta"><i class="icon-folder-open"></i></span></button>
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
		
		// Click derecho para aumentar medio capitulo
		$('.btn-right-click-minus').on('mouseup', function(e) {
			if (e.button === 2) {
				// console.log('Click derecho para minus');
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap = cap <= 0 ? 0 : cap - 0.5;
				// console.log(e.target.parentElement, cap, dia);
				
				render.actualizarCapitulo(dia, e.target.parentElement, cap);
			}
		});
		$('.btn-right-click-plus').on('mouseup', function(e) {
			if (e.button === 2) {
				// console.log('Click derecho para plus');
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap += 0.5;
				// console.log(e.target.parentElement, cap, dia);
				
				render.actualizarCapitulo(dia, e.target.parentElement, cap);
			}
		});
		
	}

	_noApostrophe(folder) {
		let path = ''
		for(let i in folder){
			if (folder.charCodeAt(i) === 39){
				path += '\\\''
				continue
			}
			path += folder[i]
		}		
		return path
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

	menuRender(menu = this.menu){
		var salidaMenu = '';
		$.each(menu, (nivel1, value1) => {
			salidaMenu += `<li>
								<div class="collapsible-header flex-x-center">${this._firstUpperCase(nivel1)}</div>`
			if (value1 != null){
				salidaMenu += `<div class="collapsible-body no-padding">
									<div class="collection">`
			}
			$.each(value1, (nivel2, value2) => {
				salidaMenu += `<a `
				$.each(value2, (nivel3, value3) => {
					salidaMenu += `${nivel3}="${value3}" `
				})
				salidaMenu += `><span class="badge"></span>${this._firstUpperCase(nivel2)} </a>`
			})
			if (value1 != null){
				salidaMenu += `</div>
						  </div>`;
			}
			salidaMenu += `</li>`;
		})
		$('#menu').html(salidaMenu);
		$('.no-link').click(function (e) {
			e.preventDefault();
			e.stopPropagation();
		})
		buscarMedallasDia(menu);
	}

	cargarMedallas(dia, cont) {
		// console.log($('#menu').find('a').find('span')[dia], cont, dia)
		if (cont >= 0) {
			let tagDia = $($('#menu').find('a').find('span')[dia]);
			let numMedallas = cont == 0 ? '' : cont;
			tagDia.html(numMedallas);
		}
	}

	/*------------------------- RENDER DINAMICO ---------------------------------------*/
	increNuevosAnimes(){
		let nuevaConsulta = /*html*/ `<tr id="datos-anime-nuevo">
				<td><input type="number" name="orden" min="1" class="validate" required></td>
				<td><input type="text" name="nombre" class="validate" required></td>
				<td><input type="text" name="dia" class="validate" required></td>
				<td><input type="number" name="nrocapvisto" min="0" class="validate" required></td>
				<td><input type="number" name="totalcap" min="0" class="tooltipped validate" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio"></td>
				<td>
					<select name="tipo" class="validate browser-default" required>
						<option value="" disabled selected>Tipo</option>
						<option value="0">TV</option>
						<option value="1">Película</option>
						<option value="2">Especial</option>
						<option value="3">OVA</option>
					</select>
				</td>
				<td><input type="text" name="pagina" class="validate" required></td>
				<td>
					<input type="file" name="carpeta" onchange="render.getFolder(this)" id="file${++this.contNewFolder}" class="inputfile" webkitdirectory />
					<label for="file${this.contNewFolder}" class="tooltipped blue" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
				</td>
			</tr>`;
		$('#agregarNuevoAnime').parent().parent().parent().before(nuevaConsulta);
		$('.tooltipped').tooltip({delay: 50});
		$('select').material_select();
	}

	crearAnime(){
		let listaEnviar = [];
		let nuevosAnimes = $('tr[id="datos-anime-nuevo"]');
		// console.log('nuevos animes: ', nuevosAnimes);

		for (const nuevoAnime of nuevosAnimes) {
			let anime = {};
			let inputs = $(nuevoAnime).find('input[type]');
			let tipo = parseInt($(nuevoAnime).find('select[name="tipo"]').val());
			
			for (const input of inputs) {
				const valor = input.value;
				let llave = input.getAttribute('name');
				if (llave === "orden" || llave === "nrocapvisto" || llave === "totalcap" || llave === "tipo") {
					anime[llave] = parseInt(valor);
				} else if (llave === 'carpeta') {
					anime[llave] = input.getAttribute('value');
				} else {
					anime[llave] = valor.trim();
				}
				// console.log(anime);
			}
			anime.tipo = tipo;
			anime.estado = 0;
			anime.activo = true;
			anime.fechaCreacion = new Date();
			// console.log('Full nuevo anime: ', anime);
			listaEnviar.push(anime);
		}
		// console.log(listaEnviar);
		return listaEnviar;
	}

	abrirCarpeta(folder, dia, id){
		if (!shell.showItemInFolder(`${folder}/*`)) {
			swal("Hubo problemas al abrir la carpeta.", "Es posible que la dirección haya cambiado o que la carpeta ha sido borrada.\n\n¿Quieres volver a escoger la carpeta?", "info", {
				buttons: ['No', 'Si']
			})
				.then((confirm) => { // escoge la direccion de una nueva carpeta
					if (confirm) {
						swal({
							title: "Nueva dirección",
							content: {
								element: "input",
								attributes: {
									placeholder: "Dirección de la carpeta",
									type: "text"
								},
							},
						})
						.then((direccion) => {
							direccion = this.slashFolder(direccion);
							actualizarCarpeta(dia, id, direccion);
							swal("Dirección cambiada a:", direccion, "success");
						});
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

	async initEditAnime() {
		this._initEditAnimeHTML();
		this._editAnime();
		this._loadEditAnime();
		this._editAnimebtnDelete();
	}

	async _loadEditAnime() {
		let data = await buscarTodoEditar();
		let lista = document.getElementById('edit-anime-list');
		lista.innerHTML = '';
		// console.log(data);
		//
		let i = 0;
		for (const anime of data) {
			var item = document.createElement('a');
			item.href = "#!";
			item.setAttribute('data-value', anime._id);
			item.className = "collection-item blue-text";
			// item.innerHTML = `<a href="#!" data-value="${anime._id}" class="collection-item blue-text"><span class="grey-text badge-left-edit">${++i}</span>${anime.nombre}</a>`;
			item.innerHTML = `<span class="grey-text badge-left-edit">${++i}</span>${anime.nombre}`;
			lista.appendChild(item);
			//
			item.addEventListener('click', (e) => {
				e.preventDefault();
				let id = e.target.getAttribute('data-value');
				this._getAnimeData(id);
			});
		}
		//
		if (data.length > 0) {
			this._getAnimeData(data[0]._id);
		}
	}

	async _getAnimeData(id) {
		let data = await buscarAnimePorId(id);
		let form = document.getElementById('form-edit-anime');
		let nombre = document.getElementById('nombre');
		let dia = document.getElementById('dia');
		let orden = document.getElementById('orden');
		let capVistos = document.getElementById('cap-vistos');
		let totalCap = document.getElementById('total-cap');
		let tipo = document.getElementById('tipo');
		let estado = document.getElementById('estado');
		let pagina = document.getElementById('pagina');
		let carpeta = document.getElementById('carpeta');
		//
		form.setAttribute('data-value', id);
		//
		nombre.value = data.nombre;
		dia.value = data.dia;
		orden.value = data.orden;
		capVistos.value = data.nrocapvisto;
		totalCap.value = data.totalcap;
		tipo.value = data.tipo;
		estado.value = data.estado;
		pagina.value = data.pagina;
		carpeta.value = data.carpeta;
		//
		Materialize.updateTextFields();
		$('select').material_select('destroy');
		$('select').material_select();
	}

	_editAnimebtnDelete() {
		document.getElementById('borrar-anime').addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			//
			let nombreAnime = document.getElementById('nombre').value;
			let id = document.getElementById('form-edit-anime').getAttribute('data-value');
			//
			if (id === null) return;
			//
			let borrar = await swal({
				title: "¿Estás seguro?",
				text: `Estas a punto de borrar "${nombreAnime}". \n\n¡Una vez borrado aún se podra restaurar en historial!`,
				icon: "warning",
				buttons: ["Cancelar", "OK"],
				dangerMode: true,
			});
			if (borrar) {
				await desactivarAnime(id);
				await this._loadEditAnime();
			} else {
				swal("¡Acción cancelada!", "", "info");
			}
		});
	}

	_initEditAnimeHTML() {
		$("select").material_select();
		$("select[required]").css({
			display: 'inline',
			position: 'absolute',
			top: 10,
			padding: 0,
			margin: 0,
			border: 0,
			height: 0,
			width: 0,
			'z-index': -10
		});
		/**
		 * Este addEventListener() es porque la validación del select 
		 * de materialize no funciona, y este es un fix para eso.
		 */
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select.initialized').forEach((select, key) => {
					let label = select.parentNode.nextElementSibling;
					if (select.value === "") {
						let error = label.getAttribute('data-error');
						label.setAttribute('data-value', error);
					} else {
						label.setAttribute('data-value', '');
					}
				});
			});
		});
		/**
		 * Reemplazo para método de materialize para input[type=file].
		 * El setTimeout() es porque materialize ya tiene un método que hace lo mismo
		 * pero que solo devuelve el nombre, y este método se ejecutaba mas rápido.
		 * Es solo para se tarde un poco mas que el de materialize y haga efecto.
		 */
		document.getElementById('carpeta-input').addEventListener('change', (e) => {
			setTimeout(() => {
				if (this.isNoData(e.target) || e.target.files[0] === undefined) return;
				let folder = e.target.files[0].path;
				let path = this.slashFolder(folder);
				document.getElementById('carpeta').value = path;
			}, 1);
		});
	}

	_editAnime() {
		document.getElementById('form-edit-anime').addEventListener('submit', e => {
			e.preventDefault();

			let form = new FormData(e.target);
			let nombre = form.get('nombre').trim();
			let dia = form.get('dia').trim();
			let orden = parseInt(form.get('orden'));
			let capVistos = parseInt(form.get('cap-vistos'));
			let totalCap = parseInt(form.get('total-cap'));
			let tipo = parseInt(form.get('tipo'));
			let estado = parseInt(form.get('estado'));
			let pagina = form.get('pagina').trim();
			let carpeta = form.get('carpeta') === "" ? null : form.get('carpeta').trim();

			//console.log(nombre, dia, orden, capVistos, totalCap, tipo, estado, pagina, carpeta);

			let setValues = {};
			setValues.$set = {};
			setValues.$set.orden = orden;
			setValues.$set.nombre = nombre;
			setValues.$set.dia = dia;
			setValues.$set.nrocapvisto = capVistos;
			setValues.$set.totalcap = totalCap;
			setValues.$set.estado = estado;
			setValues.$set.tipo = tipo;
			setValues.$set.pagina = pagina;
			setValues.$set.carpeta = carpeta;
			
			actualizarAnime(e.target.getAttribute('data-value'), setValues);
		});
	}

	actualizarCapitulo(dia, fila, cont){
		let id = $(fila).parent().parent().parent().find('#key').text()
		actualizarCap(dia, id, cont)
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

	getStateType(tipo) {
		return {
			0 : {
				name : 'TV',
			},
			1 : {
				name : 'Película',
			},
			2 : {
				name : 'Especial',
			},
			3 : {
				name : 'OVA',
			}
		}[tipo];
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
}

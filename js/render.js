'use strict'
const { shell } = require('electron');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');

class Render extends RenderBase {
	constructor(menu) {
		super();
		this.db = new BDAnimes();
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
		consulta.forEach((value, i) => {
			tblListaAnimes += /*html*/ `
			<tr>
				<td>
					<button data-target="modal${i}" class="btn btn-small modal-trigger">${consulta[i].orden}</button>
					<div id="modal${i}" class="modal">
						<div class="modal-footer">
							<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">X</a>
						</div>
						<div class="modal-content">
							<h4>Mensaje de confirmación</h4>
							<p>Escoga uno de los siguientes estados</p>
							<button class="btn btn-small modal-close green btn-estado-cap-viendo" dia="${dia}" id="${consulta[i]._id}"><i class="icon-play"></i> Viendo</button>
							<button class="btn btn-small modal-close btn-estado-cap-fin" dia="${dia}" id="${consulta[i]._id}"><i class="icon-ok-squared"></i> Finalizar</button>
							<button class="btn btn-small modal-close red btn-estado-cap-no-gusto" dia="${dia}" id="${consulta[i]._id}"><i class="icon-emo-unhappy"></i> No me Gusto</button>
						</div>
						<div class="modal-footer">
						</div>
					</div>
				</td>
				<td>${consulta[i].nombre}</td>
				<td><span class="span-cap-vistos" cap="${consulta[i].nrocapvisto}" capTotal="${consulta[i].totalcap}">${this._setNumCapitulo(consulta, i)}</span></td>
				<td>${this._paginaConstructor(consulta[i].pagina)}</td>
				<td>
					<div class="btnIncremento">
					<a class="btn-floating btn waves-effect waves-light btn-anime-minus red ${this._blockSerie(consulta[i].estado) ? 'disabled' : ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}"><i class="icon-minus icon-normal"></i></a>
					<a class="btn-floating btn waves-effect waves-light btn-anime-plus blue ${this._blockSerie(consulta[i].estado) ? 'disabled' : ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}"><i class="icon-plus icon-normal"></i></a>
					</div>
				</td>
				<td>
					<button class="btn btn-small green tooltipped btn-abrir-carpeta ${this.isNoData(consulta[i].carpeta) ? 'disabled' : ''}" carpeta="${this._noApostrophe(consulta[i].carpeta)}" dia="${consulta[i].dia}" id="${consulta[i]._id}" data-position="left" data-tooltip="Abrir carpeta"><span style="display: flex"><i class="icon-folder-open"></i></span></button>
				</td>
				<td class="hidden" id="key">${consulta[i]._id}</td>
			</tr>`
		});
		this._iniciarListaAnimes(tblListaAnimes, dia);
	}

	_iniciarListaAnimes(tblListaAnimes, dia) {
		document.getElementById('contenido').innerHTML = tblListaAnimes;
		document.querySelector('.titulo').innerHTML = this._addDiasAccents(dia);
		document.querySelectorAll('.url-external').forEach((value) => {
			value.addEventListener('click', e => {
			e.preventDefault();
			e.stopPropagation();
				if (!shell.openExternal(value.href)) {
					swal("Hubo problemas al abrir la url.", "Por favor revise el formato de la url en Editar Animes.", "error");
				}
			});
		});
		// Inicializando tooltipes
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
		M.Modal.init(document.querySelectorAll('.modal'));
		// Eventos de mouse para la lista de animes
		document.querySelectorAll('.span-cap-vistos').forEach((value) => {
			value.addEventListener('mouseover', e => {
				let cap = parseFloat(value.getAttribute('cap'));
				let capTotal = parseFloat(value.getAttribute('capTotal'));
				this.numCapituloInvertido(value, cap, capTotal);
			});
			value.addEventListener('mouseout', e => {
				let cap = parseFloat(value.getAttribute('cap'));
				this.numCapituloNormal(value, cap);
			});
		});
		document.querySelectorAll('.btn-anime-minus').forEach((value) => {
			value.addEventListener('click', e => {
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap = cap <= 0.5 ? 0 : cap - 1;
				this.actualizarCapitulo(dia, e.target.parentElement, cap);
			});
			value.addEventListener('mouseup', e => {
			if (e.button === 2) {
				// console.log('Click derecho para minus');
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap = cap <= 0 ? 0 : cap - 0.5;
					this.actualizarCapitulo(dia, e.target.parentElement, cap);
			}
		});
		});
		document.querySelectorAll('.btn-anime-plus').forEach((value) => {
			value.addEventListener('click', e => {
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap += 1;
				this.actualizarCapitulo(dia, e.target.parentElement, cap);
			});
			value.addEventListener('mouseup', e => {
			if (e.button === 2) {
				// console.log('Click derecho para plus');
				let cap = parseFloat(e.target.parentElement.getAttribute('cap'));
				let dia = e.target.parentElement.getAttribute('dia');
				cap += 0.5;
					this.actualizarCapitulo(dia, e.target.parentElement, cap);
			}
		});
		});
		document.querySelectorAll('.btn-estado-cap-viendo').forEach((value) => {
			value.addEventListener('click', async e => {
				this._actualizarEstado(value, 0);
			});
		});
		document.querySelectorAll('.btn-estado-cap-fin').forEach((value) => {
			value.addEventListener('click', async e => {
				this._actualizarEstado(value, 1);
			});
		});
		document.querySelectorAll('.btn-estado-cap-no-gusto').forEach((value) => {
			value.addEventListener('click', async e => {
				this._actualizarEstado(value, 2);
			});
		});
		document.querySelectorAll('.btn-abrir-carpeta').forEach((value) => {
			value.addEventListener('click', async e => {
				let carpeta = value.getAttribute('carpeta');
				let dia = value.getAttribute('dia');
				let id = value.getAttribute('id');
				this.abrirCarpeta(carpeta, dia, id);
			});
		});
	}
		
	async _actualizarEstado(el, estado) {
		let dia = el.getAttribute('dia');
		let id = el.getAttribute('id');
		await this.db.estadoCap(id, estado);
		this._recargarListaAnimes(dia);
		this._buscarMedallas();
	}

	async _recargarListaAnimes(dia) {
		let { datos } = await this.db.buscar(dia);
		this.actualizarLista(datos, dia);
	}

	_noApostrophe(folder) {
		let path = ''
		for (let i in folder) {
			if (folder.charCodeAt(i) === 39) {
				path += '\\\''
				continue
			}
			path += folder[i]
		}		
		return path
	}
	/**
	 * Comprueba que el índice indicado sea un número de 
	 * capítulo válido. En caso de no serlo, se retornara el 
	 * estado correspondiente en string.
	 * @param {any[]} consulta Lista de animes de la base de datos.
	 * @param {number} i Índice a comprobar
	 */
	_setNumCapitulo(consulta, i) {
		return this._blockSerie(consulta[i].estado) ? this.getState(consulta[i].estado).name : consulta[i].nrocapvisto;
	}
	/**
	 * Muestra en el elemento el número de capítulos restantes de un anime.
	 * @param {HTMLElement} el Span donde se muestra el número de capítulos.
	 * @param {number} num Número de capítulos actuales anime
	 * @param {number} total Número total de capítulos del anime.
	 */
	numCapituloInvertido(el, num, total) {
		if (typeof total === "number" && num <= total) {
			num = parseInt(num);
			let capInv = total - num;
			el.innerText = '- ' + capInv;
		}
	}

	numCapituloNormal(el, num) {
		el.innerText = num;
	}

	async menuRender(menu = this.menu) {
		var salidaMenu = '';
		for (const index1 in menu) {
			const value1 = menu[index1];
			salidaMenu += `<li>
			<div class="collapsible-header flex-x-center">${this._firstUpperCase(index1)}</div>`;
			if (value1 != null) {
				salidaMenu += `<div class="collapsible-body no-padding">
				<div class="collection">`;
			}
			for (const index2 in value1) {
				const value2 = value1[index2];
				salidaMenu += `<a `;
				for (const index3 in value2) {
					const value3 = value2[index3];
					salidaMenu += `${index3}="${value3}" `;
				}
				salidaMenu += `><span class="badge"></span>${this._firstUpperCase(index2)} </a>`;
			}
			if (value1 != null) {
				salidaMenu += `</div>
						  </div>`;
			}
			salidaMenu += `</li>`;
		}
		document.getElementById('menu').innerHTML = salidaMenu;
		document.querySelectorAll('.no-link').forEach((value) => {
			value.addEventListener('click', e => {
			e.preventDefault();
			e.stopPropagation();
		})
		});
		document.querySelectorAll('.btn-buscar-animes').forEach((value) => {
			value.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
				//
				let dia = value.getAttribute('id');
				this._recargarListaAnimes(dia);
			});
		});
		// carganddo medallas
		this._buscarMedallas(menu);
	}

	async _buscarMedallas(menu = this.menu) {
		let medallas = await this.db.buscarMedallasDia(menu);
		medallas.forEach((medalla) => {
			let { datos, itemMenu } = medalla;
			if (datos >= 0) {
				let tagDia = document.getElementById('menu').querySelectorAll('a')[itemMenu].querySelector('span');
				let numMedallas = datos == 0 ? '' : datos;
				tagDia.innerText = numMedallas;
			}
		});
	}

	/*------------------------- RENDER DINAMICO ---------------------------------------*/
	increNuevosAnimes() {
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
		$('.tooltipped').tooltip({
			delay: 50
		});
		$('select').material_select();
	}

	crearAnime() {
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
	/**
	 * Abre la carpeta en el explorador de archivos.
	 * En caso de error, se le pedira al usuario que
	 * vuelva a ingresar la dirección de la carpeta.
	 * @param {string} folder Dirección de la carpeta.
	 * @param {string} dia Día seleccionado.
	 * @param {string} id Id del anime.
	 */
	abrirCarpeta(folder, dia, id) {
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
							this.db.actualizarCarpeta(id, direccion).then(res => {
								if (res === 0) {
									M.toast({
										html: 'Houston, tenemos un problema',
										displayLength: 4000
									});
								}
							});
							this._recargarListaAnimes(dia);
							swal("Dirección cambiada a:", direccion, "success");
						});
					} else {
						swal("No hay problema.", "También es posible cambiar la dirección de la carpeta en Editar Animes.", "success")
					}
				});
		}
	}

	getFolder(dir) {
		if (this.isNoData(dir) || dir.files[0] === undefined) return
		let folder = dir.files[0].path
		let path = this.slashFolder(folder)
		//console.log(path)
		$(dir).attr('value', path)
		$(dir).siblings().html('Cargado')
		$(dir).siblings().attr('data-tooltip', path)
		$(dir).siblings().removeClass('blue')
		$(dir).siblings().addClass('green')
		$('.tooltipped').tooltip({
			delay: 50
		})
	}

	slashFolder(folder) {
		let path = ''
		for (let i in folder) {
			if (folder.charCodeAt(i) === 92) {
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
				document.querySelectorAll('select.initialized').forEach((select) => {
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

	async actualizarCapitulo(dia, fila, cont) {
		let id = fila.parentElement.parentElement.parentElement.querySelector('#key').innerText;
		this.db.actualizarCap(id, cont).then(res => {
			if (res === 0) {
				M.toast({
					html: 'Houston, tenemos un problema',
					displayLength: 4000
				});
			}
		});
		this._recargarListaAnimes(dia);
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

exports.Render = Render;
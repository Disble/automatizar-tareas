'use strict'
const path = require('path');
const { shell } = require('electron');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const { Menu, Estados, Tipos } = require('./defaults-config.js');
const settings = require('electron-settings');

class Render extends RenderBase {
	constructor(menu) {
		super();
		this.db = new BDAnimes();
		this.contNewFolder = 0;
		this.menu = menu;
	}
	/*------------------------- RENDER CARGA CON LA PAGINA ---------------------------------------*/
	/**
	 * Inicializa el botón que lanza
	 * el programa que haya configurado
	 * el usuario.
	 */
	initProgramDownloader() {
		let dir = settings.get('downloader.dir');
		let downloader = document.getElementById('icon-downloader');
		if (dir === undefined) {
			downloader.style.display = 'none';
			return;
		}
		downloader.innerHTML = /*html*/`<i class="icon-rocket grey-text text-darken-2 icon-big"></i>`;
		downloader.addEventListener('click', e => {
			let dir = settings.get('downloader.dir');
			if (dir === undefined) {
				swal("No configurado.", "No esta configurado la dirección del programa, por favor hagalo en Opciones.", "error");
				return;
			}
			let program = path.normalize(dir);
			if (shell.openItem(program)) {
				M.toast({
					html: `Abriendo ${path.basename(program, '.exe')}...`,
					displayLength: 4000
				});
			} else {
				swal("Hubo problemas al abrir el programa.", "Por favor revise que la dirección del programa sea correcta en Opciones.", "error");
			}
		});
	}
	/**
	 * Genera una lista con los animes encontrados
	 * de acuerdo al día buscado en la base de datos.
	 * @param {any[]} consulta Lista de animes activos filtrados por día.
	 * @param {string} dia Día del que se esta mostrando los animes.
	 */
	actualizarLista(consulta, dia) {
		let tblListaAnimes = '';
		consulta.forEach((value, i) => {
			tblListaAnimes += /*html*/ `
			<tr>
				<td>
					<button data-target="modal${i}" class="btn btn-small modal-trigger blue">${consulta[i].orden}</button>
					<div id="modal${i}" class="modal">
						<div class="modal-footer">
							<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">X</a>
						</div>
						<div class="modal-content">
							<h4>Estado del arte del anime</h4>
							<p>¿En este momento su estado es...?</p>
							<button class="btn btn-small modal-close green btn-estado-cap-viendo" dia="${dia}" id="${consulta[i]._id}"><i class="icon-play"></i> Viendo</button>
							<button class="btn btn-small modal-close btn-estado-cap-fin" dia="${dia}" id="${consulta[i]._id}"><i class="icon-ok-squared"></i> Finalizar</button>
							<button class="btn btn-small modal-close red btn-estado-cap-no-gusto" dia="${dia}" id="${consulta[i]._id}"><i class="icon-emo-unhappy"></i> No me Gusto</button>
							<button class="btn btn-small modal-close orange btn-estado-cap-en-pausa" dia="${dia}" id="${consulta[i]._id}"><i class="icon-pause"></i> En pausa</button>
						</div>
						<div class="modal-footer">
						</div>
					</div>
				</td>
				<td>${consulta[i].nombre}</td>
				<td><span class="span-cap-vistos" cap="${this._setNumCapitulo(consulta, i)}" capTotal="${consulta[i].totalcap}">${this._setNumCapitulo(consulta, i)}</span></td>
				<td>${this._paginaConstructor(consulta[i].pagina)}</td>
				<td>
					<div class="btnIncremento">
					<a class="btn-floating btn waves-effect waves-light btn-anime-minus red ${this._blockSerie(consulta[i].estado) ? 'disabled' : ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}"><i class="icon-minus icon-normal move-icon-cap"></i></a>
					<a class="btn-floating btn waves-effect waves-light btn-anime-plus blue ${this._blockSerie(consulta[i].estado) ? 'disabled' : ''}" dia="${consulta[i].dia}" cap="${consulta[i].nrocapvisto}"><i class="icon-plus icon-normal move-icon-cap"></i></a>
					</div>
				</td>
				<td>
					<button class="btn btn-small green tooltipped btn-abrir-carpeta ${this.isNoData(consulta[i].carpeta) ? 'disabled' : ''}" carpeta="${consulta[i].carpeta}" dia="${consulta[i].dia}" id="${consulta[i]._id}" data-position="left" data-tooltip="Abrir carpeta"><span style="display: flex"><i class="icon-folder-open"></i></span></button>
				</td>
				<td class="hidden" id="key">${consulta[i]._id}</td>
			</tr>`
		});
		this._iniciarListaAnimes(tblListaAnimes, dia);
	}
	/**
	 * Buscar el nombre del día a mostrar
	 * en la lista de animes.
	 * @param {string} dia Día a buscar.
	 */
	buscarTituloDia(dia) {
		let diaRender = '';
		for (const i in this.menu) {
			const tipo = this.menu[i];
			for (const subtipo in tipo) {
				const atributo = tipo[subtipo];
				if (atributo.id === dia) {
					diaRender = subtipo;
				}
			}
		}
		return diaRender;
	}
	/**
	 * Busca el Id de el día que se esta
	 * mostrando en lista animes.
	 * @param {string} dia Día que se muestra en lista animes.
	 */
	buscarIdDia(dia) {
		let diaRender = '';
		for (const i in this.menu) {
			const tipo = this.menu[i];
			for (const subtipo in tipo) {
				if (subtipo !== dia) continue;
				const atributo = tipo[subtipo];
				return atributo.id;
			}
		}
		return diaRender;
	}
	/**
	 * Carga la lista de animes en la pagina e 
	 * inicializa todos lo eventos referentes a 
	 * esta tabla.
	 * @param {string} tblListaAnimes Tabla con la lista de los animes para el día seleccionado.
	 * @param {string} dia Día seleccionado.
	 */
	_iniciarListaAnimes(tblListaAnimes, dia) {
		document.getElementById('contenido').innerHTML = tblListaAnimes;
		document.querySelector('.titulo').innerHTML = this.addDiasAccents(dia);
		// Inicializando tooltipes
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
		M.Modal.init(document.querySelectorAll('.modal'));
		// Eventos de mouse para la lista de animes
		document.querySelectorAll('.url-external').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				if (!shell.openExternal(value.href)) {
					swal("Hubo problemas al abrir la url.", "Por favor revise el formato de la url en Editar Animes.", "error");
				}
			});
		});
		document.querySelectorAll('.span-cap-vistos').forEach((value) => {
			value.addEventListener('mouseover', e => {
				let cap = parseFloat(value.getAttribute('cap'));
				let capTotal = parseFloat(value.getAttribute('capTotal'));
				this.numCapituloInvertido(value, cap, capTotal);
			});
			value.addEventListener('mouseout', e => {
				let cap = parseFloat(value.getAttribute('cap'));
				if (!isNaN(cap)) {
					this.numCapituloNormal(value, cap);
				}
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
		document.querySelectorAll('.btn-estado-cap-en-pausa').forEach((value) => {
			value.addEventListener('click', async e => {
				this._actualizarEstado(value, 3);
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
	/**
	 * Cambia el estado de un anime y 
	 * recarga la lista de animes.
	 * @param {HTMLElement} el Botón al que se ha hecho clic.
	 * @param {number} estado Estado del anime a guardar.
	 */
	async _actualizarEstado(el, estado) {
		let dia = el.getAttribute('dia');
		let id = el.getAttribute('id');
		await this.db.estadoCap(id, estado);
		let diaId = this.buscarIdDia(dia);
		this._recargarListaAnimes(diaId);
		this._buscarMedallas();
	}
	/**
	 * Carga todos los animes activos correspondientes
	 * al día seleccionado.
	 * @param {string} dia Día a cargar.
	 */
	async _recargarListaAnimes(dia) {
		let { datos } = await this.db.buscar(dia);
		let diaRender = this.buscarTituloDia(dia);
		this.actualizarLista(datos, diaRender);
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
		if (!isNaN(total) && !isNaN(total) && num <= total) {
			num = parseInt(num);
			let capInv = total - num;
			el.innerText = '- ' + capInv;
		}
	}
	/**
	 * Muestra en el elemento el número de capítulos vistos del anime.
	 * @param {HTMLElement} el Span donde se muestra el número de capítulos.
	 * @param {number} num Número de capítulos actuales del anime.
	 */
	numCapituloNormal(el, num) {
		el.innerText = num;
	}
	/**
	 * Lee el objeto del Menu y genera un 
	 * listado desplegable HTML en base al
	 * mismo.
	 * @param {any} menu Objeto con el menu (lista de días).
	 */
	async menuRender(menu = this.menu) {
		var salidaMenu = '';
		for (const index1 in menu) {
			const value1 = menu[index1];
			salidaMenu += `<li>
			<div class="collapsible-header"><h5 class="no-margin">${this.firstUpperCase(index1)}</h5></div>`;
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
				salidaMenu += `><span class="badge"></span>${this.firstUpperCase(index2)} </a>`;
			}
			if (value1 != null) {
				salidaMenu += `</div>
						  </div>`;
			}
			salidaMenu += `</li>`;
		}
		document.getElementById('menu').innerHTML = salidaMenu;
		this.noLink();
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
	/**
	 * Busca los animes que ya no se estan viendo 
	 * y por cada uno día agrega una medalla (badge)
	 * con el número de animes que cumplen la condición.
	 * @param {any} menu Objeto con el menu (lista de días).
	 */
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
	/**
	 * Agrega una nueva fila al formulario
	 * de la página Agregar Animes.
	 */
	increNuevosAnimes() {
		this.contNewFolder++;
		let menuSettings = settings.get('menu', Menu);
		let nuevaConsulta = /*html*/ `<tr id="datos-anime-nuevo">
			<td><input type="number" name="orden" min="1" class="validate" required></td>
			<td><input type="text" name="nombre" class="validate" required></td>
			<td>
				<div class="input-field">
					<select id="dia-${this.contNewFolder}" name="dia" class="validate" required>`;
		for (const tipoDia in menuSettings) {
			const dias = menuSettings[tipoDia];
			let outgroup = document.createElement('optgroup');
			outgroup.label = this.firstUpperCase(tipoDia);
			for (const dia in dias) {
				let opcion = document.createElement('option');
				opcion.value = dias[dia].id;
				opcion.innerText = this.firstUpperCase(dia);
				outgroup.appendChild(opcion);
			}
			nuevaConsulta += outgroup.outerHTML;
		}
		nuevaConsulta +=/*html*/`
					</select>
				</div>
			</td>
			<td><input type="number" name="nrocapvisto" min="0" class="validate" required></td>
			<td><input type="number" name="totalcap" min="0" class="tooltipped validate" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio"></td>
			<td>
				<div class="input-field">
					<select name="tipo" class="validate" required>
						<option value="" disabled selected>Tipo</option>`;
		for (const tipo in Tipos) { // Tipos viene desde el import
			const valor = Tipos[tipo];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = tipo;
			nuevaConsulta += opcion.outerHTML;
		}
		nuevaConsulta +=/*html*/`
					</select>
				</div>
			</td>
			<td><input type="text" name="pagina" class="validate" required></td>
			<td>
				<input type="file" name="carpeta" id="file${this.contNewFolder}" class="inputfile btn-carpeta-buscar" webkitdirectory />
				<label for="file${this.contNewFolder}" class="tooltipped blue" data-position="bottom" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
			</td>
		</tr>`;
		document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.insertAdjacentHTML('beforebegin', nuevaConsulta);
		let filaNueva = document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.previousElementSibling;

		filaNueva.querySelectorAll('.btn-carpeta-buscar').forEach((value) => {
			value.addEventListener('change', e => {
				this.getFolder(value);
			});
		});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		this._fixSelectForm();
		this._fixSelectValidationLine();
	}
	/**
	 * Inicializa el HTML y JavaScript
	 * de la página Agregar Animes
	 */
	initAgregarAnime() {
		let menuSettings = settings.get('menu', Menu);
		let diasSelect = document.getElementById('dia');
		for (const tipoDia in menuSettings) {
			const dias = menuSettings[tipoDia];
			let outgroup = document.createElement('optgroup');
			outgroup.label = this.firstUpperCase(tipoDia);
			for (const dia in dias) {
				let opcion = document.createElement('option');
				opcion.value = dias[dia].id;
				opcion.innerText = this.firstUpperCase(dia);
				outgroup.appendChild(opcion);
			}
			diasSelect.appendChild(outgroup);
		}
		document.getElementById('agregarNuevoAnime').addEventListener('click', e => {
			this.increNuevosAnimes();
		});
		document.getElementById('nuevaListaAnimes').addEventListener('submit', async e => {
			e.preventDefault();
			e.stopPropagation();
			let anime = this.crearAnime();
			let resp = await this.db.crearAnime(anime);
			console.log('resp', resp);

		});
		document.querySelectorAll('#file').forEach((value) => {
			value.addEventListener('change', e => {
				this.getFolder(value);
			});
		});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		this._fixSelectForm();
		this._fixSelectValidationLine();
	}
	/**
	 * Captura todos los campos del formulario
	 * y genera un objeto javascript con ellos.
	 */
	crearAnime() {
		let listaEnviar = [];
		let nuevosAnimes = document.querySelectorAll('tr[id="datos-anime-nuevo"]')
		for (const nuevoAnime of nuevosAnimes) {
			let anime = {};
			let inputs = nuevoAnime.querySelectorAll('input[type]:not(.select-dropdown)');
			let tipo = parseInt(nuevoAnime.querySelector('select[name="tipo"]').value);
			let dia = nuevoAnime.querySelector('select[name="dia"]').value;

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
			anime.dia = dia;
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
		if (!shell.showItemInFolder(path.join(folder, '*'))) {
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
	/**
	 * Inicializa la pagina Editar Animes.
	 */
	async initEditAnime() {
		this._initEditAnimeHTML();
		this._editAnime();
		let data = await this._loadEditAnime();
		if (data.length > 0) {
			this._getAnimeData(data[0]._id);
		}
		this._editAnimebtnDelete();
	}
	/**
	 * Busca todos los animes activos y 
	 * genera una lista HTML ordenada por 
	 * su fecha de creación.
	 * @return {Promise<any[]>} Lista de animes activos ordenados por su fecha de creación del más reciente al más antiguo.
	 */
	async _loadEditAnime() {
		let data = await this.db.buscarTodoEditar();
		let lista = document.getElementById('edit-anime-list');
		lista.innerHTML = '';
		let i = 0;
		for (const anime of data) {
			var item = document.createElement('a');
			item.href = "#!";
			item.setAttribute('data-value', anime._id);
			item.className = "collection-item blue-text";
			item.innerHTML = `<span class="grey-text badge-left-edit">${++i}</span>${anime.nombre}`;
			lista.appendChild(item);
			//
			item.addEventListener('click', (e) => {
				e.preventDefault();
				let id = e.target.getAttribute('data-value');
				this._getAnimeData(id);
			});
		}
		return data;
	}
	/**
	 * Busca y carga los datos de un anime en el
	 * formulario de Editar Animes, además inicializa
	 * los componentes de materialize-css.
	 * @param {string} id Id del anime a buscar.
	 */
	async _getAnimeData(id) {
		let data = await this.db.buscarAnimePorId(id);
		// Cargan los datos en el formulario
		this._loadDataFormEdit(id, data);
		//
		M.updateTextFields();
		document.querySelectorAll('select').forEach((select) => {
			var instance = M.FormSelect.getInstance(select);
			instance.destroy();
			M.FormSelect.init(select);
		});
		// Quita el mensaje de error de los select en caso de estar activos.
		document.querySelectorAll('select').forEach((select) => {
			let label = select.parentNode.nextElementSibling;
			label.setAttribute('data-value', '');
		});
	}
	/**
	 * Carga los datos de un anime en el
	 * formulario de Editar Animes.
	 * @param {string} id Id del formulario.
	 * @param {any} data Datos a cargar en el formulario.
	 */
	_loadDataFormEdit(id, data) {
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
	}
	/**
	 * Inicializa el botón que borra un anime
	 * de la lista de animes activos.
	 */
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
				await this.db.desactivarAnime(id);
				let data = await this._loadEditAnime();
				if (data.length > 0) {
					this._getAnimeData(data[0]._id);
				} else {
					this._loadDataFormEdit(null, {
						nombre: '',
						dia: '',
						orden: '',
						capVistos: '',
						totalCap: '',
						tipo: '',
						estado: '',
						pagina: '',
						carpeta: '',
					});
				}
			} else {
				swal("¡Acción cancelada!", "", "info");
			}
		});
	}
	/**
	 * Inicializa todo los eventos relacionados
	 * al HTML de Editar Animes.
	 */
	_initEditAnimeHTML() {
		let diasSelect = document.getElementById('dia');
		let estadosSelect = document.getElementById('estado');
		let tiposSelect = document.getElementById('tipo');
		let menuSettings = settings.get('menu', Menu);
		for (const tipoDia in menuSettings) {
			const dias = menuSettings[tipoDia];
			let outgroup = document.createElement('optgroup');
			outgroup.label = this.firstUpperCase(tipoDia);
			for (const dia in dias) {
				let opcion = document.createElement('option');
				opcion.value = dias[dia].id;
				opcion.innerText = this.firstUpperCase(dia);
				outgroup.appendChild(opcion);
			}
			diasSelect.appendChild(outgroup);
		}
		for (const estado in Estados) { // Estados viene desde el import
			const valor = Estados[estado];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = estado;
			estadosSelect.appendChild(opcion);
		}
		for (const tipo in Tipos) { // Tipos viene desde el import
			const valor = Tipos[tipo];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = tipo;
			tiposSelect.appendChild(opcion);
		}

		M.FormSelect.init(document.querySelectorAll('select'));
		this._fixSelectValidation();
		/**
		 * Reemplazo para método de materialize para input[type=file].
		 */
		document.getElementById('carpeta-input').addEventListener('change', (e) => {
			setTimeout(() => {
				if (this.isNoData(e.target) || e.target.files[0] === undefined) return;
				let folder = e.target.files[0].path;
				document.getElementById('carpeta').value = path.normalize(folder);
			}, 1);
		});
	}
	/**
	 * Arregla el bug de validación de los select
	 * de Materialize-css.
	 */
	_fixSelectValidation() {
		this._fixSelectForm();
		/**
		 * Este addEventListener() es porque la validación del select
		 * de materialize no funciona, y este es un fix para eso.
		 */
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
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
	}
	/**
	 * Este addEventListener() es porque la validación del select
	 * de materialize no funciona, y este es un fix para eso. Esta 
	 * variación solo muestra una línea roja como indicativo de
	 * error.
	 */
	_fixSelectValidationLine() {
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
					if (select.value === "") {
						select.parentElement.classList.add('error-line');
					} else {
						select.parentElement.classList.remove('error-line');
					}
				});
			});
		});
	}
	/**
	 * Corrigue el error de la validación de los select 
	 * `An invalid form control with name='tipo' is not focusable.`
	 */
	_fixSelectForm() {
		let selects = document.querySelectorAll('select[required]');
		selects.forEach((value, key) => {
			value.style.display = 'inline';
			value.style.position = 'absolute';
			value.style.top = '10px';
			value.style.padding = 0;
			value.style.margin = 0;
			value.style.border = 0;
			value.style.height = 0;
			value.style.width = 0;
			value.style.zIndex = -10;
		});
	}
	/**
	 * Inicializa el evento submit del formulario
	 * de Editar Animes.
	 */
	_editAnime() {
		document.getElementById('form-edit-anime').addEventListener('submit', e => {
			e.preventDefault();
			e.stopPropagation();

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

			this.db.actualizarAnime(e.target.getAttribute('data-value'), setValues)
				.then(res => {
					if (res > 0) {
						M.toast({
							html: 'Datos actualizados correctamente',
							displayLength: 4000
						});
						this._loadEditAnime();
					} else {
						M.toast({
							html: 'Que raro... por algún motivo no podemos hacer la actualización.',
							displayLength: 4000
						});
					}
				});
		});
	}
	/**
	 * Actualiza el número de capítulo de un anime y
	 * recarga la lista de animes.
	 * @param {string} dia Día del que se esta mostrando los animes.
	 * @param {HTMLElement} fila Fila del anime del cual se va cambiar el número de capítulo.
	 * @param {number} cont Número de capítulo a actualizar.
	 */
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
	/**
	 * Retorna el día de la semana actual.
	 * Se basa en la fecha actual del sistema.
	 */
	diaSemana() {
		let diasSemana = new Array("domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado")
		let f = new Date()
		return diasSemana[f.getDay()]
	}
	/**
	 * Comprueba que el string proporcionado sea
	 * una URL o no. Si es una URL entonces 
	 * genera una etiqueta `a` que puede hacer 
	 * redirección externa. Si no es una URL, 
	 * simplemente retorna el mismo string.
	 * @param {string} pagina Pagina del anime.
	 */
	_paginaConstructor(pagina) {
		if (this.isUrl(pagina))
			return this._redirectExternalConstructor(pagina)
		else
			return this.firstUpperCase(pagina)
	}
	/**
	 * Crea una etiqueta `a` con la 
	 * dirección URL proporcionada y la
	 * clase `.url-external`.
	 * @param {string} path Dirección URL.
	 */
	_redirectExternalConstructor(path) {
		let url = document.createElement('a')
		url.href = path
		url.innerText = this.firstUpperCase(url.hostname)
		url.setAttribute('class', 'url-external')
		return url.outerHTML
	}
	/**
	 * Comprueba si un anime debe estar bloqueado 
	 * de acuerdo a su estado.
	 * @param {number} estado Estado del anime.
	 */
	_blockSerie(estado) {
		if (estado == undefined || estado == 0)
			return false
		else if (estado === 1 || estado === 2 || estado === 3)
			return true
	}
}

exports.Render = Render;
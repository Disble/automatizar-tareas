'use strict'
const path = require('path');
const dialog = require('electron').remote.dialog;
const { shell } = require('electron');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
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
	 * @param {any[]} animes Lista de animes activos filtrados por día.
	 * @param {string} dia Día del que se esta mostrando los animes.
	 */
	async actualizarLista(animes, dia) {
		// console.log(await this._reconocerAnimeAntiguo(animes));
		let tblListaAnimes = '';
		for (const i in animes) {
			if (animes.hasOwnProperty(i)) {
				const anime = animes[i];
				tblListaAnimes += /*html*/ `
				<tr>
					<td>
						<button data-target="modal${i}" class="btn btn-small modal-trigger blue">${anime.orden}</button>
						<div id="modal${i}" class="modal">
							<div class="modal-footer">
								<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">X</a>
							</div>
							<div class="modal-content">
								<h4>Estado del arte del anime</h4>
								<p>¿En este momento su estado es...?</p>
								<button class="btn btn-small modal-close green btn-estado-cap-viendo" dia="${dia}" id="${anime._id}"><i class="icon-play"></i> Viendo</button>
								<button class="btn btn-small modal-close btn-estado-cap-fin" dia="${dia}" id="${anime._id}"><i class="icon-ok-squared"></i> Finalizar</button>
								<button class="btn btn-small modal-close red btn-estado-cap-no-gusto" dia="${dia}" id="${anime._id}"><i class="icon-emo-unhappy"></i> No me Gusto</button>
								<button class="btn btn-small modal-close orange btn-estado-cap-en-pausa" dia="${dia}" id="${anime._id}"><i class="icon-pause"></i> En pausa</button>
							</div>
							<div class="modal-footer">
							</div>
						</div>
					</td>
					<td>${anime.nombre}</td>
					<td><span class="span-cap-vistos" cap="${this._setNumCapitulo(animes, i)}" capTotal="${anime.totalcap}">${this._setNumCapitulo(animes, i)}</span></td>
					<td>${this._paginaConstructor(anime.pagina)}</td>
					<td>
						<div class="btnIncremento">
						<a class="btn-floating btn waves-effect waves-light btn-anime-minus red ${this._blockSerie(anime.estado) ? 'disabled' : ''}" dia="${anime.dia}" cap="${anime.nrocapvisto}"><i class="icon-minus icon-normal move-icon-cap"></i></a>
						<a class="btn-floating btn waves-effect waves-light btn-anime-plus blue ${this._blockSerie(anime.estado) ? 'disabled' : ''}" dia="${anime.dia}" cap="${anime.nrocapvisto}"><i class="icon-plus icon-normal move-icon-cap"></i></a>
						</div>
					</td>
					<td>
						<button class="btn btn-small green tooltipped btn-abrir-carpeta ${this.isNoData(anime.carpeta) ? 'disabled' : ''}" carpeta="${anime.carpeta}" dia="${anime.dia}" id="${anime._id}" data-position="left" data-tooltip="Abrir carpeta"><span style="display: flex"><i class="icon-folder-open"></i></span></button>
					</td>
					<td class="hidden" id="key">${anime._id}</td>
				</tr>`;
			}
		}
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
	 * Abre la carpeta en el explorador de archivos.
	 * En caso de error, se le pedira al usuario que
	 * vuelva a ingresar la dirección de la carpeta.
	 * @param {string} folder Dirección de la carpeta.
	 * @param {string} dia Día seleccionado.
	 * @param {string} id Id del anime.
	 */
	async abrirCarpeta(folder, dia, id) {
		if (!shell.showItemInFolder(path.join(folder, '*'))) {
			let confirm = await swal("Hubo problemas al abrir la carpeta.", "Es posible que la dirección haya cambiado o que la carpeta ha sido borrada.\n\n¿Quieres volver a escoger la carpeta?", "info", {
				buttons: ['No', 'Si']
			});
			if (!confirm) {
				await swal("No hay problema.", "También es posible cambiar la dirección de la carpeta en Editar Animes.", "success");
				return;
			}
			let newDir = dialog.showOpenDialog({
				properties: ['openDirectory']
			});
			if (newDir === undefined) {
				await swal("No hay problema.", "También es posible cambiar la dirección de la carpeta en Editar Animes.", "success");
				return;
			}
			this.db.actualizarCarpeta(id, newDir[0]).then(res => {
				if (res === 0) {
					M.toast({
						html: 'Houston, tenemos un problema',
						displayLength: 4000
					});
				}
			});
			this._recargarListaAnimes(dia);
			swal("Dirección cambiada a:", newDir[0], "success");
		}
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
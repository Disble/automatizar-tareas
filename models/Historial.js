'use strict'
const { RenderBase } = require('./RenderBase.js');
const { BDAnimes } = require('./consultas.js');
const { Estados, Tipos } = require('./defaults-config.js');
const { ipcRenderer } = require('electron');
const { Anime } = require('./Anime');

/**
 * Controla todo lo referente a la página Historia y 
 * páginas de estadísticas como: capítulos vistos,
 * capítulos restantes, páginas.
 */
class Historial extends RenderBase {
	/**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
	constructor() {
		super();
		this.db = new BDAnimes();
	}
	/**
	 * Imprime una tabla con los datos de los animes
	 * consultados.
	 * @param {any} consulta Datos de los animes.
	 * @param {number} salto Contador del total de animes consulados.
	 */
	imprimirHistorial(consulta, salto) {
		let tblListaAnimes = '';
		let cont = salto;
		consulta.forEach((value, i) => {
			tblListaAnimes += /*html*/`
			<tr>
				<td>${++cont}</td>
				<td>${consulta[i].nombre}${consulta[i].activo === false ? '<i class="icon-state-trash icon-trash-empty right">' : ''}</td>
				<td>${this.isNoData(consulta[i].nrocapvisto) ? 'No Data' : consulta[i].nrocapvisto}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this._setCalendarDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this.firstUpperCase(this.addDiasAccents(this.getDiaSemana(consulta[i].fechaUltCapVisto)))}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this._setHourDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].estado) ? 'No Data' : `<i class="icon-state-historial ${this.getState(consulta[i].estado).icon} ${this.getState(consulta[i].estado).color}"></i>`}</td>
				<td class="hidden" id="key">${consulta[i]._id}</td>
			</tr>`
		});
		document.getElementById('contenido').innerHTML = tblListaAnimes;
		this._enlaceHistAnime();
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
	}
	/**
	 * Vuelve a cargar los datos del historial con nuevos datos.
	 * @param {number} pagina Número de paginación.
	 * @param {number} opcion Opción para la función `cargarHistorial()`
	 */
	async _cargarHistorial(pagina, opcion) {
		let { datos, salto, totalReg, pag } = await this.db.cargarHistorial(pagina, opcion);
		this.imprimirHistorial(datos, salto);
		this.imprimirPagination(totalReg, pag);
	}
	/**
	 * Imprime la paginación en formato HTML.
	 * También inicializa los eventos respectivos.
	 * @param {number} totalReg Total de registros consultados.
	 * @param {number} actual Pagina actual.
	 */
	imprimirPagination(totalReg, actual) {
		let paginas = document.getElementById('paginas');
		paginas.innerHTML = ''; // es solo para resetar los child
		let todasPag = this._totalPag(totalReg);
		let inicio = this.limitePaginas(todasPag) ? this.limitePaginasInicio(actual, todasPag) : 1;
		let fin = this.limitePaginas(todasPag) ? this.limitePaginasFin(actual, todasPag) : todasPag;
		// li inicio
		let liInicio = document.createElement('li');
		let liInicioA = document.createElement('a');
		liInicio.classList.add('waves-effect');
		if (actual === inicio) liInicio.classList.add('disabled');
		liInicioA.href = '#';
		liInicioA.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (actual !== inicio) {
				this._cargarHistorial(1);
			}
		});
		liInicioA.innerHTML = /*html*/`<i class="icon-pag icon-left-open"></i>`;
		liInicio.appendChild(liInicioA);
		paginas.appendChild(liInicio);
		// li intermedios
		for (let i = inicio; i <= fin; i++) {
			let liInter = document.createElement('li');
			let liInterA = document.createElement('a');
			liInter.classList.add('waves-effect');
			if (actual === i) liInter.classList.add('active');
			liInterA.href = '#';
			liInterA.addEventListener('click', async (e) => {
				e.preventDefault();
				e.stopPropagation();
				this._cargarHistorial(i);
			});
			liInterA.innerHTML = i;
			liInter.appendChild(liInterA);
			paginas.appendChild(liInter);
		}
		// li fin
		let liFin = document.createElement('li');
		let liFinA = document.createElement('a');
		liFin.classList.add('waves-effect');
		if (actual === fin) liFin.classList.add('disabled');
		liFinA.href = '#';
		liFinA.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (actual !== fin) {
				this._cargarHistorial(todasPag);
			}
		});
		liFinA.innerHTML = /*html*/`<i class="icon-pag icon-right-open"></i>`;
		liFin.appendChild(liFinA);
		paginas.appendChild(liFin);
	}
	/**
	 * Cargando datos de selects para el buscador.
	 */
	_cargarSelectsBuscador() {
		let tiposSelect = document.getElementById('tipo-select');
		let estadosSelect = document.getElementById('estado-select');
		for (const tipo in Tipos) {
			let opcion = document.createElement('option');
			opcion.value = Tipos[tipo];
			opcion.innerText = this.firstUpperCase(tipo);
			tiposSelect.appendChild(opcion);
		}
		for (const estado in Estados) {
			const valor = Estados[estado];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = estado;
			estadosSelect.appendChild(opcion);
		}
	}
	/**
	 * Inicializa todos los eventos necesarios para
	 * que funciones el buscador. Entre estos están eventos 
	 * de botón cuando se escribe, autocompletado, modales, 
	 * atajo global `ctr+f`, botón recargar.
	 */
	async configurarBuscador() {
		this._cargarSelectsBuscador();
		let data = await this.db.buscarAutocompleteHistorial();
		document.getElementById('search-history').addEventListener('keyup', (e) => {
			let query = document.getElementById('search-history').value;
			if (query.length > 0) {
				this._buscarAnimes(query, false);
			} else {
				this._recargarHistorial();
			}
		});
		M.Autocomplete.init(document.querySelectorAll('input.autocomplete'), {
			data,
			limit: 5,
			onAutocomplete: val => {
				this._buscarAnimes(val, false);
			}
		});
		// Inicializando el modal con el campo de búsqueda
		M.Modal.init(document.querySelectorAll('.modal'), {
			onOpenEnd() {
				document.getElementById('search-history').focus();
			}
		});
		// Inicializando los selects del buscador.
		M.FormSelect.init(document.querySelectorAll('select'));
		// Configurando que el modal se cierre al aplastar enter
		let searchConfirm = document.getElementById('search-confirm');
		document.getElementById('search-history').addEventListener('keypress', (e) => {
			if (e.keyCode === 13) {
				searchConfirm.click();
			}
		});
		// Botón para recargar el historial
		document.getElementById('reload-history').addEventListener('click', e => {
			this._recargarHistorial();
		});
		// Combinación de Ctrl + f global para activar el buscador
		document.addEventListener('keypress', (e) => {
			if (e.ctrlKey === true && e.keyCode === 6) {
				M.Modal.getInstance(document.getElementById('modal-search')).open();
			}
		});
		this._fitrarOpciones();
	}

	async _buscarAnimes(query, esFiltro, opcionOrden) {
		let datos = await this.db.buscarAutocompleteAnimes(query, esFiltro, opcionOrden);
		this.imprimirHistorial(datos, 0);
		this._ocultarOpciones();
		document.getElementById('div-filter').style.display = 'block';
	}

	_ocultarOpciones() {
		document.getElementById('reload-history').style.display = 'block';
		document.getElementById('paginas').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'true');
	}
	/**
	 * Regresa a los valores por defecto a la 
	 * página y oculta el botón recargar.
	 */
	async _recargarHistorial() {
		this._cargarHistorial(1, 1);
		document.getElementById('reload-history').style.display = 'none';
		document.getElementById('paginas').style.display = 'block';
		document.getElementById('div-filter').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'false');
		document.getElementById('search-history').value = '';
	}

	_fitrarOpciones() {
		document.getElementById('filter-history').addEventListener('click', (e) => {
			let divFilter = document.getElementById('div-filter');
			let show = divFilter.getAttribute('show');

			if (show === 'true') {
				divFilter.style.display = 'none';
				divFilter.setAttribute('show', 'false');
			} else if (show === 'false') {
				divFilter.style.display = 'block';
				divFilter.setAttribute('show', 'true');
			}
		});
		document.getElementById('btn-filter').addEventListener('click', async (e) => {
			let query = document.getElementById('search-history').value;
			// los select estan funcionando mal
			let estados = M.FormSelect.getInstance(document.getElementById('estado-select')).getSelectedValues();
			let tipos = M.FormSelect.getInstance(document.getElementById('tipo-select')).getSelectedValues();
			let orden = this._getSelectedValueFix(M.FormSelect.getInstance(document.getElementById('orden-select')));
			let opcionesFiltro = {};
			let opcionesEstado = [];
			let opcionesTipo = [];
			let opcionOrden = {};

			// console.log('datos: ', query, estados, tipos, orden);

			if (parseInt(orden) === 1) {
				opcionOrden = {
					"nombre": 1
				}
			} else if (parseInt(orden) === 2) {
				opcionOrden = {
					"fechaUltCapVisto": -1
				}
			} else if (parseInt(orden) === 3) {
				opcionOrden = {
					"fechaCreacion": -1
				}
			} else {
				opcionOrden = {
					"fechaUltCapVisto": -1
				}
			}

			if (estados.length === 0 && tipos.length === 0) {
				return this._buscarAnimes(query, true, opcionOrden);
			}

			for (const estado of estados) {
				opcionesEstado.push({
					"estado": parseInt(estado)
				});
			}

			for (const tipo of tipos) {
				opcionesTipo.push({
					"tipo": parseInt(tipo)
				});
			}

			if (opcionesEstado.length > 0 && opcionesTipo.length > 0) {
				opcionesFiltro.$and = [];
				opcionesFiltro.$and.push({ $or: opcionesEstado });
				opcionesFiltro.$and.push({ $or: opcionesTipo });
			} else if (opcionesEstado.length > 0) {
				opcionesFiltro.$or = opcionesEstado;
			} else if (opcionesTipo.length > 0) {
				opcionesFiltro.$or = opcionesTipo;
			}

			// console.log('filtros: ', query, opcionesFiltro, opcionOrden);

			let datos = await this.db.filtrarBuscadorHistorial(query, opcionesFiltro, opcionOrden);
			this.imprimirHistorial(datos, 0);
			this._ocultarOpciones();
		});
	}
	/**
	 * Corrigue el método `getSelectedValues()`
	 * de Materialize-css
	 * que no capturaba bien los datos con un 
	 * select simple.
	 * @param {any} orden Instance de select de Materialize-css
	 */
	_getSelectedValueFix(orden) {
		for (let i = 0; i < orden.$selectOptions.length; i++) {
			const element = orden.$selectOptions[i];
			if (element, orden.$selectOptions[i].selected) {
				return orden.$selectOptions[i].value;
			}
		}
	}

	capitulosVistos(lista) {
		let listFilter = this._filterCapActiveChart(lista)
		this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos vistos')
	}
	/**
	 * Inicializa el chart con el número de capítulos 
	 * vistos, y después carga los datos del anime dentro 
	 * del modal.
	 * @param {any} anime Datos del anime.
	 */
	capitulosVistosUnAnime(anime) {
		let animeFilter = this._filterCapChart(anime);
		this._chartCapVistos(animeFilter, 'bar', 'Capítulos vistos');
	}
	/**
	 * Crea un evento `click` para cada fila de la tabla 
	 * de animes. Cada vez que se haga clic en una fila 
	 * se generara un modal para mostrar los datos del anime.
	 */
	_enlaceHistAnime() {
		document.querySelectorAll('td.hidden').forEach((value, i) => {
			value.parentElement.addEventListener('click', e => {
				let key = value.parentElement.querySelector('#key').innerHTML;
				console.log(ipcRenderer.sendSync('synchronous-message', key)); // envia la clave del anime al main y luego el main carga la vista info.
			});
		});
	}
	/**
	 * Establece los datos del anime en la 
	 * sección de información.
	 * @param {Anime} anime Datos del anime
	 */
	setInfoAnime(anime) {
		console.log('entry point', anime);
		// Cover
		// Para mostrar la imagen en realidad lo único que importa es la dirección del slash.
		let cover = document.getElementById('info-cover');
		if (anime.portada.path === undefined || anime.portada.path === '' || this.isNoData(anime.portada.path)) {
			cover.setAttribute('style', `background-image: url('../../images/Eiffel_tower.svg'); background-size: contain;`);
		} else {
			cover.setAttribute('style', `background-image: url('${anime.portada.path}')`);
		}
		// Info
		document.getElementById('nombre').innerText = anime.nombre === '' ? 'Una típica historia' : anime.nombre;
		document.getElementById('estado').innerText = this.getState(anime.estado).name;
		let numcapvistos = '';
		if (this.isNoData(anime.nrocapvisto) || anime.nrocapvisto === 0) {
			numcapvistos = 'Empieza hoy una nueva aventura';
		} else if (anime.nrocapvisto === 1) {
			numcapvistos = `${anime.nrocapvisto} capítulo visto`;
		} else {
			numcapvistos = `${anime.nrocapvisto} capítulos vistos`;
		}
		document.getElementById('capvistos').innerText = numcapvistos;
		document.getElementById('totalcap').innerText = this.isNoData(anime.totalcap) ? 'No hay datos del total de capítulos' : `${anime.totalcap} capítulos en total`;
		document.getElementById('duracion').innerText = this.isNoData(anime.duracion) ? 'No hay datos de la duración por capítulo' : `${anime.duracion} minutos por capitulo`;
		document.getElementById('tipo').innerText = this.isNoData(anime.tipo) ? 'Desconocido' : this.getStateType(anime.tipo).name;
		document.getElementById('pagina').innerText = this.isNoData(anime.pagina) ? 'Houston, tenemos un problema...' : anime.pagina;
		document.getElementById('carpeta').innerText = this.isNoData(anime.carpeta) ? '¿Todo online?' : anime.carpeta;
		document.getElementById('origen').innerText = this.isNoData(anime.origen) || anime.origen === '' ? 'Todo tiene un origen, incluso un anime' : anime.origen;
		// Estadisticas
		document.getElementById('fechapublicacion').value = this.isNoData(anime.fechaPublicacion) ? 'Desconocido' : this._setFullDate(anime.fechaPublicacion);
		document.getElementById('fechaestreno').value = this.isNoData(anime.fechaEstreno) ? 'Desconocido' : this._setFullDate(anime.fechaEstreno);
		document.getElementById('fechacreacion').value = this.isNoData(anime.fechaCreacion) ? 'Desconocido' : this._setFullDate(anime.fechaCreacion);
		document.getElementById('fechaultcap').value = this.isNoData(anime.fechaUltCapVisto) ? 'Desconocido' : this._setFullDate(anime.fechaUltCapVisto);
		document.getElementById('fechaeliminacion').value = this.isNoData(anime.fechaEliminacion) ? 'Desconocido' : this._setFullDate(anime.fechaEliminacion);
		// Generos
		let chipsGeneros = document.getElementById('chips-generos');
		if (!this.isNoData(anime.generos) && anime.generos.length > 0)
			for (const genero of anime.generos) {
				let chip = document.createElement('div');
				chip.classList.add('chip');
				chip.innerText = genero;
				chipsGeneros.append(chip);
			}
		if (this.isNoData(anime.generos) || anime.generos.length === 0) { // en caso de no haber datos
			chipsGeneros.innerHTML = /*html*/`<h6 class="bold">¿Acción o Terror? ¿Fantasía o Ciencia ficción?</h6>`;
		}
		// Estudios
		if (!this.isNoData(anime.estudios) && anime.estudios.length > 0) {
			let estudiosHTML = '';
			for (const estudio of anime.estudios) {
				estudiosHTML += /*html*/`<h6 class="bold" id="origen">${estudio.estudio} <span class="grey-text">${estudio.url === '' ? '' : '•'}
				${estudio.url}</span></h6>`;
			}
			document.getElementById('estudios').innerHTML = estudiosHTML;
		}
		// Botón Eliminar
		document.querySelector('.btn-eliminar-anime').addEventListener('click', e => {
			this._deleteAnime(anime._id);
		});
		// Botón Restaurar
		if (anime.activo === false) {
			document.getElementById('restaurar-container').classList.remove('hide');
			document.querySelector('.btn-restaurar-anime').addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this._restoreRow(anime._id);
			});
		}
		// Charts
		this.capitulosVistosUnAnime(anime);
		this._setInfoLineaTiempo(anime);
	}
	/**
	 * Establece la línea de tiempo para el anime
	 * dado.
	 * @param {any} anime Datos del anime.
	 */
	_setInfoLineaTiempo(anime) {
		let animeFil = this._filtroLineaTiempo(anime);
		this._chartLineaTiempo(animeFil, 'line', 'Línea de tiempo');
	}
	_restoreRow(id) {
		swal({
			title: "¿Estás seguro?",
			text: "¡Volverá a aparecer en la lista de ver animes!",
			icon: "warning",
			buttons: ["Cancelar", "OK"],
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					this.db.restaurarFila(id).then(async (resolve) => {
						if (resolve > 0) {
							await swal('Exito', 'El anime ya vuelve a estar disponible.', 'success');
							this.recargarPagina();
						} else {
							swal('Error', 'Tuvimos un pequeño problema al restaurar este anime. Tal vez si lo intentas más tarde...', 'error');
						}
					});
				} else {
					swal("¡Acción cancelada!", '', 'info');
				}
			});
	}
	/**
	 * Borra el anime proporcionado. Antes hay una
	 * confirmación por modal, donde se puede cancelar.
	 */
	_deleteAnime(id) {
		swal({
			title: "¿Estás seguro?",
			text: "¡Una vez borrado, no vas a poder recuperarlo!",
			icon: "warning",
			buttons: ["Cancelar", "OK"],
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					this.db.borrarAnime(id).then(async (resolve) => {
						if (resolve > 0) {
							await swal('Exito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
							this.recargarPagina();
						} else {
							swal('Error', 'Tuvimos un pequeño problema al borrar este anime. Tal vez si lo intentas más tarde...', 'error');
						}
					});
				} else {
					swal("¡Acción cancelada!", '', 'info');
				}
			});
	}
	/**
	 * Genera el Chart de la línea de tiempo, dentro de
	 * la sección de información.
	 * @param {any} listaFil Lista de datos filtrada
	 * @param {string} tipo Tipo de Chart
	 * @param {string} title Título del Chart
	 */
	_chartLineaTiempo(listaFil, tipo, title) {
		let ctx = document.getElementById('lineatiempo')
		new Chart(ctx, {
			type: tipo,
			data: {
				labels: this._filterLabelChart(listaFil.labels),
				datasets: [{
					data: listaFil.data,
					backgroundColor: listaFil.backgroundColor,
					borderColor: listaFil.borderColor,
					fill: listaFil.fill
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: title
				},
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							callback: () => '' // esto solo quita los ticks de la izquierda
						}
					}]
				},
				tooltips: {
					callbacks: {
						label: (tooltipItem, data) => {
							let allData = data.datasets[tooltipItem.datasetIndex].data;
							let tooltipData = allData[tooltipItem.index];
							return this.isNoData(tooltipData.x) ? 'Desconocido' : `Fecha: ${this._setCalendarDate(tooltipData.x)}`;
						}
					}
				}
			}
		});
	}

	_chartCapVistos(listFilter, tipo, title) {
		let ctx = document.getElementById('capVistos')
		let capVistos = new Chart(ctx, {
			type: tipo,
			data: {
				labels: this._filterLabelChart(listFilter.nombres),
				datasets: [{
					data: listFilter.nroCap,
					backgroundColor: listFilter.colorTransparente,
					borderColor: listFilter.color,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							min: 0
						}
					}]
				},
				title: {
					display: true,
					text: title
				},
				legend: {
					display: false
				}
			}
		})
	}
	/**
	 * Si el tamaño de un label es mayor a 40,
	 * lo corta para que no deforme la gráfica.
	 * @param {string[]} labels Labels de cada gráfica.
	 */
	_filterLabelChart(labels) {
		let newLabels = [];
		for (const label of labels) {
			if (label.length > 40) {
				newLabels.push(`${label.slice(0, 40).trim()}...`);
			} else {
				newLabels.push(label)
			}
		}
		return newLabels;
	}

	paginasAnimesActivos() {
		this.db.buscarPaginas().then((resolve) => {
			return this._filterPageActiveChart(resolve);
		}).then((resolve) => {
			let template = this._generatorTemplate(resolve.nombres);
			this.menuRender(template);
			this._statisticsPagesSaw(resolve);
			return resolve;
		}).then((resolve) => {
			let instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
			instances[0].open(0);
		});
	}

	async menuRender(menu) {
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
	}

	async numCapRestantes() {
		let capRestantes = await this.db.capRestantes();
		let listFilter = this._filterCapResChart(capRestantes);
		this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos restantes');
	}

	_generatorTemplate(nombres, paginas) {
		let aux = {};
		let template = {};
		for (let key in nombres) {
			let subData = {};
			nombres[key].map((value, index) => {
				subData[value] = {
					'href': '#!',
					'class': 'collection-item no-link blue-text'
				}
				//console.log('subdata:', subData);
			});
			aux[nombres[key]] = subData;
			template[key] = aux[nombres[key]];
		}
		// console.log(template);
		return template;
	}

	_statisticsPagesSaw(listFiltered) {
		let ctx = document.getElementById('pagCapVistos');
		let capVistos = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: listFiltered.paginas,
				datasets: [{
					data: listFiltered.contador,
					backgroundColor: listFiltered.colorTransparente,
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'Páginas'
				},
				legend: {
					display: true
				},
				animation: {
					animateScale: true,
					animateRotate: true
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem, data) {
							let allData = data.datasets[tooltipItem.datasetIndex].data;
							let tooltipLabel = data.labels[tooltipItem.index];
							let tooltipData = allData[tooltipItem.index];
							let total = 0;
							for (let i in allData) {
								total += allData[i];
							}
							let tooltipPercentage = Math.round((tooltipData / total) * 100);
							return `${tooltipLabel} : ${tooltipData} (${tooltipPercentage}%)`;
						}
					}
				}
			}
		});
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{día} de {mes}, {año}`.
	 * @param {Date} date Fecha
	 */
	_setCalendarDate(date) {
		let year = date.getFullYear();
		let month = date.getMonth();
		let day = date.getDate();
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		return `${day} de ${months[month]}, ${year}`;
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{hora}:{minutos}`.
	 * @param {Date} date Fecha
	 */
	_setHourDate(date) {
		let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		return `${hour}:${minutes}`;
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{día} de {mes}, {año} {hora}:{minutos}`.
	 * @param {Date} date Fecha
	 */
	_setFullDate(date) {
		return `${this._setCalendarDate(date)} ${this._setHourDate(date)}`;
	}

	_filterCapActiveChart(list) {
		let nombres = []
		let nroCap = []
		let colorTransparente = []
		let color = []
		list.forEach((value, i) => {
			if (list[i].estado === 0) { // estado 0 significa 'anime viendo'
				let colorRand = this._getColorRandom(0.4)
				let colorT = colorRand.replace('0.4', '1')
				nombres.push(list[i].nombre)
				nroCap.push(list[i].nrocapvisto)
				colorTransparente.push(colorRand)
				color.push(colorT)
			}
		});
		let data = {
			'nombres': nombres,
			'nroCap': nroCap,
			'colorTransparente': colorTransparente,
			'color': color
		}
		return data
	}
	/**
	 * Filtra los datos de un anime, creando una
	 * línea de tiempo.
	 * @param {any} anime Datos del anime.
	 */
	_filtroLineaTiempo(anime) {
		return {
			labels: [
				'Creación',
				'Estreno',
				'Últ Cap Visto',
				'Eliminación',
			],
			data: [
				{
					y: 1,
					x: anime.fechaCreacion
				},
				{
					y: 1,
					x: anime.fechaestreno
				},
				{
					y: 1,
					x: anime.fechaUltCapVisto
				},
				{
					y: 1,
					x: anime.fechaEliminacion
				}
			],
			fill: false,
			backgroundColor: 'rgb(54, 162, 235)',
			borderColor: 'rgb(54, 162, 235)',
		};
	}

	_filterCapChart(anime) {
		let colorRand = this._getColorRandom(0.4)
		let colorT = colorRand.replace('0.4', '1')
		let data = {
			'nombres': [anime.nombre],
			'nroCap': [anime.nrocapvisto],
			'colorTransparente': [colorRand],
			'color': [colorT]
		}
		return data
	}

	_filterCapResChart(list) {
		let nombres = []
		let nroCap = []
		let colorTransparente = []
		let color = []
		list.forEach((value, i) => {
			if (list[i].estado == 0) { // estado 0 significa 'anime viendo'
				let colorRand = this._getColorRandom(0.4)
				let colorT = colorRand.replace('0.4', '1')
				let capRestantes = list[i].totalcap - list[i].nrocapvisto < 0 ? 0 : list[i].totalcap - list[i].nrocapvisto;
				nombres.push(list[i].nombre)
				nroCap.push(capRestantes)
				colorTransparente.push(colorRand)
				color.push(colorT)
			}
		});
		let data = {
			'nombres': nombres,
			'nroCap': nroCap,
			'colorTransparente': colorTransparente,
			'color': color
		}
		return data
	}

	_filterPageActiveChart(data) {
		let pages = [];
		let count = [];
		let nombres = [];
		let contador = [];
		let paginas = [];
		let colorTransparente = [];
		data.map((value, index) => {
			let url = document.createElement('a');
			url.href = value.pagina;
			let hostname = url.hostname === "" ? "otros" : url.hostname;
			pages[hostname] = hostname;
			nombres[hostname] += [',' + value.nombre];
			nombres[hostname] = nombres[hostname].split(',');
			count[hostname] = (count[hostname] || 0) + 1;
		});
		for (let value in nombres) {
			nombres[value] = nombres[value].slice(1, nombres[value].length);
		}

		for (let value in pages) {
			paginas.push(value);
		}
		for (let value in count) {
			contador.push(count[value]);
			let colorRand = this._getColorRandom(0.8);
			colorTransparente.push(colorRand);
		}

		return {
			'paginas': paginas,
			'contador': contador,
			'colorTransparente': colorTransparente,
			'nombres': nombres
		}
	}

	_getColorRandom(transparent) {
		return `rgba(${this._getRandom()}, ${this._getRandom()}, ${this._getRandom()}, ${transparent})`; 0
	}

	_getRandom() {
		return Math.round(Math.random() * 255) - Math.round(Math.random() * 85);
	}
}

exports.Historial = Historial;
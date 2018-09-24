'use strict'
const { RenderBase } = require('./RenderBase.js');
const { BDAnimes } = require('./consultas.js');
class Historial extends RenderBase {

	constructor() {
		super();
		this.db = new BDAnimes();
	}

	imprimirHistorial(consulta, salto) {
		let tblListaAnimes = '';
		let cont = salto;
		consulta.forEach((value, i) => {
			tblListaAnimes += /*html*/`
			<tr>
				<td>${++cont}</td>
				<td>${consulta[i].nombre}${consulta[i].activo === false ? '<i class="icon-trash-empty right">' : ''}</td>
				<td>${this.isNoData(consulta[i].nrocapvisto) ? 'No Data': consulta[i].nrocapvisto}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._setCalendarDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._getDiaSemana(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._setHourDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].estado) ? 'No Data': `<i class="icon-state-historial ${this.getState(consulta[i].estado).icon} ${this.getState(consulta[i].estado).color}"></i>`}</td>
				<td class="hidden" id="key">${consulta[i]._id}</td>
			</tr>`
		});
		document.getElementById('contenido').innerHTML = tblListaAnimes;
		// $('#contenido').html(tblListaAnimes);
		this._enlaceHistAnime();
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
	}
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
				// let { datos, salto, totalReg, pag } = await this.db.cargarHistorial(1);
				// this.imprimirHistorial(datos, salto);
				// this.imprimirPagination(totalReg, pag);
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
				// let { datos, salto, totalReg, pag } = await this.db.cargarHistorial(i);
				// this.imprimirHistorial(datos, salto);
				// this.imprimirPagination(totalReg, pag);
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
				// let { datos, salto, totalReg, pag } = await this.db.cargarHistorial(todasPag);
				// this.imprimirHistorial(datos, salto);
				// this.imprimirPagination(totalReg, pag);
			}
		});
		liFinA.innerHTML = /*html*/`<i class="icon-pag icon-right-open"></i>`;
		liFin.appendChild(liFinA);
		paginas.appendChild(liFin);
	}

	async configurarBuscador() {
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
			limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
			onAutocomplete: val => {
				this._buscarAnimes(val, false);
			}
		});
		// Inizializando el modal con el campo de búsqueda
		M.Modal.init(document.querySelectorAll('.modal'), {
			onOpenEnd() {
				document.getElementById('search-history').focus();
			}
		});
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
			if (e.ctrlKey === true && e.keyCode === 6){ //e.code === "KeyF") {
				$('#modal-search').modal('open');
			}
		});		
		this._fitrarOpciones();
	}

	async _buscarAnimes(query, esFiltro, opcionOrden) {
		let datos = await this.db.buscarAutocompleteAnimes(query, esFiltro, opcionOrden);
		this.imprimirHistorial(datos, 0);
		this._ocultarOpciones();
		document.getElementById('div-filter').style.display = 'block';
		// $('#div-filter').css('display', 'block');
	}

	_ocultarOpciones() {
		document.getElementById('reload-history').style.display = 'block';
		document.getElementById('paginas').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'true');
		// $('#reload-history').css('display', 'block');
		// $('#paginas').css('display', 'none');
		// $('#div-filter').attr('show', 'true');
	}

	async _recargarHistorial() {
		this._cargarHistorial(1, 1);
		document.getElementById('reload-history').style.display = 'none';
		document.getElementById('paginas').style.display = 'block';
		document.getElementById('div-filter').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'false');
		document.getElementById('search-history').value = '';
		// let data = await this.db.cargarHistorial(1, 1);
		// $('#reload-history').css('display', 'none');
		// $('#paginas').css('display', 'block');
		// $('#div-filter').css('display', 'none');
		// $('#div-filter').attr('show', 'false');
		// $('#search-history').val('');
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
					"nombre" : 1
				}
			} else if (parseInt(orden) === 2) {
				opcionOrden = {
					"fechaUltCapVisto" : -1
				}
			} else if (parseInt(orden) === 3) {
				opcionOrden = {
					"fechaCreacion" : -1
				}
			} else {
				opcionOrden = {
					"fechaUltCapVisto" : -1
				}
			}
			
			if (estados.length === 0 && tipos.length === 0) {
				return this._buscarAnimes(query, true, opcionOrden);
			}

			for (const estado of estados) {
				opcionesEstado.push({
					"estado" : parseInt(estado)
				});
			}

			for (const tipo of tipos) {
				opcionesTipo.push({
					"tipo" : parseInt(tipo)
				});
			}

			if (opcionesEstado.length > 0 && opcionesTipo.length > 0){
				opcionesFiltro.$and = [];
				opcionesFiltro.$and.push({$or: opcionesEstado});
				opcionesFiltro.$and.push({$or: opcionesTipo});
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

	capitulosVistos(lista){
		let listFilter = this._filterCapActiveChart(lista)
		this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos Vistos')
	}

	capitulosVistosUnAnime(anime){
		let animeFilter = this._filterCapChart(anime)
		this._chartCapVistos(animeFilter, 'bar', 'Capítulos Vistos')
		this._setHistoriaAnime(anime)
	}

	_enlaceHistAnime() {
		let that = this
		document.querySelectorAll('td.hidden').forEach((value, i) => {
			value.parentElement.addEventListener('click', e => {
				let key = value.parentElement.querySelector('#key').innerHTML;
				this._createModalStats(key);
			});
		});
		/*
		$('td.hidden').each(function (i, item) {
			$(this).parent().click(() => {
				let key = $(this).parent().children('#key').html()
				that._createModalStats(key)
			})
		})
		*/
	}

	_setHistoriaAnime(anime){
		document.getElementById('nombre').innerHTML = anime.nombre;
		document.getElementById('tipo').innerHTML = this.isNoData(anime.tipo) ? 'Desconocido' : this.getStateType(anime.tipo).name;
		document.getElementById('estado').innerHTML = this.getState(anime.estado).name;
		document.getElementById('totalcap').innerHTML = this.isNoData(anime.totalcap) ? 'Desconocido' : anime.totalcap;
		document.getElementById('fechaCreacion').innerHTML = this._setFullDate(anime.fechaCreacion);
		document.getElementById('fechaEliminacion').innerHTML = this.isNoData(anime.fechaEliminacion) ? 'No Eliminado' : this._setFullDate(anime.fechaEliminacion);
		document.getElementById('pagina').innerHTML = anime.pagina;
		document.getElementById('carpeta').innerHTML = this.isNoData(anime.carpeta) ? 'No asignada' : anime.carpeta;
		document.querySelectorAll('.btn-eliminar-anime').forEach((value) => {
			value.querySelectorAll('a').forEach((a) => {
				a.addEventListener('click', e => {
					this._deleteAnime(anime._id);
				});
			});
		});
		if (anime.activo === false) {
			let collection = document.createElement('div');
			let a = document.createElement('a');
			collection.classList.add('collection');
			a.href = '#';
			a.classList.add('collection-item', 'waves-effect', 'waves-light', 'black-text', 'orange', 'center', 'no-link');
			a.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this._restoreRow(anime._id);
			});
			a.innerHTML = /*html*/`Restaurar<i class="icon-attention-alt right"></i>`;
			collection.appendChild(a);
			document.getElementById('restaurar-anime').appendChild(collection);
		}
	}
	_restoreRow(id) {
		swal({
			title: "¿Estás seguro?",
			text: "¡Volvera a aparecer en la lista de ver animes!",
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

	_chartCapVistos(listFilter, tipo, title){
		let ctx = document.getElementById('capVistos')
        let capVistos = new Chart(ctx, {
            type: tipo,
            data: {
                labels: listFilter.nombres,
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
				legend : {
					display: false
				}
            }
        })
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
			<div class="collapsible-header flex-x-center">${this.firstUpperCase(index1)}</div>`;
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
		this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos Restantes');
	}

	_generatorTemplate(nombres, paginas) {
		let aux = {};
		let template = {};
		for (let key in nombres) {
			let subData = {};
			nombres[key].map((value, index) => {
				subData[value] = {
					'href': '#!',
					'class': 'collection-item no-link'
				}
				//console.log('subdata:', subData);
			});
			aux[nombres[key]] = subData;
			template[key] = aux[nombres[key]];
		}
		// console.log(template);
		return template;
	}

	_statisticsPagesSaw(listFiltered){
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
					text: 'Paginas'
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

	async _createModalStats(key) {
		// $('#modalStats').remove()
		let modal = document.getElementById('modalStats');
		if (modal !== null) {
			modal.parentNode.removeChild(modal);
		}
		let modalWindow = document.createElement('div');
		modalWindow.id = 'modalStats';
		let innerModalWindow = /*html*/`
			<button data-target="modalWin" class="btn btn-small modal-trigger hidden"></button>
			<div id="modalWin" class="modal modal-fixed-footer">
				<div class="modal-content">
					<div class="row">
						<div class="col s5">
							<ul class="collapsible popout expandable">
								<li class="active">
									<div class="collapsible-header flex-x-center cyan darken-2">Nombre</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="nombre"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan darken-1">Tipo</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="tipo"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan">Total Capítulos</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="totalcap"></i></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan lighten-1">Estado</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="estado"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan lighten-2">Fecha Creación</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="fechaCreacion"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan lighten-3">Fecha Eliminación</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="fechaEliminacion"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan lighten-4">Página</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="pagina"></a>
										</div>
									</div>
								</li>
								<li class="active">
									<div class="collapsible-header flex-x-center cyan lighten-5">Carpeta</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="carpeta"></a>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="col s7">
							<div class="row">
								<div class="col s12">
									<canvas id="capVistos" height="300"></canvas>
								</div>
								<div class="col s12">
									<div class="container btn-eliminar-anime">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light black-text red center no-link">Eliminar<i class="icon-trash-empty right"></i></a>
										</div>
									</div>
								</div>
								<div class="col s12">
									<div class="container btn-restaurar-anime" id="restaurar-anime">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Cerrar</a>
				</div>
			</div>`;
		modalWindow.innerHTML = innerModalWindow;
		document.querySelector('body').appendChild(modalWindow);
		M.Modal.init(document.querySelectorAll('.modal'));
		M.Collapsible.init(document.querySelectorAll('.collapsible.expandable'), {
			accordion: false
		});
		document.getElementById('modalStats').querySelector('.modal-trigger').click();
		this.noLink();
		let data = await this.db.buscarAnimePorId(key);
		this.capitulosVistosUnAnime(data);
	}

	_setCalendarDate(date){
		let year = date.getFullYear()
		let month = date.getMonth()
		let day = date.getDate()
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
		return `${day} de ${months[month]}, ${year}`
	}

	_setHourDate(date) {
		let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
		let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
		return `${hour}:${minutes}`
	}

	_setFullDate(date){
		return `${this._setCalendarDate(date)} ${this._setHourDate(date)}`
	}

	_getDiaSemana(date){
		let diasSemana = new Array("domingo","lunes","martes","miercoles","jueves","viernes","sabado")
		return diasSemana[date.getDay()]
	}

	_filterCapActiveChart(list){
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
			'nombres' : nombres,
			'nroCap' : nroCap,
			'colorTransparente' : colorTransparente,
			'color' : color
		}
		return data
	}

	_filterCapChart(anime){
		let colorRand = this._getColorRandom(0.4)
		let colorT = colorRand.replace('0.4', '1')
		let data = {
			'nombres' : [anime.nombre],
			'nroCap' : [anime.nrocapvisto],
			'colorTransparente' : [colorRand],
			'color' : [colorT]
		}
		return data
	}

	_filterCapResChart(list){
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
			'nombres' : nombres,
			'nroCap' : nroCap,
			'colorTransparente' : colorTransparente,
			'color' : color
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
			nombres[hostname] += [','+value.nombre];
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
			'paginas' : paginas,
			'contador' : contador,
			'colorTransparente' : colorTransparente,
			'nombres': nombres
		}
	}

	_getColorRandom(transparent) {
		return `rgba(${this._getRandom()}, ${this._getRandom()}, ${this._getRandom()}, ${transparent})`;0
	}

	_getRandom() {
		return Math.round(Math.random() * 255) - Math.round(Math.random() * 85);
	}
}

exports.Historial = Historial;
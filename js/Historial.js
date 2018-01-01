'use strict'

class Historial {

	constructor() {
		this.render = new Render()
	}

	imprimirHistorial(consulta, salto) {
		let tblListaAnimes = ''
		let cont = salto
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td>${++cont}</td>
									<td>${consulta[i].nombre}${consulta[i].activo === false ? '<i class="icon-trash-empty right">' : ''}</td>
									<td>${this.render.isNoData(consulta[i].nrocapvisto) ? 'No Data': consulta[i].nrocapvisto}</td>
									<td>${this.render.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._setCalendarDate(consulta[i].fechaUltCapVisto)}</td>
									<td>${this.render.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._getDiaSemana(consulta[i].fechaUltCapVisto)}</td>
									<td>${this.render.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._setHourDate(consulta[i].fechaUltCapVisto)}</td>
									<td>${this.render.isNoData(consulta[i].estado) ? 'No Data': `<i class="icon-state-historial ${this._getIconState(consulta[i].estado).icon} ${this._getIconState(consulta[i].estado).color}"></i>`}</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
		this._enlaceHistAnime()
	}

	imprimirPagination(totalReg, actual) {
		let todasPag = this.render._totalPag(totalReg)
		let ini = this.render.limitePaginas(todasPag) ? this.render.limitePaginasInicio(actual, todasPag) : 1
		let fin = this.render.limitePaginas(todasPag) ? this.render.limitePaginasFin(actual, todasPag) : todasPag
		let paginas = `<li class="waves-effect ${actual == ini ? 'disabled' : ''}"><a href="#!" ${actual == ini ? '' : 'onclick="cargarHistorial(1);"'}><i class="icon-pag icon-left-open"></i></a></li>`
		for (let i = ini; i <= fin; i++) {
			paginas += `<li class="waves-effect ${actual == i ? 'active' : ''}"><a href="#!" onclick="cargarHistorial(${i});">${i}</a></li>`
		}
		paginas += `<li class="waves-effect ${actual == fin ? 'disabled' : ''}"><a href="#!" ${actual == fin ? 'disabled' : `onclick="cargarHistorial(${todasPag});"`}><i class="icon-pag icon-right-open"></i></a></li>`
		$('#paginas').html(paginas)
		//console.log("total reg :" + totalReg, ', todas pag : ' + todasPag, ', pag actual : ' + actual);
	}

	capitulosVistos(lista){
		let listFilter = this._filterCapActiveChart(lista)
		this._chartCapVistos(listFilter, 'horizontalBar')
	}

	capitulosVistosUnAnime(anime){
		let animeFilter = this._filterCapChart(anime)
		this._chartCapVistos(animeFilter, 'bar')
		this._setHistoriaAnime(anime)
	}

	_enlaceHistAnime() {
		let that = this
		$('.hidden').each(function (i, item) {
			$(this).parent().click(() => {
				let key = $(this).parent().children('#key').html()
				that._createModalStats(key)
			})
		})
	}

	_setHistoriaAnime(anime){
		$('#nombre').html(anime.nombre)
		$('#estado').html(this.render._estadoSerie(anime.estado))
		$('#fechaCreacion').html(this._setFullDate(anime.fechaCreacion))
		$('#fechaEliminacion').html(this.render.isNoData(anime.fechaEliminacion) ? 'No Eliminado' : this._setFullDate(anime.fechaEliminacion))
		$('#pagina').html(anime.pagina)
		let carpeta = $('#carpeta')
		carpeta.html(this.render.isNoData(anime.carpeta) ? 'No asignada' : anime.carpeta)
		carpeta.click(() => {
			this.render.abrirCarpeta(anime.carpeta)
		})
		$('.btn-eliminar-anime').find('a').attr('onclick', `borrarAnime('${anime._id}')`)
		if (anime.activo == false) {
			$('#restaurar-anime').html(`<div class="collection">
					<a href="#" class="collection-item waves-effect waves-light black-text orange center no-link" onclick="restaurarFila('${anime._id}')">Restaurar<i class="icon-attention-alt right"></i></a>
				</div>`)
		}
	}

	_reloadHistorial() {
		window.location.href = `file://${__dirname}/historial.html`
	}

	_chartCapVistos(listFilter, tipo){
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
					text: 'Capítulos Vistos'
				},
				legend : {
					display: false
				}
            }
        })
	}

	_createModalStats(key) {
		$('#modalStats').remove()
		let modalWindow = `
		<div id="modalStats">
			<button data-target="modalWin" class="btn btn-small modal-trigger hidden"></button>
			<div id="modalWin" class="modal modal-fixed-footer">
				<div class="modal-content">
					<div class="row">
						<div class="col s5">
							<ul class="collapsible popout" data-collapsible="expandable">
								<li>
									<div class="collapsible-header flex-center cyan active">Nombre</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="nombre"></a>
										</div>
									</div>
								</li>
								<li>
									<div class="collapsible-header flex-center cyan active">Estado</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="estado"><i class="icon-play left"></i></a>
										</div>
									</div>
								</li>
								<li>
									<div class="collapsible-header flex-center cyan lighten-1 active">Fecha Creación</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="fechaCreacion"></a>
										</div>
									</div>
								</li>
								<li>
									<div class="collapsible-header flex-center cyan lighten-2 active">Fecha Eliminación</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="fechaEliminacion"></a>
										</div>
									</div>
								</li>
								<li>
									<div class="collapsible-header flex-center cyan lighten-3 active">Página</div>
									<div class="collapsible-body no-padding">
										<div class="collection">
											<a href="#" class="collection-item waves-effect waves-light center no-link" id="pagina"></a>
										</div>
									</div>
								</li>
								<li>
									<div class="collapsible-header flex-center cyan lighten-4 active">Carpeta</div>
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
									<canvas id="capVistos" width="400" height="400"></canvas>
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
			</div>
		</div>`
		$('body').append(modalWindow)
		$('.modal').modal()
		$('.collapsible').collapsible()
		$('#modalStats').find('.modal-trigger').click()
		$('.no-link').click(function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
        buscarPorId(key)
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
		$.each(list, (i, item) => {
			if (list[i].estado == 0) {
				let colorRand = this._getColorRandom(0.2)
				let colorT = colorRand.replace('0.2', '1')
				nombres.push(list[i].nombre)
				nroCap.push(list[i].nrocapvisto)
				colorTransparente.push(colorRand)
				color.push(colorT)
			}
		})
		let data = {
			'nombres' : nombres,
			'nroCap' : nroCap,
			'colorTransparente' : colorTransparente,
			'color' : color
		}
		return data
	}

	_filterCapChart(anime){
		let colorRand = this._getColorRandom(0.2)
		let colorT = colorRand.replace('0.2', '1')
		let data = {
			'nombres' : [anime.nombre],
			'nroCap' : [anime.nrocapvisto],
			'colorTransparente' : [colorRand],
			'color' : [colorT]
		}
		return data
	}

	_getColorRandom(transparent) {
		return `rgba(${this._getRandom()}, ${this._getRandom()}, ${this._getRandom()}, ${transparent})`
	}

	_getRandom() {
		return Math.round(Math.random() * 255)
	}

	_getIconState(estado) {
		let allstates = {
			0 : {
				icon : 'icon-play',
				color : 'green-text'
			},
			1 : {
				icon : 'icon-ok-squared',
				color : 'teal-text'
			},
			2 : {
				icon : 'icon-emo-unhappy',
				color : 'red-text'
			}
		}
		return allstates[estado]
	}
}

module.exports = Historial

'use strict'

class Historial {

	constructor() {
		this.render = new Render()
	}

	imprimirHistorial(consulta) {
		let tblListaAnimes = ''
		let cont = 0
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td>${++cont}</td>
									<td>${consulta[i].nombre}</td>
									<td>${this.render.isNoData(consulta[i].nrocapvisto) ? 'No Data': consulta[i].nrocapvisto}</td>
									<td>${this.render.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this._setFullDate(consulta[i].fechaUltCapVisto)}</td>
									<td>${this.render.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data': this.render.diaSemana(consulta[i].fechaUltCapVisto)}</td>
									<td class="hidden" id="key">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
		this._enlaceHistAnime()
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

		$('.hidden').each(function (i, item) {
			$(this).parent().click(() => {
				let key = $(this).parent().children('#key').html()
				//alert('hola usuario ' + $(this).parent().children('#key').html())
			})
		})
	}

	_setHistoriaAnime(anime){
		document.title = 'Historia de ' + anime.nombre
		$('#nombre').html(anime.nombre)
		$('#estado').html(this.render._estadoSerie(anime.estado))
		$('#fechaCreacion').html(this._setFullDate(anime.fechaCreacion))
		$('#fechaEliminacion').html(this.render.isNoData(anime.fechaEliminacion) ? 'No Eliminado' : this._setFullDate(anime.fechaEliminacion))
		$('#pagina').html(anime.pagina)
		let carpeta = $('#carpeta')
		carpeta.html(anime.carpeta)
		carpeta.click(() => {
			this.render.abrirCarpeta(anime.carpeta)
		})
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
        });
	}

	_setFullDate(date){
		let year = date.getFullYear()
		let month = date.getMonth()
		let day = date.getDate()// < 10 ? '0' + date.getDate() : date.getDate()
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
		return `${day} de ${months[month]}, ${year}`
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
		return Math.round(Math.random() * 255);
	}
}

module.exports = Historial

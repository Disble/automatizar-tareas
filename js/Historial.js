'use strict'

class Historial {

	constructor() {
	}

	imprimirHistorial(consulta) {
		let tblListaAnimes = ''
		let cont = 0
		$.each(consulta, (i, item) => {
			tblListaAnimes += `<tr>
									<td>${++cont}</td>
									<td>${consulta[i].nombre}</td>
									<td>${this._isNoData(consulta[i].fechaCreacion) ? 'No Data': this._setDateMonthYear(consulta[i].fechaCreacion)}</td>
									<td class="hidden">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	capitulosVistos(lista){
		let ctx = document.getElementById('capVistos')
		let listFilter = this._filterCapActiveChart(lista)
        let capVistos = new Chart(ctx, {
            type: 'horizontalBar',
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
                            beginAtZero: true
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

	_isNoData(data){
		return data === undefined || data === null
	}

	_setDateMonthYear(date){
		let year = date.getFullYear()
		let month = date.getMonth()
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
		return `${months[month]}, ${year}`
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

	_getColorRandom(transparent) {
		return `rgba(${this._getRandom()}, ${this._getRandom()}, ${this._getRandom()}, ${transparent})`
	}

	_getRandom() {
		return Math.round(Math.random() * 255);
	}
}

module.exports = Historial

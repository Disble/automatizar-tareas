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

	_isNoData(data){
		return data === undefined || data === null
	}

	_setDateMonthYear(date){
		let year = date.getFullYear()
		let month = date.getMonth()
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
		return `${months[month]}, ${year}`
	}
}

module.exports = Historial

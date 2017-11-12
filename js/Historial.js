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
									<td>${consulta[i].nrocapvisto}</td>
									<td>${consulta[i].estado}</td>
									<td>${this._isNoData(consulta[i].fechaCreacion) ? 'No Data': consulta[i].fechaCreacion.getFullYear()}</td>
									<td>${this._isNoData(consulta[i].fechaEliminacion) ? 'No Data': consulta[i].fechaEliminacion.getFullYear()}</td>
									<td class="hidden">${consulta[i]._id}</td>
								</tr>"`
		})
		$('#contenido').html(tblListaAnimes)
	}

	_isNoData(data){
		return data === undefined || data === null
	}
}

module.exports = Historial

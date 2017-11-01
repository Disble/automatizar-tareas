'use strict'

class Historial {
	constructor() {
	}

	imprimirHistorial(consulta) {
		let tblListaAnimes = ''
		let cont = 0
		consulta = this._ordenarListaPorFecha(consulta)
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

	_ordenarListaPorFecha(consulta){
		this._ordenar(consulta, 0, consulta.length)
	}

	_ordenar(vect, ind_izq, ind_der){
        var i, j; /*variables indice del vector*/
        var elem; /*contiene un elemento del vector*/
        i = ind_izq;
        j = ind_der;
        elem = vect[(ind_izq+ind_der)/2].fechaCreacion;
        do{
            while (vect[i].fechaCreacion < elem) /*recorrido del vector hacia la derecha*/
                i++;
            while (elem < vect[j].fechaCreacion) /*recorrido del cvector hacia la izquierda*/
                j--;
            if (i <= j) { /*Intercambiar*/
                var aux; /*Variable auxiliar*/
                aux = vect[i];
                vect[i] = vect[j];
                vect[j] = aux;
                i++;
                j--;
            }
        } while(i <= j);
        if (ind_izq < j) { ordenar(vect, ind_izq, j);} //Llamadas recursivas
        if (i < ind_der) { ordenar(vect, i, ind_der);}
		return vect;
    }
}

module.exports = Historial

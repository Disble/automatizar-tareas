exports.RenderBase = class RenderBase {
    quitaAcentos(str) {
		var res = str.toLowerCase()
		res = res.replace(new RegExp(/[àáâãäå]/g),'a')
		res = res.replace(new RegExp(/[èéêë]/g),'e')
		res = res.replace(new RegExp(/[ìíîï]/g),'i')
		res = res.replace(new RegExp(/ñ/g),'n')
		res = res.replace(new RegExp(/[òóôõö]/g),'o')
		res = res.replace(new RegExp(/[ùúûü]/g),'u')
		return res
	}
	/**
	 * Retorna un objeto con los metadatos del
	 * estado de un anime.
	 * 		- 0: Viendo
	 * 		- 1: Finalizado
	 * 		- 2: No me gusto
	 * @param {number} estado Estado de anime.
	 */
	getState(estado) {
		return {
			0: {
				name: 'Viendo',
				icon: 'icon-play',
				color: 'green-text',
				backgroundColor: 'green'
			},
			1: {
				name: 'Finalizado',
				icon: 'icon-ok-squared',
				color: 'teal-text',
				backgroundColor: 'teal'
			},
			2: {
				name: 'No me gusto',
				icon: 'icon-emo-unhappy',
				color: 'red-text',
				backgroundColor: 'red'
			}
		} [estado]
	}

	getStateType(tipo) {
		return {
			0: {
				name: 'TV',
			},
			1: {
				name: 'Película',
			},
			2: {
				name: 'Especial',
			},
			3: {
				name: 'OVA',
			}
		} [tipo];
	}
}
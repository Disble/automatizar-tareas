exports.RenderBase = class RenderBase {
	constructor() {
		this.initPrototypes();
	}
	initPrototypes() {
		HTMLElement.prototype.removeClass = this.removeClass;
		HTMLElement.prototype.addClass = this.addClass;
	}
	/**
	 * Quita los acentos del string proporcionado.
	 * @param {string} str String a analizar.
	 */
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
	/**
	 * Retorna un objeto con los metadatos del
	 * tipo de anime.
	 * 		- 0: TV
	 * 		- 1: Película
	 * 		- 2: Especial
	 * 		- 3: OVA
	 * @param {number} tipo Tipo de anime.
	 */
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
	/**
	 * Busca los hermanos de un elemento HTML.
	 * @param {HTMLElement} el Elemento HTML.
	 * @return {HTMLElement[]} Hermanos del elemento HTML.
	 */
	siblings(el) {
		return Array.prototype.filter.call(el.parentNode.children, (child) => {
			return child !== el;
		});
	}
	/**
	 * Remueve la clase CSS del elemento HTML.
	 * @param {HTMLElement} el Elemento HTML:
	 * @param {string} className Nombre de la clase.
	 */
	removeClass(el, className) {
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
	/**
	 * Agrega la clase CSS al elemento HTML.
	 * @param {HTMLElement} el Elemento HTML.
	 * @param {string} className Nombre de la clase.
	 */
	addClass(el, className) {
		if (el.classList)
			el.classList.add(className);
		else
			el.className += ' ' + className;
	}
}
exports.RenderBase = class RenderBase {
	constructor() {
		this.initPrototypes();
		this.numReg = 10;
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
		res = res.replace(new RegExp(/[àáâãäå]/g), 'a')
		res = res.replace(new RegExp(/[èéêë]/g), 'e')
		res = res.replace(new RegExp(/[ìíîï]/g), 'i')
		res = res.replace(new RegExp(/ñ/g), 'n')
		res = res.replace(new RegExp(/[òóôõö]/g), 'o')
		res = res.replace(new RegExp(/[ùúûü]/g), 'u')
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
			},
			3: {
				name: 'En pausa',
				icon: 'icon-pause',
				color: 'orange-text',
				backgroundColor: 'orange'
			}
		}[estado]
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
		}[tipo];
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
	/**
	 * Cancela la acción predeterminada de los links
	 * con la clase `.no-link`.
	 * Evitar que se haga una redirección.
	 */
	noLink() {
		document.querySelectorAll('.no-link').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
			})
		});
	}
	/**
	 * Obtiene el día de la semana
	 * de la fecha dada.
	 * @param {Date} date Fecha
	 */
	getDiaSemana(date) {
		let diasSemana = new Array("domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado")
		return diasSemana[date.getDay()]
	}
	/**
	 * Retorna el mismo día de la semana, pero 
	 * agregado los acentos respectivos.
	 * @param {string} dia Día que se muestra de título sobre la lista de animes.
	 */
	addDiasAccents(dia) {
		if (dia === 'sabado')
			return 'sábado'
		else if (dia === 'miercoles')
			return 'miércoles'
		else
			return dia
	}
	/**
	 * Captura la dirección del input
	 * proporcionado y lo guarda en atributos.
	 * Método especifico de para ciertos
	 * inputs tipo file.
	 * @param {any} input 
	 */
	getFolder(input) {
		if (this.isNoData(input) || input.files[0] === undefined) return
		let folder = input.files[0].path
		let path = this.slashFolder(folder)
		input.setAttribute('value', path);

		let label = this.siblings(input)[0];
		label.innerHTML = 'Cargado';
		label.setAttribute('data-tooltip', path);
		label.removeClass(label, 'blue'); // método hecho con prototipos de la clase RenderBase
		label.addClass(label, 'green'); // método hecho con prototipos de la clase RenderBase
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
	}
	/**
	 * Convierte todos los backslash `\` a slash `/`
	 * @param {string} folder Dirección de la carpeta
	 */
	slashFolder(folder) {
		let path = ''
		for (let i in folder) {
			if (folder.charCodeAt(i) === 92) {
				path += '/'
				continue
			}
			path += folder[i]
		}
		return path
	}
	/**
	 * Comprueba que el string sea o no una URL
	 * válida.
	 * @param {string} path Dirección a comprobar.
	 */
	isUrl(path) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(path)
	}
	/**
	 * Comprueba que si parámetro tiene 
	 * datos.
	 * @param {any} data 
	 */
	isNoData(data) {
		return data === undefined || data === null
	}
	/**
	 * Convierte la primera letra a mayúscula.
	 * @param {string} value Cualquier texto
	 */
	firstUpperCase(value) {
		return value.charAt(0).toUpperCase() + value.slice(1)
	}
	/**
	 * Recarga la pagina actual. Funciona siempre y
	 * cuando el link de la pagina no tenga al final
	 *  `#` o `#!`
	 */
	recargarPagina() {
		// Se ve raro pero funciona :v
		window.location.href = window.location.href;
	}
	/**
	 * Calcula el número de paginas posibles,
	 * en base al total de registros proporcionados.
	 * @param {number} totalReg Total de registros consultados.
	 */
	_totalPag(totalReg) {
		return Math.ceil(totalReg / this.numReg)
	}
	/**
	 * Calcula el salto de paginación para la base de datos.
	 * @param {number} pag Pagina a mostrar.
	 * @param {number} totalReg Total de registros consultados.
	 */
	saltoPaginacion(pag, totalReg) {
		return this.numReg * (pag - 1)
	}
	/**
	 * Determina si el número de paginas obtenidas supera
	 * el límite predeterminado.
	 * 10 es el límite de las paginas a mostrar.
	 * @param {number} todasPag Todas las paginas consultadas.
	 * @return {boolean}
	 */
	limitePaginas(todasPag) {
		/**/
		return todasPag > 10
	}
	/**
	 * Calcula el límite de paginas a mostrar.
	 */
	limitePaginasInicio(pagActual, totalPag) {
		let inicio = pagActual - 5
		let passLimitEnd = totalPag - 9
		if (inicio < 2)
			return 1
		else
			return pagActual + 4 > totalPag ? passLimitEnd : inicio
	}
	/**
	 * 
	 */
	limitePaginasFin(pagActual, totalPag) {
		let inicio = pagActual - 5
		let fin = pagActual + 4 > totalPag ? totalPag : pagActual + 4
		if (inicio < 2)
			return 10
		else
			return fin
	}
}
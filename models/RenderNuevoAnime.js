'use strict'
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const { Menu, Tipos } = require('./defaults-config.js');
const settings = require('electron-settings');

/**
 * Clase que se encarga del renderizado de la
 * vista `Agregar Animes`.
 */
class RenderNuevoAnime extends RenderBase {
	constructor() {
		super();
		this.db = new BDAnimes();
		this.contNewFolder = 0;
	}
	/*------------------------- RENDER DINAMICO ---------------------------------------*/
	/**
	 * Agrega una nueva fila al formulario
	 * de la página Agregar Animes.
	 */
	increNuevosAnimes() {
		this.contNewFolder++;
		let menuSettings = settings.get('menu', Menu);
		let nuevaConsulta = /*html*/ `<tr class="datos-anime-nuevo" id="anime-${this.contNewFolder}">
			<td><input type="number" name="orden" min="1" class="validate tooltipped"
				data-position="bottom" data-tooltip="Orden en que se muestran los animes" required></td>
			<td><input type="text" name="nombre" class="validate" required></td>
			<td>
				<div class="input-field">
					<select id="dia-${this.contNewFolder}" name="dia" class="validate" required>`;
		for (const tipoDia in menuSettings) {
			const dias = menuSettings[tipoDia];
			let outgroup = document.createElement('optgroup');
			outgroup.label = this.firstUpperCase(tipoDia);
			for (const dia in dias) {
				let opcion = document.createElement('option');
				opcion.value = dias[dia].id;
				opcion.innerText = this.firstUpperCase(dia);
				outgroup.appendChild(opcion);
			}
			nuevaConsulta += outgroup.outerHTML;
		}
		nuevaConsulta +=/*html*/`
					</select>
				</div>
			</td>
			<td>
				<div class="input-field">
					<select name="tipo" class="validate" required>`;
		for (const tipo in Tipos) { // Tipos viene desde el import
			const valor = Tipos[tipo];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = tipo;
			nuevaConsulta += opcion.outerHTML;
		}
		nuevaConsulta +=/*html*/`
					</select>
				</div>
			</td>
			<td><input type="text" name="pagina" class="validate" required></td>
			<td>
				<input type="file" name="carpeta" id="file${this.contNewFolder}" class="inputfile btn-carpeta-buscar" webkitdirectory />
				<label for="file${this.contNewFolder}" class="tooltipped blue" data-position="bottom" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
			</td>
			<td>
				<a class="modal-trigger icon-big black-text" href="#modal${this.contNewFolder}"><i class="material-icons icon-dot-3 flex flex-x-center"></i></a>
				<div id="modal${this.contNewFolder}" class="modal bottom-sheet">
					<div class="modal-content left-align">
						<h5>Datos opcionales</h5>
						<div class="row">
							<div class="input-field col s6">
								<input value="0" id="nrocapvisto" name="nrocapvisto" type="number" min="0"
									class="validate this-not">
								<label for="nrocapvisto">Número capítulos vistos</label>
							</div>
							<div class="input-field col s6">
								<input type="number" id="totalcap" name="totalcap" min="0" class="tooltipped validate this-not"
									data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio">
								<label for="totalcap">Total de capítulos</label>
							</div>
						</div>
						<h5>
							Remover fila
							<a class="right waves-effect waves-light btn red" id="btn-borrar-fila"><i class="icon-trash-empty material-icons right"></i>Eliminar</a>
						</h5>
						<p>Se removerá esta fila junto con sus datos.</p>
					</div>
				</div>
			</td>
		</tr>`;
		document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.insertAdjacentHTML('beforebegin', nuevaConsulta);
		let filaNueva = document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.previousElementSibling;

		filaNueva.querySelectorAll('.btn-carpeta-buscar').forEach((value) => {
			value.addEventListener('change', e => {
				this.getFolder(value);
			});
		});
		filaNueva.querySelectorAll('#btn-borrar-fila')[0].addEventListener('click', this.eliminarFila(filaNueva))
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Modal.init(document.querySelectorAll('.modal'));
		M.updateTextFields();
		this._fixSelectForm();
		this._fixSelectValidationLine();
	}
	/**
	 * Inicializa el HTML y JavaScript
	 * de la página Agregar Animes
	 */
	initAgregarAnime() {
		let menuSettings = settings.get('menu', Menu);
		let diasSelect = document.getElementById('dia');
		let tiposSelect = document.getElementById('tipo');
		for (const tipoDia in menuSettings) {
			const dias = menuSettings[tipoDia];
			let outgroup = document.createElement('optgroup');
			outgroup.label = this.firstUpperCase(tipoDia);
			for (const dia in dias) {
				let opcion = document.createElement('option');
				opcion.value = dias[dia].id;
				opcion.innerText = this.firstUpperCase(dia);
				outgroup.appendChild(opcion);
			}
			diasSelect.appendChild(outgroup);
		}
		for (const tipo in Tipos) {
			let opcion = document.createElement('option');
			opcion.value = Tipos[tipo];
			opcion.innerText = this.firstUpperCase(tipo);
			tiposSelect.appendChild(opcion);
		}
		document.getElementById('agregarNuevoAnime').addEventListener('click', e => {
			this.increNuevosAnimes();
		});
		document.getElementById('nuevaListaAnimes').addEventListener('submit', async e => {
			e.preventDefault();
			e.stopPropagation();
			let anime = this.crearAnime();
			let resp = await this.db.crearAnime(anime);
			if (resp.length > 0) {
				e.target.reset();
				document.querySelectorAll('tr[id^="anime-"]').forEach((el, index) => {
					if (index !== 0) {
						el.parentNode.removeChild(el);
					}
				});
			}
		});
		document.getElementById('btn-borrar-fila').addEventListener('click', this.eliminarFila(document.getElementById('anime-0')));
		document.querySelectorAll('#file').forEach((value) => {
			value.addEventListener('change', e => {
				this.getFolder(value);
			});
		});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
		this._fixSelectForm();
		this._fixSelectValidationLine();
	}
	/**
	 * Borra la fila actual junto con todos
	 * sus datos.
	 * @param {Event} e Evento del botón
	 * @param {HTMLElement} el Elemento 
	 */
	eliminarFila(el) {
		return async e => {
			let confirm = await swal("¿Estas seguro?", "Se perderan todos los datos ingresados.", "warning", {
				buttons: ['No', 'Si']
			});
			if (!confirm) return;
			el.parentNode.removeChild(el);
			await swal('Exito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
		}
	}
	/**
	 * Captura todos los campos del formulario
	 * y genera un objeto javascript con ellos.
	 */
	crearAnime() {
		let listaEnviar = [];
		let nuevosAnimes = document.querySelectorAll('tr[class*="datos-anime-nuevo"]');
		for (const nuevoAnime of nuevosAnimes) {
			let anime = {};
			let inputs = nuevoAnime.querySelectorAll('input[type]:not(.select-dropdown)');
			let tipo = parseInt(nuevoAnime.querySelector('select[name="tipo"]').value);
			let dia = nuevoAnime.querySelector('select[name="dia"]').value;

			for (const input of inputs) {
				const valor = input.value;
				let llave = input.getAttribute('name');
				if (llave === "orden" || llave === "nrocapvisto" || llave === "totalcap" || llave === "tipo") {
					anime[llave] = parseInt(valor);
				} else if (llave === 'carpeta') {
					anime[llave] = input.getAttribute('value');
				} else {
					anime[llave] = valor.trim();
				}
				// console.log(anime);
			}
			anime.tipo = tipo;
			anime.dia = dia;
			anime.estado = 0;
			anime.activo = true;
			anime.fechaCreacion = new Date();
			anime.nrocapvisto = isNaN(anime.nrocapvisto) ? 0 : anime.nrocapvisto;
			// console.log('Full nuevo anime: ', anime);
			listaEnviar.push(anime);
		}
		// console.log(listaEnviar);
		return listaEnviar;
	}
	/**
	 * Arregla el bug de validación de los select
	 * de Materialize-css.
	 */
	_fixSelectValidation() {
		this._fixSelectForm();
		/**
		 * Este addEventListener() es porque la validación del select
		 * de materialize no funciona, y este es un fix para eso.
		 */
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
					let label = select.parentNode.nextElementSibling;
					if (select.value === "") {
						let error = label.getAttribute('data-error');
						label.setAttribute('data-value', error);
					} else {
						label.setAttribute('data-value', '');
					}
				});
			});
		});
	}
	/**
	 * Este addEventListener() es porque la validación del select
	 * de materialize no funciona, y este es un fix para eso. Esta 
	 * variación solo muestra una línea roja como indicativo de
	 * error.
	 */
	_fixSelectValidationLine() {
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
					if (select.value === "") {
						select.parentElement.classList.add('error-line');
					} else {
						select.parentElement.classList.remove('error-line');
					}
				});
			});
		});
	}
	/**
	 * Corrigue el error de la validación de los select 
	 * `An invalid form control with name='tipo' is not focusable.`
	 */
	_fixSelectForm() {
		let selects = document.querySelectorAll('select[required]');
		selects.forEach((value, key) => {
			value.style.display = 'inline';
			value.style.position = 'absolute';
			value.style.top = '10px';
			value.style.padding = 0;
			value.style.margin = 0;
			value.style.border = 0;
			value.style.height = 0;
			value.style.width = 0;
			value.style.zIndex = -10;
		});
	}
}

exports.RenderNuevoAnime = RenderNuevoAnime;
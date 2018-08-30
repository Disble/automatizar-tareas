const { Anime } = require('./Anime.js');
const { ModelAnime } = require('./ModelAnime.js');

class RenderPendiente {
	constructor() {
		this.model = new ModelPendiente();
		this.modelAnime = new ModelAnime();
	}

	getAllData() {
		this.model.getAllActive()
			.then((resolve) => {
				let data = '';
				resolve.map((value, index) => {
					data += /*html*/`<li id="item-list">
					<div class="collapsible-header">
						<i class="icon-menu left icon-pag btn-sortable"></i>
						<span class="text-icon">${value.nombre}
						<a href="#!" class="secondary-content right">
						<i class="icon-ok-squared grey-text hover-icon-complete js-remove tooltipped" data-position="right" data-tooltip="¡Completar!"></i>
						</a>
						</span>
					</div>
					<div class="collapsible-body">
						<span><b>Detalle</b></span>
						<p>${value.detalle}</p>
						<div class="divider"></div>
						<p><b>Pagina : </b>${this._paginaConstructor(value.pagina)}</p>
						<span class="hidden" id="key">${value._id}</span>
						<div class="divider"></div>
						<a class="modal-trigger" href="#modal${index}"><i class="icon-fork deep-orange-text icon-big hover-icon-complete btn-forking-anime tooltipped disabled" data-position="right" data-tooltip="¡Crear anime a partir de pendiente!"></i></a>
						<!-- Modal Structure -->
						<div id="modal${index}" class="modal modal-fixed-footer">
							<form class="form-form-anime">
							<div class="modal-content">
								<h4 class="center">Crear nuevo Anime</h4>
								
								<div class="row">
									<div class="col s12">
										<div class="input-field">
											<input id="nombre" value="${value.nombre}" type="text" name="nombre" class="validate">
										</div>
										<div class="input-field">
											<select name="dia">
												<option value="" disabled selected>Escoga un día</option>
												<option value="lunes">Lunes</option>
												<option value="martes">Martes</option>
												<option value="miercoles">Miércoles</option>
												<option value="jueves">Jueves</option>
												<option value="viernes">Viernes</option>
												<option value="sabado">Sábado</option>
												<option value="domingo">Domingo</option>
											</select>
										</div>
										<div class="input-field">
											<select name="tipo">
												<option value="" disabled selected>Escoga un tipo de anime</option>
												<option value="0">TV</option>
												<option value="1">Película</option>
												<option value="2">Especial</option>
												<option value="3">OVA</option>
											</select>
										</div>
										<div class="input-field">
										<input type="text" id="pagina" name="pagina" value="${value.pagina}"  class="validate">
										<label for="pagina">Pagina (No obligatorio)</label>
										</div>
										<div class="row">
											<div class="input-field col s4">
												<input type="number" name="orden" id="orden" min="1" class="validate">
												<label for="orden">Orden</label>
											</div>
											<div class="input-field col s4">
												<input type="number" name="totalcap" id="totalcap" min="0" class="validate">
												<label for="totalcap">Total Cap (No obligatorio)</label>
											</div>
											<div class="col s2 push-s1">
												<input type="file" name="carpeta" id="file${index}" class="inputfile" webkitdirectory />
												<label for="file${index}" class="tooltipped blue mt-10" data-position="bottom" data-delay="50" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
											</div>
										</div>
									</div>
								</div>
								
							</div>
							<div class="modal-footer">
								<input type="submit" class="waves-effect btn-flat green-text" value="crear">
								<a href="#!" class="modal-action modal-close waves-effect btn-flat red-text">Cancelar</a>
							</div>
						</form>
						</div>
					</div>
					</li>`;
				});
				return data;
			}).then((resolve) => {
				self = this;
				$('#data-pendientes').html(resolve);
				$('.tooltipped').tooltip({ delay: 50 });
				$('.modal').modal({
					dismissible: true, // Modal can be dismissed by clicking outside of the modal
					opacity: .5, // Opacity of modal background
					inDuration: 300, // Transition in duration
					outDuration: 200, // Transition out duration
					startingTop: '4%', // Starting top style attribute
					endingTop: '10%', // Ending top style attribute
					ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
						self._forkToAnimeOpen(self);
					}// Callback for Modal close
				});
				$('select').material_select();
				this._urlExternal();
				$('.inputfile').change((e) => {
					this._getFolder(e.target);
				});
				this.elementsPen = $('#data-pendientes').find('li#item-list');
			})
			.catch((err) => { return console.log(err.message) });
	}

	_forkToAnimeOpen(self) {
		$('.form-form-anime').submit(function(e) {
			e.preventDefault();
			let form = new FormData(this);
			
			if (form.get('nombre').length === 0 || form.get('dia') === null || form.get('orden').length === 0 || form.get('tipo') === null) {
				swal("¡Opss!", `Necesitamos más datos para crearlo.`, "warning");
				return false;
			}
			
			let container = $(this).parent().parent().parent()[0];
			let nombre = form.get('nombre').trim();
			let dia = form.get('dia').trim();
			let tipo = parseInt(form.get('tipo'));
			let orden = parseInt(form.get('orden'));
			let pagina = form.get('pagina') == "" ? "No Asignada" : form.get('pagina').trim();
			let carpeta = $(e.target).find('input[type=file]')[0].getAttribute('value');
			let totalcap = parseInt(form.get('totalcap'));
			
			let anime = new Anime(orden, nombre, dia, 0, totalcap, tipo, pagina, carpeta, 0, true, new Date(), null, null);
			
			self.modelAnime.new(anime)
				.then((resolve) => {
					swal({
						title: "¡Anime creado!",
						text: "¿Deseas borrar el pendiente?",
						icon: "success",
						buttons: ["NO", "SI"],
						dangerMode: true,
					})
						.then((willDelete) => {
							if (willDelete) {
								self._setOffPendiente(container);
								swal("¡Pendiente borrado!", "", "success")
									.then((value) => {
										// esta dirección toca hacerla relativa a la carpeta /models por el request()
										window.location.href = `file://${__dirname}/../views/pendientes/pendientes.html`;
									});
							} else {
								// esta dirección toca hacerla relativa a la carpeta /models por el request()
								window.location.href = `file://${__dirname}/../views/pendientes/pendientes.html`;
							}
						});
				})
				.catch((err) => { swal("¡Opss!", `Tuvimos problemas creando "${nombre}".\nPor favor vuelva a intentarlo.`, "error"); });
		});
	}

	_setDataPendiente() {
		this.model.getMaxOrder()
			.then((resolve) => {
				let orden = resolve + 1;
				let nombre = $('#nombre').val();
				let pagina = $('#pagina').val();
				let detalles = $('#detalles').val();
				let pendiente = new Pendiente(nombre, detalles, orden, pagina);
				this.model.new(pendiente)
					.then((resolve) => {
						if (resolve) {
							Materialize.toast('Datos Ingresados Correctamente', 4000);
						} else {
							Materialize.toast('Houston, tenemos un problema', 4000);
						}
					})
					.catch((err) => { return console.log(err.message) });
			})
			.catch((err) => { return console.log(err.message) });;
	}

	_setSubmitNew() {
		$('#submitPendiente').submit(() => {
			this._setDataPendiente();
			return false;
		});
	}

	async _setOrderView() {
		let allPenElemModificados = $('#data-pendientes').find('li#item-list');
		let allPendientes = await this._reorderOrderDatabase(allPenElemModificados);
		this._setNewOrder(allPendientes);
	}
	
	async _setOrderEdit() {
		let allPenElemModificados = $('#edit-pen').find('li');
		let allPendientes = await this._reorderOrderDatabase(allPenElemModificados);
		this._setNewOrder(allPendientes);
	}

	async _setNewOrder(allPendientes) {
		for (const i in allPendientes) {
			this.model.update(allPendientes[i]._id, allPendientes[i]);
		}
	}

	async _reorderOrderDatabase(allPenElemModificados) {
		let allPendientes = [];
		let allOrders = [];
		// Aqui estamos recorriendo los elementos originales, antes de moverlos
		for (const elem of this.elementsPen) {
			let key = $(elem).find('#key').html();
			let pendiente = await this.model.getOnce(key); // consegimos los pendiente de la BDD
			allOrders.push(pendiente.orden); // Guardamos todos los orden de los elementos originales
		}

		//let allPenElemModificados = $('#data-pendientes').find('li#item-list'); // Esta es la lista actualizada de los elementos, que ya se movieron

		// Aqui estamos recorriendo los elementos modificados, los que ya movimos
		for (const elem of allPenElemModificados) {
			let key = $(elem).find('#key').html();
			let pendiente = await this.model.getOnce(key); // consegimos los pendiente de la BDD
			allPendientes.push(pendiente); // Guardamos los objetos pendiente de la vista modificada
		}

		/**
		 * Aqui reemplazamos los valores de orden originales
		 * en los nuevos elementos. Asi se mantiene el mismo
		 * orden pero con otros elementos.
		 */
		for (const key in allPendientes) {
			allPendientes[key].orden = allOrders[key];
		}
		
		/**
		 * aqui estamos guardando los elementos modificados 
		 * para que la siguiente iteracion los tome como los originales.
		 */
		this.elementsPen = allPenElemModificados;

		return allPendientes;
	}

	_setOffPendiente(item) {
		let id = $(item).find('#key').html();
		this.model.activeOff(id)
			.then((resolve) => {
				if (resolve) {
					this.elementsPen = $('#data-pendientes').find('li#item-list');
					Materialize.toast('Marcado como completado correctamente', 4000);
				} else {
					Materialize.toast('Houston, tenemos un problema', 4000);
				}
			})
			.catch((err) => { return console.log(err.message) });
	}

	setDragDrop() {
		var self = this;
		var el = document.getElementById('data-pendientes');
		var sortable = Sortable.create(el, {
			handle: '.btn-sortable',
			animation: 150,
			onUpdate: function (evt) {
				self._setOrderView(evt.oldIndex, evt.newIndex);
			},
			filter: '.js-remove',
			onFilter: function (evt) {
				swal({
					title: "¿Estás seguro?",
					text: "¡Si lo marcas como completado, se borrara de esta lista!",
					icon: "info",
					buttons: ["NO", "SI"],
					dangerMode: true,
				})
					.then((willDelete) => {
						if (willDelete) {
							var el = sortable.closest(evt.item);
							el && el.parentNode.removeChild(el);
							// console.log('Justo antes de borrar', evt.item);
							self._setOffPendiente(evt.item);
						} else {
							swal("¡Acción cancelada!", "", "info");
						}
					});
			}
		});
	}

	_setEdit() {
		this.model.getAllActive()
			.then((resolve) => {
				let data = '';
				resolve.map((value, index) => {
					data += `
						<li>
							<div class="row border-bottom mb-0 flex">
								<div class="col s1 border-left border-right flex flex-y-center"><span class="hidden" id="key">${value._id}</span><i class="icon-menu left icon-pag btn-sortable"></i></div>
								<div class="col s3 border-right flex flex-y-center editable-pen mh-small" id="nombre">${value.nombre}</div>
								<div class="col s4 border-right flex flex-y-center editable-pen mh-small" id="detalle">${value.detalle}</div>
								<div class="col s4 border-right flex flex-y-center overflow-a editable-pen mh-small" id="pagina">${value.pagina}</div>
							</div>
						</li> 
					`;
				});
				return data;
			})
			.then((resolve) => {
				document.getElementById('edit-pen').innerHTML = resolve;
				this._setReorderEditPen();
				this._cellEdit();
				this.elementsPen = $('#edit-pen').find('li');
			})
			.catch((err) => { console.log(err.message) });
	}

	_cellEdit(){
		let self = this;
		$('.editable-pen').each(function(key, value) {
			$(value).dblclick(function() {
				$(this).attr('contenteditable', 'true');
				$(this).focus();
			});
			$(value).focusout(function() {
				$(this).removeAttr('contenteditable');
				let nombre = $(this).parent().parent().find('#nombre').text();
				let detalle = $(this).parent().parent().find('#detalle').text();
				let pagina = $(this).parent().parent().find('#pagina').text();
				let key = $(this).parent().parent().find('#key').text();
				let row = [nombre, detalle, pagina];
				self.model
					.getOnce(key)
					.then((resolve) => {
						resolve.nombre = nombre;
						resolve.detalle = detalle;
						resolve.pagina = pagina;
						return resolve;
					})
					.then((resolve) => {
						self.model.update(key, resolve);
					})
					.catch((err) => { return console.log(err.message) });
			});
			$(value).bind('keypress', function(e) {
				if(e.keyCode==13) {
					$(this).trigger('focusout');
				}
			});
		});
	}

	_setReorderEditPen() {
		var self = this;
		var el = document.getElementById('edit-pen');
		var sortable = Sortable.create(el, {
			handle: '.btn-sortable',
			animation: 150,
			onUpdate: function (evt) {
				self._setOrderEdit(evt.oldIndex, evt.newIndex);
			}
		});
	}

	_paginaConstructor(pagina) {
		if (this._isUrl(pagina))
			return this._redirectExternalConstructor(pagina);
		else
			return pagina;
	}

	_isUrl(path) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(path)
	}

	_redirectExternalConstructor(path) {
		let url = document.createElement('a');
		url.href = path;
		url.innerText = url.href;
		url.setAttribute('class', 'url-external');
		return url.outerHTML;
	}

	_urlExternal() {
		$('.url-external').click(function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).each(function (key, value) {
				if (!shell.openExternal(value.href))
					swal("Hubo problemas al abrir la url.", "Por favor revise el formato de la url en Editar Animes.", "error");
			});
		});
	}

	_getFolder(dir){
		if (dir === undefined || dir === null || dir.files[0] === undefined) return;
		let folder = dir.files[0].path;
		let path = this._slashFolder(folder)
		// console.log(path)
		$(dir).attr('value', path)
		$(dir).siblings().html('Cargado')
		$(dir).siblings().attr('data-tooltip', path)
		$(dir).siblings().removeClass('blue')
		$(dir).siblings().addClass('green')
		$('.tooltipped').tooltip({delay: 50})
	}

	_slashFolder(folder){
		let path = ''
		for(let i in folder){
			if (folder.charCodeAt(i) === 92){
				path += '/'
				continue
			}
			path += folder[i]
		}
		return path
	}
}

exports.RenderPendiente = RenderPendiente;
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
					data += /*html*/`<li>
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
											<input type="number" name="orden" id="orden" min="1" class="validate">
											<label for="orden">Orden</label>
										</div>
										<div class="input-field">
											<input id="pagina" name="pagina" value="${value.pagina}" type="text" class="validate">
										</div>
									</div>
								</div>
								
							</div>
							<div class="modal-footer">
								<!-- <a href="#!" >Crear</a> -->
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
			})
			.catch((err) => { return console.log(err.message) });
	}

	_forkToAnimeOpen(self) {
		$('.form-form-anime').submit(function(e) {
			e.preventDefault();
			let form = new FormData(this);
			
			if (form.get('nombre').length === 0 || form.get('dia') === null || form.get('orden').length === 0) {
				swal("¡Opss!", `Necesitamos más datos para crearlo.`, "warning");
				return false;
			}
			
			let container = $(this).parent().parent().parent()[0];
			let nombre = form.get('nombre');
			let dia = form.get('dia');
			let orden = parseInt(form.get('orden'));
			let pagina = form.get('pagina');
			
			let anime = new Anime(orden, nombre, dia, 0, pagina, '', 0, true, new Date(), null, null);
			
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
										window.location.href = `file://${__dirname}/pendientes.html`;
									});
							} else {
								window.location.href = `file://${__dirname}/pendientes.html`;
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

	_setOrderView(oldIndex, newIndex) {
		let keyCurrent = $($('#data-pendientes').find('li')[newIndex]).find('#key').html();
		let keyOld = $($('#data-pendientes').find('li')[oldIndex]).find('#key').html();
		this._setNewOrder(keyCurrent, keyOld);
	}
	
	_setOrderEdit(oldIndex, newIndex) {
		let keyCurrent = $($('#edit-pen').find('li')[newIndex]).find('#key').html();
		let keyOld = $($('#edit-pen').find('li')[oldIndex]).find('#key').html();
		this._setNewOrder(keyCurrent, keyOld);
	}

	_setNewOrder(keyCurrent, keyOld) {
		this.model
			.getOnce(keyCurrent)
			.then((resolve) => {
				let penCurrent = resolve;
				this.model.getOnce(keyOld)
					.then((resolve) => {
						let penOld = resolve;
						let aux = 0;
						aux = penCurrent.orden;
						penCurrent.orden = penOld.orden;
						penOld.orden = aux;
						this.model.update(keyCurrent, penCurrent);
						this.model.update(keyOld, penOld);
					});
			});
	}

	_setOffPendiente(item) {
		let id = $(item).find('#key').html();
		this.model.activeOff(id)
			.then((resolve) => {
				if (resolve) {
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
				console.log(evt.oldIndex, evt.newIndex);
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
							console.log('Justo antes de borrar', evt.item);
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
							<div class="row border-bottom">
								<div class="col s1"><span class="hidden" id="key">${value._id}</span><i class="icon-menu left icon-pag btn-sortable"></i></div>
								<div class="col s3 editable-pen" id="nombre">${value.nombre}</div>
								<div class="col s4 editable-pen ${value.detalle === '' ? 'editable-link-pen': ''}" id="detalle">${value.detalle}</div>
								<div class="col s4 editable-pen ${value.pagina === '' ? 'editable-link-pen': ''}" id="pagina">${value.pagina}</div>
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
}
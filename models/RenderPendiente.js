class RenderPendiente {
	constructor() {
		this.model = new ModelPendiente();
	}

	getAllData() {
		this.model.getAllActive()
			.then((resolve) => {
				let data = '';
				resolve.map((value, index) => {
					data += `<li>
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
					</div>
					</li>`;
				});
				return data;
			}).then((resolve) => {
				$('#data-pendientes').html(resolve);
				$('.tooltipped').tooltip({ delay: 50 });
				this._urlExternal();
			})
			.catch((err) => { return console.log(err.message) });
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
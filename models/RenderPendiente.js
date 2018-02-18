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
            <i class="icon-menu-1 left icon-pag btn-sortable"></i>
            <span class="text-icon">${value.nombre}
            <a href="#!" class="secondary-content right">
              <i class="icon-check hover-icon js-remove tooltipped" data-position="right" data-tooltip="¡Completar!"></i>
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
      $('.tooltipped').tooltip({delay: 50});
      this._urlExternal();
    })
    .catch((err) => { return console.log(err.message) });;
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

  _setNewOrder(oldIndex, newIndex) {
    let keyCurrent = $($('#data-pendientes').find('li')[newIndex]).find('#key').html();
    let keyOld = $($('#data-pendientes').find('li')[oldIndex]).find('#key').html();
    this.model.getOnce(keyCurrent)
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
      onUpdate: function (evt){
        self._setNewOrder(evt.oldIndex, evt.newIndex);
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

  _paginaConstructor(pagina){
		if (this._isUrl(pagina))
			return this._redirectExternalConstructor(pagina);
		else
			return pagina;
	}

	_isUrl(path) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(path)
	}

	_redirectExternalConstructor(path){
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
			$(this).each(function(key, value) {
				if (!shell.openExternal(value.href))
					swal("Hubo problemas al abrir la url.", "Por favor revise el formato de la url en Editar Animes.", "error");
			});
		});
  }
}

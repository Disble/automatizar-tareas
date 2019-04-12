'use strict'
const path = require('path');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const { Menu, Tipos, Estados } = require('./defaults-config.js');
const settings = require('electron-settings');

/**
 * Clase para la sección de `Editar Anime`.
 */
class RenderEditarAnime extends RenderBase {
    /**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
    constructor() {
        super();
        this.db = new BDAnimes();
    }
    /**
	 * Inicializa la pagina Editar Animes.
	 */
    async initEditAnime() {
        this._initEditAnimeHTML();
        this._editAnime();
        let data = await this._loadEditAnime();
        if (data.length > 0) {
            this._getAnimeData(data[0]._id);
        }
        this._editAnimebtnDelete();
    }
    /**
	 * Busca todos los animes activos y 
	 * genera una lista HTML ordenada por 
	 * su fecha de creación.
	 * @return {Promise<any[]>} Lista de animes activos ordenados por su fecha de creación del más reciente al más antiguo.
	 */
    async _loadEditAnime() {
        let data = await this.db.buscarTodoEditar();
        let lista = document.getElementById('edit-anime-list');
        lista.innerHTML = '';
        let i = 0;
        for (const anime of data) {
            var item = document.createElement('a');
            item.href = "#!";
            item.setAttribute('data-value', anime._id);
            item.className = "collection-item blue-text";
            item.innerHTML = `<span class="grey-text badge-left-edit">${++i}</span>${anime.nombre}`;
            lista.appendChild(item);
            //
            item.addEventListener('click', (e) => {
                e.preventDefault();
                let id = e.target.getAttribute('data-value');
                this._getAnimeData(id);
            });
        }
        return data;
    }
	/**
	 * Busca y carga los datos de un anime en el
	 * formulario de Editar Animes, además inicializa
	 * los componentes de materialize-css.
	 * @param {string} id Id del anime a buscar.
	 */
    async _getAnimeData(id) {
        let data = await this.db.buscarAnimePorId(id);
        // Cargan los datos en el formulario
        this._loadDataFormEdit(id, data);
        //
        M.updateTextFields();
        document.querySelectorAll('select').forEach((select) => {
            var instance = M.FormSelect.getInstance(select);
            instance.destroy();
            M.FormSelect.init(select);
        });
        // Quita el mensaje de error de los select en caso de estar activos.
        document.querySelectorAll('select').forEach((select) => {
            let label = select.parentNode.nextElementSibling;
            label.setAttribute('data-value', '');
        });
    }
	/**
	 * Carga los datos de un anime en el
	 * formulario de Editar Animes.
	 * @param {string} id Id del formulario.
	 * @param {any} data Datos a cargar en el formulario.
	 */
    _loadDataFormEdit(id, data) {
        let form = document.getElementById('form-edit-anime');
        let nombre = document.getElementById('nombre');
        let dia = document.getElementById('dia');
        let orden = document.getElementById('orden');
        let capVistos = document.getElementById('cap-vistos');
        let totalCap = document.getElementById('total-cap');
        let tipo = document.getElementById('tipo');
        let estado = document.getElementById('estado');
        let pagina = document.getElementById('pagina');
        let carpeta = document.getElementById('carpeta');
        //
        form.setAttribute('data-value', id);
        //
        nombre.value = data.nombre;
        dia.value = data.dia;
        orden.value = data.orden;
        capVistos.value = data.nrocapvisto;
        totalCap.value = data.totalcap;
        tipo.value = data.tipo;
        estado.value = data.estado;
        pagina.value = data.pagina;
        carpeta.value = data.carpeta;
    }
	/**
	 * Inicializa el botón que borra un anime
	 * de la lista de animes activos.
	 */
    _editAnimebtnDelete() {
        document.getElementById('borrar-anime').addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            //
            let nombreAnime = document.getElementById('nombre').value;
            let id = document.getElementById('form-edit-anime').getAttribute('data-value');
            //
            if (id === null) return;
            //
            let borrar = await swal({
                title: "¿Estás seguro?",
                text: `Estas a punto de borrar "${nombreAnime}". \n\n¡Una vez borrado aún se podra restaurar en historial!`,
                icon: "warning",
                buttons: ["Cancelar", "OK"],
                dangerMode: true,
            });
            if (borrar) {
                await this.db.desactivarAnime(id);
                let data = await this._loadEditAnime();
                if (data.length > 0) {
                    this._getAnimeData(data[0]._id);
                } else {
                    this._loadDataFormEdit(null, {
                        nombre: '',
                        dia: '',
                        orden: '',
                        capVistos: '',
                        totalCap: '',
                        tipo: '',
                        estado: '',
                        pagina: '',
                        carpeta: '',
                    });
                }
            } else {
                swal("¡Acción cancelada!", "", "info");
            }
        });
    }
	/**
	 * Inicializa todo los eventos relacionados
	 * al HTML de Editar Animes.
	 */
    _initEditAnimeHTML() {
        let diasSelect = document.getElementById('dia');
        let estadosSelect = document.getElementById('estado');
        let tiposSelect = document.getElementById('tipo');
        let menuSettings = settings.get('menu', Menu);
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
        for (const estado in Estados) { // Estados viene desde el import
            const valor = Estados[estado];
            let opcion = document.createElement('option');
            opcion.value = valor;
            opcion.innerText = estado;
            estadosSelect.appendChild(opcion);
        }
        for (const tipo in Tipos) { // Tipos viene desde el import
            const valor = Tipos[tipo];
            let opcion = document.createElement('option');
            opcion.value = valor;
            opcion.innerText = tipo;
            tiposSelect.appendChild(opcion);
        }

        M.FormSelect.init(document.querySelectorAll('select'));
        this._fixSelectValidation();
		/**
		 * Reemplazo para método de materialize para input[type=file].
		 */
        document.getElementById('carpeta-input').addEventListener('change', (e) => {
            setTimeout(() => {
                if (this.isNoData(e.target) || e.target.files[0] === undefined) return;
                let folder = e.target.files[0].path;
                document.getElementById('carpeta').value = path.normalize(folder);
            }, 1);
        });
    }
    /**
	 * Inicializa el evento submit del formulario
	 * de Editar Animes.
	 */
    _editAnime() {
        document.getElementById('form-edit-anime').addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();

            let form = new FormData(e.target);
            let nombre = form.get('nombre').trim();
            let dia = form.get('dia').trim();
            let orden = parseInt(form.get('orden'));
            let capVistos = parseInt(form.get('cap-vistos'));
            let totalCap = parseInt(form.get('total-cap'));
            let tipo = parseInt(form.get('tipo'));
            let estado = parseInt(form.get('estado'));
            let pagina = form.get('pagina').trim();
            let carpeta = form.get('carpeta') === "" ? null : form.get('carpeta').trim();

            //console.log(nombre, dia, orden, capVistos, totalCap, tipo, estado, pagina, carpeta);

            let setValues = {};
            setValues.$set = {};
            setValues.$set.orden = orden;
            setValues.$set.nombre = nombre;
            setValues.$set.dia = dia;
            setValues.$set.nrocapvisto = capVistos;
            setValues.$set.totalcap = totalCap;
            setValues.$set.estado = estado;
            setValues.$set.tipo = tipo;
            setValues.$set.pagina = pagina;
            setValues.$set.carpeta = carpeta;

            this.db.actualizarAnime(e.target.getAttribute('data-value'), setValues)
                .then(res => {
                    if (res > 0) {
                        M.toast({
                            html: 'Datos actualizados correctamente',
                            displayLength: 4000
                        });
                        this._loadEditAnime();
                    } else {
                        M.toast({
                            html: 'Que raro... por algún motivo no podemos hacer la actualización.',
                            displayLength: 4000
                        });
                    }
                });
        });
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
}

exports.RenderEditarAnime = RenderEditarAnime;
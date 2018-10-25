const { Menu } = require('../models/defaults-config.js');
const { RenderBase } = require('./RenderBase');
const settings = require('electron-settings');
const path = require('path');

class Opciones extends RenderBase {
    /**
     * Inicializa todas las Opciones.
     */
    initHTML() {
        this._initDias();
        document.getElementById('conf-dias').addEventListener('click', e => {
            this._initDias();
        });
        document.getElementById('conf-downloader').addEventListener('click', e => {
            this._initDownloader();
        });
    }
    /**
     * Inicializa Días.
     */
    _initDias() {
        this._cargarDias();
        this.noLink();
        this._initLoaderDias();
    }
    /**
     * Cargar los componentes HTML de las
     * opciones Días.
     */
    _cargarDias() {
        document.getElementById('conf-title').innerText = 'Días';
        let menu = settings.get('menu', Menu);
        let datos = document.getElementById('datos');
        let items = '';
        let clases = [];
        for (const grupo in menu) {
            if (menu.hasOwnProperty(grupo)) {
                const subGrupo = menu[grupo];
                items += /*html*/ `
                <div class="col s12">
                    <h5>${this.firstUpperCase(grupo)}</h5>
                </div>
                <div class="col s12 inputs-dias" id="tipo-${grupo}">
                </div>
                `;
                let clase = {
                    clase: grupo,
                    data: []
                };
                for (const item in subGrupo) {
                    clase.data.push({
                        clave: item,
                        valor: subGrupo[item].id
                    });
                }
                clases.push(clase);
            }
        }
        items += /*html*/`
        <div class="col s12 center mb-20">
            <button class="btn green waves-effect waves-light block" id="submit-dias" type="submit" name="action">
                Guardar cambios
                <i class="material-icons right icon-pencil"></i>
            </button>
        </div>
        `;
        datos.innerHTML = items;
        for (const clase of clases) {
            let tipo = document.getElementById(`tipo-${clase.clase}`);
            let inputs = '';
            for (const data of clase.data) {
                inputs += /*html*/`
                <div class="row">
                    <div class="input-field col s5">
                        <input placeholder="Clave" value="${data.clave}" id="clave" type="text" class="validate">
                        <label for="clave">Clave</label>
                    </div>
                    <div class="input-field col s5">
                        <input placeholder="Valor" value="${data.valor}" id="valor" type="text" readonly>
                        <label for="valor">Valor</label>
                    </div>
                    <div class="col s2">
                        <a id="btn-delete" class="waves-effect waves-light red btn btn-small mt-20"><i class="icon-trash-empty"></i></a>
                    </div>
                </div>
                `;
            }
            inputs += /*html*/`
                <div class="barra-sumar mb-20">
                    <hr>
                    <div class="triangle"></div>
                    <a id="btn-add" class="right btn-floating btn blue">+</a>
                </div>
            `;
            tipo.innerHTML = inputs;
        }
        let dangerZone = /*html*/`
        <div class="col s12">
            <div class="divider"></div>
        </div>
        <div class="col s12">
            <h5>Zona de peligro</h5>
        </div>
        <div class="col s12 danger-border">
            <h5>
                Restablecer
                <a class="right waves-effect waves-light btn orange" id="btn-restore"><i class="icon-ccw material-icons right"></i>Restablecer</a>
            </h5>
            <p class="paragraph-btn-right">Se restablece a los valores por defecto.</p>
        </div>
        `;
        datos.insertAdjacentHTML('afterend', dangerZone);
        // Cargando modulos de materialize-css
        M.updateTextFields();
    }
    /**
     * Inicializa los componentes de las opciones 
     * de Días.
     */
    _initLoaderDias() {
        document.querySelectorAll('#btn-delete').forEach((value, key) => {
            value.addEventListener('click', async (e) => {
                let borrar = await swal({
                    title: "¿Estás seguro?",
                    text: `Una vez eliminado no podrás recuperarlo.`,
                    icon: "warning",
                    buttons: ["Cancelar", "OK"],
                    dangerMode: true,
                });
                if (borrar) {
                    let fila = value.parentElement.parentElement;
                    fila.parentNode.removeChild(fila);
                } else {
                    swal("No hay problema.", "", "success")                   
                }
            });
        });
        document.querySelectorAll('#btn-add').forEach((value, key) => {
            value.addEventListener('click', e => {
                let nuevaFila = /*html*/`
                <div class="row">
                    <div class="input-field col s5">
                        <input placeholder="Clave" id="clave" type="text" class="validate">
                        <label for="clave">Clave</label>
                    </div>
                    <div class="input-field col s5">
                        <input placeholder="Valor" id="valor" type="text" class="validate">
                        <label for="valor">Valor</label>
                    </div>
                    <div class="col s2">
                        <a id="btn-delete" class="waves-effect waves-light red btn btn-small mt-20"><i class="icon-trash-empty"></i></a>
                    </div>
                </div>
                `;
                value.parentElement.insertAdjacentHTML('beforebegin', nuevaFila);
                // Cargando modulos de materialize-css
                M.updateTextFields();
                // Inicializando último btn-delete
                let allBtnDelete = value.parentElement.parentElement.querySelectorAll('#btn-delete');
                let ultBtnDelete = allBtnDelete[allBtnDelete.length-1];
                ultBtnDelete.addEventListener('click', async (e) => {
                    let borrar = await swal({
                        title: "¿Estás seguro?",
                        text: `Una vez eliminado no podrás recuperarlo.`,
                        icon: "warning",
                        buttons: ["Cancelar", "OK"],
                        dangerMode: true,
                    });
                    if (borrar) {
                        let fila = ultBtnDelete.parentElement.parentElement;
                        fila.parentNode.removeChild(fila);
                    } else {
                        swal("No hay problema.", "", "success")                   
                    }
                })
            });
        });
        let menu = {};
        let submitDias = document.getElementById('submit-dias');
        submitDias.addEventListener('click', e => {
            let datos = submitDias.parentElement.parentElement;
            let filasTipo = datos.querySelectorAll('.inputs-dias');
            for (const filaTipo of filasTipo) {
                let tipo = filaTipo.getAttribute('id').split('tipo-')[1]
                menu[tipo] = {};
                let filas = filaTipo.querySelectorAll('.row');
                for (const fila of filas) {
                    let inputClave = fila.querySelector('input[type]#clave');
                    let inputValor = fila.querySelector('input[type]#valor');
                    menu[tipo][inputClave.value] = {
                        "href": "#!",
                        "id": inputValor.value,
                        "class": "collection-item no-link btn-buscar-animes"
                    }
                }
            }
            settings.set('menu', menu);
            swal("Exito.", `Los días del menu se han actualizado correctamente.`, "success");
        });
        document.getElementById('btn-restore').addEventListener('click', async (e) => {
            let borrar = await swal({
                title: "¿Estás seguro?",
                text: `Se perderan todos los cambios que has realizado.`,
                icon: "warning",
                buttons: ["Cancelar", "OK"],
                dangerMode: true,
            });
            if (borrar) {
                settings.delete('menu');
                this.resetConfData();
                this._initDias();
                swal('Exito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
            } else {
                swal("No hay problema.", "", "success");
            }
        });
    }
    /**
     * Inicializa Gestor de descargas.
     */
    _initDownloader() {
        this._cargarDownloader();
        this.noLink();
        this._initLoaderDownloader();
    }
    /**
     * Cargar los componentes HTML de las
     * opciones Gestor de descargas.
     */
    _cargarDownloader() {
        this.resetConfData();
        document.getElementById('conf-title').innerText = 'Gestor de descargas';
        let datos = document.getElementById('datos');
        let inputsDownloader = /*html*/`
        <div class="file-field input-field">
            <div class="btn btn-small blue">
                <span>Programa</span>
                <input type="file" id="program-file">
            </div>
            <div class="file-path-wrapper">
                <input class="file-path validate" name="programa" type="text" id="programa">
            </div>
        </div>`;
        inputsDownloader += /*html*/`<div class="center mb-20">
            <button class="btn green waves-effect waves-light" id="submit-downloader">
                Guardar cambios
                <i class="material-icons right icon-pencil"></i>
            </button>
        </div>
        <div class="col s12">
            <div class="divider"></div>
        </div>
        <div class="col s12">
            <h5>Zona de peligro</h5>
        </div>
        <div class="col s12 danger-border">
            <h5>
                Restablecer
                <a class="right waves-effect waves-light btn orange" id="btn-restore"><i class="icon-ccw material-icons right"></i>Restablecer</a>
            </h5>
            <p class="paragraph-btn-right">Se restablece a los valores por defecto.</p>
            
        </div>
        `;
        datos.innerHTML = inputsDownloader;
        if (settings.has('downloader')) {
            document.getElementById('programa').value = settings.get('downloader.dir');
        }
    }
    /**
     * Inicializa los componentes de las opciones 
     * de Gestor de descargas.
     */
    _initLoaderDownloader() {
        document.getElementById('btn-restore').addEventListener('click', async (e) => {
            let borrar = await swal({
                title: "¿Estás seguro?",
                text: `Se perderan todos los cambios que has realizado.`,
                icon: "warning",
                buttons: ["Cancelar", "OK"],
                dangerMode: true,
            });
            if (borrar) {
                settings.delete('downloader');
                document.getElementById('programa').value = '';
                swal('Exito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
            } else {
                swal("No hay problema.", "", "success");
            }
        });
        document.getElementById('submit-downloader').addEventListener('click', e => {
            let dirProgram = document.getElementById('programa').value;
            if (dirProgram === '') return;
            settings.set('downloader', {
                dir: dirProgram
            });
            swal("Exito.", `La configuración de ${path.basename(dirProgram, '.exe')} se ha guardado correctamente.`, "success");
        });
        /**
		 * Reemplazo para método de materialize para input[type=file].
		 */
		document.getElementById('program-file').addEventListener('change', (e) => {
			setTimeout(() => {
				if (this.isNoData(e.target) || e.target.files[0] === undefined) return;
				let folder = e.target.files[0].path;
				document.getElementById('programa').value = path.normalize(folder);
			}, 1);
		});
    }
    /**
     * Reinicia al estado por defecto del
     * div#conf-data.
     */
    resetConfData() {
        document.getElementById('conf-data').innerHTML = /*html*/`
        <div class="col s12">
            <h5 id="conf-title"></h5>
        </div>
        <div class="col s12" id="datos">
        </div>
        `;
    }
}

exports.Opciones = Opciones;
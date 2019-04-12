const { Menu } = require('../models/defaults-config.js');
const { RenderBase } = require('./RenderBase');
const { Backup } = require('./Backup');
const settings = require('electron-settings');
const path = require('path');
const isDev = require('electron-is-dev');


/**
 * Clase encargada de cualquier función de `Opciones`.
 */
class Opciones extends RenderBase {
    /**
     * Contructor de la clase.
     */
    constructor() {
        super();
        this.backup = new Backup();
    }
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
        document.getElementById('conf-exportar').addEventListener('click', e => {
            this._initExportar();
        });
    }
    /**
     * Inicializa exportar
     */
    _initExportar() {
        this._cargarExportar();
        this.noLink();
        this._initLoaderExportar();
    }

    _cargarExportar() {
        document.getElementById('conf-title').innerText = 'Respaldos';
        let datos = document.getElementById('datos');
        let items = '';
        items += /*html*/`
        <div class="row mt-20">
            <div class="col s6">
                <span class="left">Animes</span>
            </div>
            <div class="col s6">
                <a id="btn-import-anime" class="no-link waves-effect waves-light btn-small mr-20 blue">Importar</a>
                <a id="btn-export-anime" class="no-link waves-effect waves-light btn-small green">Exportar</a>
            </div>
        </div>
        <div class="row">
            <div class="col s6">
                <span class="left">Pendientes</span>
            </div>
            <div class="col s6">
                <a id="btn-import-pendiente" class="no-link waves-effect waves-light btn-small mr-20 blue">Importar</a>
                <a id="btn-export-pendiente" class="rno-link waves-effect waves-light btn-small green">Exportar</a>
            </div>
        </div>    
        <div class="row">
            <div class="col s12">
            <h6 class="red-text">Advertencia</h6>
            <p>
                Si importa un archivo <code>.json</code> que no tiene el formato del archivo 
                exportado previamente, la aplicación dejara de funcionar correctamente. Si ese 
                es el caso, basta con importar nuevamente el archivo con el formato correcto.
            </p>
            </div>
        </div>
        `;
        datos.innerHTML = items;
    }
    /**
     * Inicializa los componentes de las opciones de Exportar.
     */
    _initLoaderExportar() {
        document.getElementById('btn-export-anime').addEventListener('click', () => {
            let dir = path.join(settings.file(), '..', 'data', 'animes.dat');
            this.backup.exportData(dir, 'animes');
        });
        document.getElementById('btn-import-anime').addEventListener('click', () => {
            let dir = isDev ? path.join(__dirname, '..', 'data', 'animes.dat') : path.join(settings.file(), '..', 'data', 'animes.dat');
            this.backup.importData(dir);
        });
        document.getElementById('btn-export-pendiente').addEventListener('click', () => {
            let dir = path.join(settings.file(), '..', 'data', 'pendientes.dat');
            this.backup.exportData(dir, 'pendientes');
        });
        document.getElementById('btn-import-pendiente').addEventListener('click', () => {
            let dir = isDev ? path.join(__dirname, '..', 'data', 'pendientes.dat') : path.join(settings.file(), '..', 'data', 'pendientes.dat');
            this.backup.importData(dir);
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
        // Creando la Zona de Peligro
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
        items += dangerZone;
        datos.innerHTML = items;
        // Cargando los datos de los días
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
                    <a id="btn-add" class="right btn-floating btn blue">
                    <i class="material-icons icon-plus icon-normal"></i>
                    </a>
                </div>
            `;
            tipo.innerHTML = inputs;
        }
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
                let ultBtnDelete = allBtnDelete[allBtnDelete.length - 1];
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
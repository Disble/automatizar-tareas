const { Days } = require('../models/defaults-config.js');
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
                <a id="btn-import-anime" class="no-link waves-effect waves-light btn-small mr-20 blue lighten-4 blue-text text-darken-1 semibold">Importar</a>
                <a id="btn-export-anime" class="no-link waves-effect waves-light btn-small green lighten-4 green-text text-darken-1 semibold">Exportar</a>
            </div>
        </div>
        <div class="row">
            <div class="col s6">
                <span class="left">Pendientes</span>
            </div>
            <div class="col s6">
                <a id="btn-import-pendiente" class="no-link waves-effect waves-light btn-small mr-20 blue lighten-4 blue-text text-darken-1 semibold">Importar</a>
                <a id="btn-export-pendiente" class="rno-link waves-effect waves-light btn-small green lighten-4 green-text text-darken-1 semibold">Exportar</a>
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
        let daysSettings = settings.get('days', Days);
        let datos = document.getElementById('datos');
        let datosText = '';
        for (const dias of daysSettings) {
            datosText += /*html*/`
                <div class="row">
                    <div class="col s12">
                        <h5>${dias.title}</h5>
                    </div>
                </div>
            `;
            for (const dia of dias.data) {
                datosText += /*html*/`
                <div class="row">
                    <div class="input-field col s6">
                        <input type="text" value="${dia.name}" placeholder="Nombre" id="nombre" readonly>
                        <label for="nombre">Nombre</label>
                    </div>
                    <div class="input-field col s6">
                        <input type="text" value="${dia.alternative}" dia="${dias.title}" placeholder="Nombre alternativo" id="nombre-alternativo">
                        <label for="nombre-alternativo">Nombre alternativo</label>
                    </div>
                </div>
                `;
            }
        }
        datosText += /*html*/`
            <div class="center mb-20">
                <button class="btn green waves-effect waves-light green-text text-lighten-5" id="submit-dias">
                    Guardar cambios
                    <i class="material-icons right icon-pencil"></i>
                </button>
            </div>
            <div class="col s12">
                <div class="divider"></div>
            </div>
            <div class="col s12">
                <h5 class="red-text text-accent-1">Zona de peligro</h5>
            </div>
            <div class="col s12 danger-border">
                <h5 class="grey-text text-darken-2">
                    Restablecer
                    <a class="right waves-effect waves-light btn orange lighten-4 orange-text text-darken-4 z-depth-0" id="btn-restore"><i class="icon-ccw material-icons right"></i>Restablecer</a>
                </h5>
                <p class="paragraph-btn-right grey-text">Se restablece a los valores por defecto.</p>
                
            </div>
        `;
        datos.innerHTML = datosText;
        // Cargando modulos de materialize-css
        M.updateTextFields();
    }
    /**
     * Inicializa los componentes de las opciones 
     * de Días.
     */
    _initLoaderDias() {
        let dias = [];
        let diasClasificados = {};
        let submitDias = document.getElementById('submit-dias');
        submitDias.addEventListener('click', e => {
            let datos = submitDias.parentElement.parentElement;
            let nombresAlternativos = datos.querySelectorAll('#nombre-alternativo');
            let nombres = datos.querySelectorAll('#nombre');
            for (const i in nombresAlternativos) {
                if (nombresAlternativos.hasOwnProperty(i)) {
                    const nombreAlternativo = nombresAlternativos[i].value;
                    let dia = nombresAlternativos[i].getAttribute('dia');
                    const nombre = nombres[i].value;
                    if (!diasClasificados[dia]) {
                        diasClasificados[dia] = [];
                    }
                    diasClasificados[dia].push({
                        name: nombre,
                        alternative: nombreAlternativo
                    });
                }
            }
            for (const nombreDia in diasClasificados) {
                if (diasClasificados.hasOwnProperty(nombreDia)) {
                    dias.push({
                        title: nombreDia,
                        data: diasClasificados[nombreDia]
                    });
                }
            }
            settings.set('days', dias);
            swal("Éxito.", `Los días del menu se han actualizado correctamente.`, "success");
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
                settings.delete('days');
                this.resetConfData();
                this._initDias();
                swal('Éxito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
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
            <div class="btn btn-small blue lighten-5 blue-text z-depth-0">
                <span>Programa</span>
                <input type="file" id="program-file">
            </div>
            <div class="file-path-wrapper">
                <input class="file-path validate" name="programa" type="text" id="programa">
            </div>
        </div>`;
        inputsDownloader += /*html*/`<div class="center mb-20">
            <button class="btn green waves-effect waves-light green-text text-lighten-5" id="submit-downloader">
                Guardar cambios
                <i class="material-icons right icon-pencil"></i>
            </button>
        </div>
        <div class="col s12">
            <div class="divider"></div>
        </div>
        <div class="col s12">
            <h5 class="red-text text-accent-1">Zona de peligro</h5>
        </div>
        <div class="col s12 danger-border">
            <h5 class="grey-text text-darken-2">
                Restablecer
                <a class="right waves-effect waves-light btn orange lighten-4 orange-text text-darken-4 z-depth-0" id="btn-restore"><i class="icon-ccw material-icons right"></i>Restablecer</a>
            </h5>
            <p class="paragraph-btn-right grey-text">Se restablece a los valores por defecto.</p>
            
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
                swal('Éxito', 'Toda posibilidad de recuperación se ha perdido.', 'success');
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
            swal("Éxito.", `La configuración de ${path.basename(dirProgram, '.exe')} se ha guardado correctamente.`, "success");
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
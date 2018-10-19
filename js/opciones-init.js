// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { Menu } = require('../models/defaults-config.js');
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', async function () {
	let menu = settings.get('menu', Menu);
    console.log(menu);
    let items = '';
    let clases = [];
    for (const grupo in menu) {
        if (menu.hasOwnProperty(grupo)) {
            const subGrupo = menu[grupo];
            items += /*html*/`
            <div class="col s12">
                <h5>${grupo}</h5>
            </div>
            <div class="chips chips-${grupo}">
                <input class="custom-class">
            </div>
            `;
            let clase = {
                clase: grupo,
                data: []
            };
            for (const item in subGrupo) {
                clase.data.push({
                    tag: subGrupo[item].id
                });
            }
            clases.push(clase);
        }
    }
    document.getElementById('datos').innerHTML = items;
    console.log('clases', clases);

    for (const clase of clases) {
        console.log(clase.clase, clase.data);        
        let elems = document.querySelectorAll(`.chips-${clase.clase}`);
        M.Chips.init(elems, {
            data: clase.data,
            onChipAdd: (container, el) => {
                console.log(container, el);
                el.querySelector('i').innerHTML = '<i class="material-icons close icon-cancel"></i>'
                console.log(el.querySelector('i').innerHTML);
            },
            onChipSelect: (container, el) => {
                console.log(container, el);
            },
            onChipDelete: (container,el) => {
                console.log(container , el);
            }
        });
    }
   /**
    * Esto cambia el icono por defecto a
    * uno personalizado.
    */
    document.querySelectorAll('.chips').forEach((value) => {
        let instance = M.Chips.getInstance(value);
        for (let i = 0; i < instance.$chips.length; i++) {
            const chip = instance.$chips[i];
            chip.firstElementChild.innerHTML = /*html*/`<i class="material-icons close icon-cancel"></i>`;
        }
    });
    document.getElementById('obtener-chips').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('%cAzul! %cRojo!', 'color: blue; font-size: 2em;', 'color: red; font-size: 2em;'); 
        console.group("%cData Chips", 'color: green; font-size: 1.5em;');
        document.querySelectorAll('.chips').forEach((value) => {
            let instance = M.Chips.getInstance(value);
            console.log('data', instance.chipsData);
        });
        console.groupEnd();
    })
});

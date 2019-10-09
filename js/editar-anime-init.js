// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderEditarAnime } = require('../models/RenderEditarAnime');
const { BDAnimes } = require('../models/consultas.js');

document.addEventListener('DOMContentLoaded', async function () {
    let render = new RenderEditarAnime();
    render.initEditAnime();
    // es para el algoritmo de migración
    let consultas = new BDAnimes();
    let animesAntiguos = await consultas.buscarAnimeAntiguo();
    console.log('antiguo', animesAntiguos);
    if (animesAntiguos.length > 0) {
        await render.advertenciaVersion1();
        let migrated = await render.convertirANuevoAnime(animesAntiguos, consultas);
        if (migrated) {
            await swal('Éxito', 'Hemos actualizado los datos con éxito. Se recargara la ventana para que puedas seguir editando.', 'success');
            window.location.href = window.location.href;
        } else {
            await swal('Houston, tenemos un problema', 'Hubo un error leyendo los datos del archivo original. Por favor recargue la ventana y vuelva a intentarlo.', 'error');
        }
    }
});

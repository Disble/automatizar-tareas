// // si este archivo muere muere toda la app
// const nativeTheme = require('electron').remote.nativeTheme;
// const customTitlebar = require('custom-electron-titlebar');

// // comprobando el tema oscuro del sistema.
// let background = nativeTheme.shouldUseDarkColors ? '#292a2d' : '#F0F0F0';
// // Inicializa el menú, si esto muere, mueren todos los menús del programa.
// let titlebar = new customTitlebar.Titlebar({
//     backgroundColor: customTitlebar.Color.fromHex(background),
//     icon: '../../icons/png/64x64.png'
// });
// // evento que detecta en tiempo real cuando se cambio el tema del sistema
// nativeTheme.on('updated', e => {
//     background = nativeTheme.shouldUseDarkColors ? '#292a2d' : '#F0F0F0';
//     titlebar.updateBackground(customTitlebar.Color.fromHex(background));
// });
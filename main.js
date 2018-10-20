const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const Menu = electron.Menu;
let mainWindow;

let template = [
	{
		label: 'Animes',
		submenu: [{
				label: 'Ver animes',
				accelerator: 'CmdOrCtrl+1',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'index.html'));
							})
						}
					}
				}
			},
			{
				label: 'Agregar animes',
				accelerator: 'CmdOrCtrl+2',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'agregar-animes.html'));
							})
						}
					}
				}
			},
			{
				label: 'Editar animes',
				accelerator: 'CmdOrCtrl+3',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'editar.html'));
							})
						}
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Historial',
				accelerator: 'CmdOrCtrl+h',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'historial.html'));
							})
						}
					}
				}
			},
			{
				label: 'Animes viendo',
				accelerator: 'CmdOrCtrl+g',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'viendo.html'));
							})
						}
					}
				}
			},
			{
				label: 'Paginas (viendo)',
				accelerator: 'CmdOrCtrl+p',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'paginas.html'));
							})
						}
					}
				}
			},
			{
				label: 'Capítulos restantes (viendo)',
				accelerator: 'CmdOrCtrl+j',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'animes', 'capitulos_restantes.html'));
							})
						}
					}
				}
			}
		]
	},
	{
		label: 'Pendientes',
		submenu: [{
				label: 'Ver pendientes',
				accelerator: 'Alt+1',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'pendientes', 'pendientes.html'));
							})
						}
					}
				}
			},
			{
				label: 'Agregar pendientes',
				accelerator: 'Alt+2',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'pendientes', 'agregar.html'));
							})
						}
					}
				}
			},
			{
				label: 'Editar pendientes',
				accelerator: 'Alt+3',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								win.loadFile(path.join('views', 'pendientes', 'editar.html'));
							})
						}
					}
				}
			}
		]
	},
	{
		label: 'Editar',
		submenu: [{
				label: 'Deshacer',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Rehacer',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cortar',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copiar',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Pegar',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Seleccionar todo',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			}
		]
	},
	{
		label: 'Preferencias',
		submenu: [{
			label: 'Opciones',
			accelerator: 'CmdOrCtrl+O',
			click: function (item, focusedWindow) {
				if (focusedWindow) {
					if (focusedWindow.id === 1) {
						BrowserWindow.getAllWindows().forEach(function (win) {
							win.loadFile(path.join('views', 'opciones', 'index.html'));
						})
					}
				}
			}
		}]
	},
	{
		label: 'Ventana',
		role: 'window',
		submenu: [{
				label: 'Recargar',
				accelerator: 'CmdOrCtrl+R',
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						// on reload, start fresh and close any old
						// open secondary windows
						if (focusedWindow.id === 1) {
							BrowserWindow.getAllWindows().forEach(function (win) {
								if (win.id > 1) {
									win.close()
								}
							})
						}
						focusedWindow.reload()
					}
				}
			},
			{
				label: 'Alternar pantalla completa',
				accelerator: (function () {
					if (process.platform === 'darwin') {
						return 'Ctrl+Command+F'
					} else {
						return 'F11'
					}
				})(),
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
					}
				}
			},
			{
				label: 'Alternar herramientas de desarrollo',
				accelerator: (function () {
					if (process.platform === 'darwin') {
						return 'Alt+Command+I'
					} else {
						return 'Ctrl+Shift+I'
						// return 'F12'
					}
				})(),
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.toggleDevTools()
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Minimizar',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Cerrar',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			}
		]
	},
	{
		label: 'Ayuda',
		role: 'help',
		submenu: [{
			label: 'Acerca de',
			enabled: false
		}]
	}
]

function addUpdateMenuItems(items, position) {
	if (process.mas) return

	const version = electron.app.getVersion()
	let updateItems = [{
		label: `Versión ${version}`,
		enabled: false
	}, {
		label: 'Buscar actualizaciones...',
		visible: false,
		key: 'checkForUpdate',
		click: function () {
			require('electron').autoUpdater.checkForUpdates()
		}
	}, {
		label: 'Restart and Install Update',
		enabled: true,
		visible: false,
		key: 'restartToUpdate',
		click: function () {
			require('electron').autoUpdater.quitAndInstall()
		}
	}, {
		label: 'Ver mas',
		click: function () {
			electron.shell.openExternal('https://gitlab.com/Disble/automatizar-tareas');
		}
	}]

	items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
	const menu = Menu.getApplicationMenu();
	if (!menu) return;

	let reopenMenuItem;
	menu.items.forEach(function (item) {
		if (item.submenu) {
			item.submenu.items.forEach(function (item) {
				if (item.key === 'reopenMenuItem') {
					reopenMenuItem = item;
				}
			})
		}
	})
	return reopenMenuItem;
}


if (process.platform === 'win32') {
	const helpMenu = template[template.length - 1].submenu;
	addUpdateMenuItems(helpMenu, 0);
}

app.on('browser-window-created', function () {
	let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = false;
})

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		let reopenMenuItem = findReopenMenuItem();
		if (reopenMenuItem) reopenMenuItem.enabled = true;
		app.quit();
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
	  createWindow()
	}
  })
function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});
  
	// and load the index.html of the app.
	mainWindow.loadFile(path.join('views','animes','index.html'));
	
	// Loading menu from menu template
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
  
	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null;
	});
  }
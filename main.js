const electron = require('electron')
const {app, BrowserWindow} = electron
const Menu = electron.Menu
/*-------------------------------------------*/
// console.log('Automatizador de tareas')
// console.log('Version : ' + app.getVersion())

let template = [{
	label: 'Animes',
	submenu: [{
		label: 'Ver Animes',
		accelerator: 'CmdOrCtrl+1',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/index.html`)
					})
				}
			}
		}
	},
	{
		label: 'Agregar Animes',
		accelerator: 'CmdOrCtrl+2',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/agregar-animes.html`);
					})
				}
			}
		}
	},
	{
		label: 'Editar Animes',
		accelerator: 'CmdOrCtrl+3',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/editar.html`)
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
						win.loadURL(`file://${__dirname}/views/animes/historial.html`)
					})
				}
			}
		}
	},
	{
		label: 'Animes Viendo',
		accelerator: 'CmdOrCtrl+g',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/viendo.html`)
					})
				}
			}
		}
	},
	{
		label: 'Paginas (Viendo)',
		accelerator: 'CmdOrCtrl+p',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/paginas.html`)
					})
				}
			}
		}
	},
	{
		label: 'Capítulos Restantes (Viendo)',
		accelerator: 'CmdOrCtrl+j',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/animes/capitulos_restantes.html`)
					})
				}
			}
		}
	}]
},
{
	label: 'Pendientes',
	submenu: [{
		label: 'Ver Pendientes',
		accelerator: 'Alt+1',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/pendientes/pendientes.html`)
					})
				}
			}
		}
	},
	{
		label: 'Agregar Pendientes',
		accelerator: 'Alt+2',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/pendientes/agregar.html`)
					})
				}
			}
		}
	},
	{
		label: 'Editar Pendientes',
		accelerator: 'Alt+3',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(function (win) {
						win.loadURL(`file://${__dirname}/views/pendientes/editar.html`)
					})
				}
			}
		}
	}]
},
{
	label: 'Edit',
	submenu: [{
		label: 'Undo',
		accelerator: 'CmdOrCtrl+Z',
		role: 'undo'
	},
	{
		label: 'Redo',
		accelerator: 'Shift+CmdOrCtrl+Z',
		role: 'redo'
	},
	{
		type: 'separator'
	},
	{
		label: 'Cut',
		accelerator: 'CmdOrCtrl+X',
		role: 'cut'
	},
	{
		label: 'Copy',
		accelerator: 'CmdOrCtrl+C',
		role: 'copy'
	},
	{
		label: 'Paste',
		accelerator: 'CmdOrCtrl+V',
		role: 'paste'
	},
	{
		label: 'Select All',
		accelerator: 'CmdOrCtrl+A',
		role: 'selectall'
	}]
},
{
	label: 'Window',
	role: 'window',
	submenu: [{
		label: 'Reload',
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
		label: 'Toggle Full Screen',
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
		label: 'Toggle Developer Tools',
		accelerator: (function () {
			if (process.platform === 'darwin') {
				return 'Alt+Command+I'
			} else {
				//return 'Ctrl+Shift+I'
				return 'F12'
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
		label: 'Minimize',
		accelerator: 'CmdOrCtrl+M',
		role: 'minimize'
	},
	{
		label: 'Close',
		accelerator: 'CmdOrCtrl+W',
		role: 'close'
	}]
},
{
	label: 'Help',
	role: 'help',
	submenu: [{
		label: 'About',
		enabled: false
	}]
}]

function addUpdateMenuItems(items, position) {
	if (process.mas) return

	const version = electron.app.getVersion()
	let updateItems = [{
		label: `Version ${version}`,
		enabled: false
  }, {
		label: 'Check for Update',
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
}, 	{
		label: 'Learn More',
		click: function () {
			electron.shell.openExternal('http://electron.atom.io')
		}
	}]

	items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
	const menu = Menu.getApplicationMenu()
	if (!menu) return

	let reopenMenuItem
	menu.items.forEach(function (item) {
		if (item.submenu) {
			item.submenu.items.forEach(function (item) {
				if (item.key === 'reopenMenuItem') {
					reopenMenuItem = item
				}
			})
		}
	})
	return reopenMenuItem
}


if (process.platform === 'win32') {
	const helpMenu = template[template.length - 1].submenu
	addUpdateMenuItems(helpMenu, 0)
}

app.on('browser-window-created', function () {
	let reopenMenuItem = findReopenMenuItem()
	if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		let reopenMenuItem = findReopenMenuItem()
		if (reopenMenuItem) reopenMenuItem.enabled = true
		app.quit()
	}
})
app.on('ready', function () {
	let win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(`file://${__dirname}/views/animes/index.html`);
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
	
	win.on('closed', function () {
		mainWindow = null
	})
})

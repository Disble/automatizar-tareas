const {shell} = require('electron')
require('hammerjs')
require('materialize-css')
var Datastore = require('nedb'),
    animesdb = new Datastore({filename: __dirname + '\\..\\data\\animes.dat', autoload: true}),
	pendientesdb = new Datastore({filename: __dirname + '\\..\\data\\pendientes.dat', autoload: true})

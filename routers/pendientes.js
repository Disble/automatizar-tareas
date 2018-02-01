const {shell} = require('electron');
require('hammerjs');
require('materialize-css');
var Chart = require('chart.js');
var Datastore = require('nedb'),
	pendientesdb = new Datastore({filename: __dirname + '\\..\\..\\data\\pendientes.dat', autoload: true});

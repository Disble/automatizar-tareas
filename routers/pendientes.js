const {shell} = require('electron');
require('hammerjs');
require('materialize-css');
require('sweetalert');
var Chart = require('chart.js');
var Sortable = require('sortablejs');
var Datastore = require('nedb'),
	pendientesdb = new Datastore({filename: __dirname + '\\..\\..\\data\\pendientes.dat', autoload: true});

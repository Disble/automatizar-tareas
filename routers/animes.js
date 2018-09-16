const {shell} = require('electron');
require('materialize-css');
require('sweetalert');
var Chart = require('chart.js');
var Datastore = require('nedb'),
  animesdb = new Datastore({filename: __dirname + '\\..\\..\\data\\animes.dat', autoload: true});

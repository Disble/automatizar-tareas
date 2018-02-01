const {shell} = require('electron');
require('hammerjs');
require('materialize-css');
var Chart = require('chart.js');
var Datastore = require('nedb'),
  animesdb = new Datastore({filename: __dirname + '\\..\\..\\data\\animes.dat', autoload: true});

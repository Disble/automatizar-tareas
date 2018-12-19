const settings = require('electron-settings');
const Datastore = require('nedb');
const path = require('path');
const animesdb = new Datastore({filename: path.join(settings.file(), '..', 'data', 'animes.dat'), autoload: true});
// const animesdb = new Datastore({filename: path.join(__dirname, '..', 'data', 'animes.dat'), autoload: true});

exports.animesdb = animesdb;
const Datastore = require('nedb');
const path = require('path');
const animesdb = new Datastore({filename: path.join(__dirname, '..', 'data', 'animes.dat'), autoload: true});

exports.animesdb = animesdb;
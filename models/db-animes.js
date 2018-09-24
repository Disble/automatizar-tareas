const Datastore = require('nedb');
const animesdb = new Datastore({filename: __dirname + '\\..\\data\\animes.dat', autoload: true});

exports.animesdb = animesdb;
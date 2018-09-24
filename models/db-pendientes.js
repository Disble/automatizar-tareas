const Datastore = require('nedb');
const pendientesdb = new Datastore({filename: __dirname + '\\..\\data\\pendientes.dat', autoload: true});

exports.pendientesdb = pendientesdb;
'use strict'

class Historial {
	constructor() {
	}

	exportando(path) {
		var fs = require('fs'),
			readStream = fs.createReadStream(`data\\animes.dat`),
			writeStream = fs.createWriteStream(path)
		readStream.pipe(writeStream)
		readStream
			.on('data', function(chunk){
				console.log(
					'He leido:',
					chunk.length,
					'caracteres'
				)
			})
			.on('end', function(){
				console.log('Termine de leer el archivo')
			})
		console.log(`Modulo Exportar exportando... en ${writeStream.path}`)
	}
}

module.exports = Historial

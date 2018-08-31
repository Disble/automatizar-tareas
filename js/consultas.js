function cargarDatos(){
	let render = new Render();
	let nuevo = render.crearAnime();
	animesdb.insert(nuevo, function(err, record) {
		if (err) {
			console.error(err);
			Materialize.toast('Houston, tenemos un problema', 4000);
			return;
		}
		Materialize.toast('Datos Ingresados Correctamente', 4000);
	})
	return false;
}

function buscar(dia){
	animesdb
	.find({$and : [{"dia":dia}, {$or : [{"activo" : true}, {"activo" : {$exists : false} }] }] })
	.sort({"orden":1})
	.exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		//console.log(record)
		let render = new Render()
		render.actualizarLista(record, dia)
	})
}

function buscarPaginas(){
	return new Promise((resolve, reject) => {
		animesdb.find({$and : [{"pagina" : {$exists : true}}, {$or : [{"activo" : true}, {"activo" : {$exists : false} }]}]}, {pagina:1, nombre:1})
		.sort({"orden":1})
		.exec(function(err, record) {
			if (err) {
				//console.error(err)
				reject(new Error(err));
				process.exit(0);
			}
			resolve(record);
		});
	});
}

function capRestantes(){
	return new Promise((resolve, reject) => {
		animesdb.find({$and : [{"totalcap" : {$exists : true}}, {$or : [{"activo" : true}, {"activo" : {$exists : false} }]}]}, {nombre:1, totalcap: 1, nrocapvisto: 1, estado: 1})
		.sort({"orden":1})
		.exec(function(err, record) {
			if (err) {
				//console.error(err)
				reject(new Error(err));
				process.exit(0);
			}
			resolve(record);
		});
	});
}

function buscarMedallasDia(menu) {
	contNombres = 0
	$.each(menu, (nivel1, value1) => {
		$.each(value1, (nivel2, value2) => {
			let render = new Render()
			let dia = render._quitaAcentos(nivel2)
			animesdb
			.count({$and : [{"dia":dia}, {$or : [{"activo" : true}, {"activo" : {$exists : false} }] }, {"estado" : {$gt : 0}}] })
			.sort({"orden":1})
			.exec(function(err, record) {
				if (err) {
					console.error(err)
					process.exit(0)
				}
				render.cargarMedallas(contNombres++, record);
			})
		})
	})
}

function cargarEditar(pag = 1){
	animesdb
	.count({$or : [{"activo" : true}, {"activo" : {$exists : false} }]})
	.exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		buscarTodoEditar(pag, record)
	})
}

function buscarTodoEditar(){	
	return new Promise((resolve, reject) => {
		animesdb
		.find({$or : [{"activo" : true}, {"activo" : {$exists : false} }]}, {"nombre" : 1})
		.sort({"fechaCreacion":-1})
		.exec(function(err, record) {
			if (err) {
				reject(new Error(err));
				process.exit(0)
			}
			return resolve(record);
		})
	});
}

function actualizarAnime(id, setValues){
	animesdb.update({"_id" : id}, setValues, function(err, num) {
		if (err) {
			console.error(err);
			Materialize.toast('Houston, tenemos un problema', 4000);
			return;
		}
		Materialize.toast('Datos actualizado correctamente', 4000);
	});
}

function buscarAnimePorId(id){
	return new Promise((resolve, reject) => {
		animesdb.findOne({
			_id: id
		}, function (err, doc) {
			if (err) {
				reject(new Error(err));
				process.exit(0)
			}
			return resolve(doc);
		});
	});
}

function desactivarAnime(id){
	return new Promise((resolve, reject) => {
		animesdb.update({"_id" : id}, {$set: {"activo": false, "fechaEliminacion" : new Date()}}, function(err, numUpdate) {
			if (err) {
				reject(new Error(err));
				return
			}
			return resolve(numUpdate);
		});
	});
}

function buscarPorId(id){
	animesdb.findOne({ _id: id }, function (err, doc) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let render = new Historial()
		render.capitulosVistosUnAnime(doc)
	})
}

function cargarHistorial(pag = 1, option = 1){
	// console.log(pag, option);
	
	animesdb.count({}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		if (option == 1){
			buscarTodoHistorial(pag, record)
		} else {
			buscarAnimesViendo()
		}
	})
}

function buscarAnimesViendo() {
	animesdb.find({}).sort({"fechaUltCapVisto":-1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let historial = new Historial()
		historial.capitulosVistos(record)
	})
}

function buscarTodoHistorial(pag, totalReg){
	let render = new Render()
	let salto = render.saltoPaginacion(pag, totalReg)
	let limite = render.numReg
	animesdb.find({}).sort({"fechaUltCapVisto":-1}).skip(salto).limit(limite).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let historial = new Historial();
		historial.imprimirHistorial(record, salto);
		historial.imprimirPagination(totalReg, pag);
	})
}

function buscarAutocompleteHistorial(){
	return new Promise((resolve, reject) => {
        animesdb.find({}, {"nombre" : 1} ).sort({"fechaUltCapVisto":-1}).exec(function(err, record) {
			if (err) {
				reject(new Error(err));
				process.exit(0)
			}
			// console.log(record);
			let data = {};
			for (const i in record) {
				if (record.hasOwnProperty(i)) {
					const element = record[i];
					data[element.nombre] = null;
				}
			}
			return resolve(data);
		});
	});
}

function buscarAutocompleteAnimes(query, esFiltro, orden = {"fechaUltCapVisto" : -1}){
	queryReg = escaparQuery(query);
	animesdb.find({nombre: new RegExp(queryReg, 'i')}).sort(orden).exec(function(err, record) {
		if (err) {
			console.error(err);
			process.exit(0);
		}
		// console.log(record);
		if (esFiltro) {
			Materialize.toast(`Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`, 4000);
		}
		let historial = new Historial();
		historial.imprimirHistorial(record, 0);
	});
}

function filtrarBuscadorHistorial(query, opciones, orden) {
	queryReg = escaparQuery(query);
	animesdb
		.find({$and : [{nombre: new RegExp(queryReg, 'i')}, opciones] })
		.sort(orden)
		.exec(function(err, record) {
		if (err) {
			console.error(err);
			process.exit(0);
		}
		Materialize.toast(`Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`, 4000);
		// console.log(record);
		let historial = new Historial();
		historial.imprimirHistorial(record, 0);
	});
}

function escaparQuery(query) {
	query = query.replace(/\(|\)|\{|\}|\./g, (x) => {
		return `\\${x}`;
	});
	return query;
}

function actualizarCap(dia, id, cont){
	animesdb.update({"_id" : id}, {$set: {"nrocapvisto": cont, "fechaUltCapVisto" : new Date()}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		buscar(dia)
	})
}

function actualizarCarpeta(dia, id, carpeta) {
	animesdb.update({"_id" : id}, {$set: {"carpeta": carpeta}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		buscar(dia)
	})
}

function estadoCap(dia, id, estado){
	animesdb.update({"_id" : id}, {$set: {"estado": estado}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		buscar(dia)
		buscarMedallasDia(render.menu)
		Materialize.toast('Estado modificado correctamente', 4000)
	})
}

function restaurarFila(id) {
	swal({
	  title: "¿Estás seguro?",
	  text: "¡Volvera a aparecer en la lista de ver animes!",
	  icon: "warning",
	  buttons: ["Cancelar", "OK"],
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
			animesdb.update({"_id" : id}, {$set: {"activo": true, "fechaEliminacion" : null}}, function(err, numUpdate) {
				if (err) {
					console.error(err);
					return;
				}
				let render = new Historial();
				render._reloadHistorial();
			})
	  } else {
	    swal("¡Acción cancelada!");
	  }
	});
}

function borrarAnime(id) {
	swal({
	  title: "¿Estás seguro?",
	  text: "¡Una vez borrado, no vas a poder recuperarlo!",
	  icon: "warning",
	  buttons: ["Cancelar", "OK"],
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
			animesdb.remove({ _id : id }, {}, function (err, numRemoved) {
				if (err) {
					console.error(err);
					process.exit(0);
				}
				let render = new Historial();
				render._reloadHistorial();
			});
	  } else {
	    swal("¡Acción cancelada!");
	  }
	});
}

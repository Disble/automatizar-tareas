function cargarDatos(){
	let render = new Render()
	let nuevo = render.crearJson()
	animesdb.insert(nuevo, function(err, record) {
		if (err) {
			console.error(err)
			Materialize.toast('Houston, tenemos un problema', 4000)
			return
		}
		Materialize.toast('Datos Ingresados Correctamente', 4000)
	})
	return false
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
				render.cargarMedallas(contNombres++, record)
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

function buscarTodoEditar(pag, totalReg){
	let render = new Render()
	let salto = render.saltoPaginacion(pag, totalReg)
	let limite = render.numReg
	animesdb
	.find({$or : [{"activo" : true}, {"activo" : {$exists : false} }]})
	.sort({"fechaCreacion":-1})
	.skip(salto).limit(limite)
	.exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		render.actualizarListaCompleta(record, salto)
		render.cellEdit()
		render.eraserRow()
		render.imprimirPagination(totalReg, pag)
	})
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
		let historial = new Historial()
		historial.imprimirHistorial(record, salto)
		historial.imprimirPagination(totalReg, pag)
	})
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
		Materialize.toast('Estado modificado correctamente', 4000)
	})
}

function actualizarFila(id, json, pag){
	animesdb.update({"_id" : id}, {$set: {"orden": json.orden, "nombre": json.nombre, "dia": json.dia, "nrocapvisto": json.nrocapvisto, "totalcap": json.totalcap , "pagina": json.pagina, "carpeta": json.carpeta}}, function(err, num) {
		if (err) {
			console.error(err)
			Materialize.toast('Houston, tenemos un problema', 4000)
			return
		}
		cargarEditar(pag)
	})
}

function borrarFila(id, pag){
	animesdb.update({"_id" : id}, {$set: {"activo": false, "fechaEliminacion" : new Date()}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		cargarEditar(pag)
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

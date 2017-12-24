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
	animesdb.find({$and : [{"dia":dia}, {$or : [{"activo" : true}, {"activo" : {$exists : false} }] }] }).sort({"orden":1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		//console.log(record)
		let render = new Render()
		render.actualizarLista(record, dia)
		render.changeState()
	})
}

function cargarEditar(pag = 1){
	animesdb.count({$or : [{"activo" : true}, {"activo" : {$exists : false} }]}).exec(function(err, record) {
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
	animesdb.find({$or : [{"activo" : true}, {"activo" : {$exists : false} }]}).sort({"fechaCreacion":-1}).skip(salto).limit(limite).exec(function(err, record) {
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
		buscarTodoHistorial(pag, record, option)
	})
}

function buscarTodoHistorial(pag, totalReg, option){
	let render = new Render()
	let salto = render.saltoPaginacion(pag, totalReg)
	let limite = render.numReg
	animesdb.find({}).sort({"fechaUltCapVisto":-1}).skip(salto).limit(limite).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let historial = new Historial()
		if (option == 1){
			historial.imprimirHistorial(record, salto)
			historial.imprimirPagination(totalReg, pag)
		} else {
			historial.capitulosVistos(record)
		}
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
	animesdb.update({"_id" : id}, {$set: {"orden": json.orden, "nombre": json.nombre, "dia": json.dia, "nrocapvisto": json.nrocapvisto, "pagina": json.pagina, "carpeta": json.carpeta}}, function(err, num) {
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
	if (confirm('¿Estás seguro que quieres restaurar este anime?','Advertencia')){
		animesdb.update({"_id" : id}, {$set: {"activo": true, "fechaEliminacion" : null}}, function(err, numUpdate) {
			if (err) {
				console.error(err)
				return
			}
			let render = new Historial()
			render._reloadHistorial();
		})
	}
}

function borrarAnime(id) {
	if (confirm('¿Estás seguro que quieres borrar de forma permamente este anime?','Advertencia')){
		animesdb.remove({ _id : id }, {}, function (err, numRemoved) {
			if (err) {
				console.error(err);
				process.exit(0);
			}
			let render = new Historial()
			render._reloadHistorial();
		});
	}
}

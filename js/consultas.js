function buscar(dia){
	animesdb.find({"dia":dia}).sort({"orden":1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let render = new Render()
		render.actualizarLista(record, dia)
	})
}

function buscarTodo(){
	animesdb.find({}).sort({"_id":-1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let render = new Render()
		render.actualizarListaCompleta(record)
		render.cellEdit()
		render.eraserRow()
	})
}

function actualizar(dia, orden, cont){
	animesdb.update({$and: [{"dia":dia}, {"orden":orden}]}, {$set: {"nrocapvisto": cont}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		let render = new Render()
		render.buscar(dia)
	})
}

function actualizarFila(id, json){
	animesdb.update({"_id" : id}, json, function(err, num) {
		if (err) {
			console.error(err)
			return
		}
		buscarTodo()
	})
}

function cargarDatos(){
	animesdb.insert(crearJSON(), function(err, record) {
		if (err) {
			console.error(err)
			return
		}
	})
	return false
}

function borrarFila(id){
	animesdb.remove({ _id : id }, {}, function (err, numRemoved) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		buscarTodo()
	})
}

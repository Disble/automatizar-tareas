function cargarDatos(){
	let render = new Render()
	animesdb.insert(render.crearJson(), function(err, record) {
		if (err) {
			console.error(err)
			Materialize.toast('Houston, tenemos un problema', 4000)
			return
		}
	})
	Materialize.toast('Datos Ingresados Correctamente', 4000)
	return false
}

function buscar(dia){
	animesdb.find({"dia":dia}).sort({"orden":1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let render = new Render()
		render.actualizarLista(record, dia)
		render.changeState()
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

function actualizarCap(dia, id, cont){
	animesdb.update({"_id" : id}, {$set: {"nrocapvisto": cont}}, function(err, numUpdate) {
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
	})
}

function actualizarFila(id, json){
	animesdb.update({"_id" : id}, json, function(err, num) {
		if (err) {
			console.error(err)
			Materialize.toast('Houston, tenemos un problema', 4000)
			return
		}
		buscarTodo()
	})
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

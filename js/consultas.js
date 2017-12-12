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
		console.log(record)
		let render = new Render()
		render.actualizarLista(record, dia)
		render.changeState()
	})
}

function buscarTodo(){
	animesdb.find({$or : [{"activo" : true}, {"activo" : {$exists : false} }]}).sort({"fechaCreacion":-1}).exec(function(err, record) {
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

function buscarTodoHistorial(option){
	animesdb.find({}).sort({"fechaUltCapVisto":-1}).exec(function(err, record) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		let render = new Historial()
		if (option == 1)
			render.imprimirHistorial(record)
		else
			render.capitulosVistos(record)
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

function actualizarFila(id, json){
	animesdb.update({"_id" : id}, {$set: {"orden": json.orden, "nombre": json.nombre, "dia": json.dia, "nrocapvisto": json.nrocapvisto, "estado": json.estado, "pagina": json.pagina, "carpeta": json.carpeta}}, function(err, num) {
		if (err) {
			console.error(err)
			Materialize.toast('Houston, tenemos un problema', 4000)
			return
		}
		buscarTodo()
	})
}

function borrarFila(id){
	animesdb.update({"_id" : id}, {$set: {"activo": false, "fechaEliminacion" : new Date()}}, function(err, numUpdate) {
		if (err) {
			console.error(err)
			return
		}
		buscarTodo()
	})
}

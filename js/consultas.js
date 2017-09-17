function buscar(dia){
	animesdb.find({"dia":dia}).sort({"orden":1}).exec(function(err, record) {
		if (err) {
			console.error(err);
			process.exit(0);
		}
		actualizarLista(record, dia);
	});
}

function buscarTodo(){
	animesdb.find({}).sort({"_id":-1}).exec(function(err, record) {
		if (err) {
			console.error(err);
			process.exit(0);
		}
		actualizarListaCompleta(record);
		console.log(record);
		cellEdit();
	});
}

function actualizar(dia, orden, cont){
	animesdb.update({$and: [{"dia":dia}, {"orden":orden}]}, {$set: {"nrocapvisto": cont}}, function(err, num) {
		if (err) {
			console.error(err);
			return;
		}
		buscar(dia);
		console.log(num);
	});
}

function actualizarFila(id, json){
	console.log(json)
	animesdb.update({"_id" : id}, json, function(err, num) {
		if (err) {
			console.error(err);
			return;
		}
		//buscar(dia);
		//console.log(num);
		buscarTodo()
	});
}

function cargarDatos(){
	animesdb.insert(crearJSON(), function(err, record) {
		if (err) {
			console.error(err);
			return;
		}
		console.log(record);
	});
	return false;
}
buscar("lunes");
/*
animesdb.find({"dia":"sabado"}, function(err, record) {
    if (err) {
        console.error(err);
        process.exit(0);
    }
    //console.log(record);
	actualizarLista(record);
});*/
/*
animesdb.update({"orden":3}, {$set: {"nrocapvisto": 9}}, function(err, num) {
    if (err) {
        console.error(err);
        return;
    }
    animesdb.find({"dia":"domingo"}, function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
		actualizarLista(result);
    });
});
*/

class ModelPendiente {
    constructor() {
        this.pendiente = new Pendiente();
    }

    new(pendiente) {
      pendientesdb.insert(pendiente, function(err, record) {
    		if (err) {
    			console.error(err);
    			Materialize.toast('Houston, tenemos un problema', 4000);
    			return;
    		}
    		Materialize.toast('Datos Ingresados Correctamente', 4000);
    	})
    }
}

const { animesdb } = require('./db-animes');
const { RenderBase } = require('./RenderBase.js');

class BDAnimes extends RenderBase {
	/**
	 * Crear un anime en la base de datos.
	 * @param {any} anime Anime a guardar en la base de datos.
	 * @return {any} Objeto insertado en la base de datos.
	 */
	crearAnime(anime) {
		return new Promise((resolve, reject) => {
			animesdb.insert(anime, function (err, record) {
				if (err) {
					M.toast({
						html: 'Houston, tenemos un problema',
						displayLength: 4000
					});
					reject(new Error(err));
					return;
				}
				M.toast({
					html: 'Datos Ingresados Correctamente',
					displayLength: 4000
				});
				return resolve(record);
			})
		});
	}
	/**
	 * Busca todos los animes pertenecientes al día seleccionado.
	 * @param {string} dia Día de la semana a buscar.
	 * @return {Promise} Promise
	 */
	buscar(dia) {
		return new Promise((resolve, reject) => {
			animesdb
				.find({ $and: [{ "dia": dia }, { $or: [{ "activo": true }, { "activo": { $exists: false } }] }] })
				.sort({ "orden": 1 })
				.exec(function (err, record) {
					if (err) {
						reject(new Error(err));
						process.exit(0);
					}
					return resolve({
						datos: record
					});
				});
		});

	}

	buscarPaginas() {
		return new Promise((resolve, reject) => {
			animesdb.find({ $and: [{ "pagina": { $exists: true } }, { $or: [{ "activo": true }, { "activo": { $exists: false } }] }] }, {pagina: 1, nombre: 1})
				.sort({"orden": 1})
				.exec(function (err, record) {
					if (err) {
						//console.error(err)
						reject(new Error(err));
						process.exit(0);
					}
					resolve(record);
				});
		});
	}

	capRestantes() {
		return new Promise((resolve, reject) => {
			animesdb.find({ $and: [{ "totalcap": { $exists: true } }, { $or: [{ "activo": true }, { "activo": { $exists: false } }] }] }, { nombre: 1, totalcap: 1, nrocapvisto: 1, estado: 1 })
				.sort({ "orden": 1 })
				.exec(function (err, record) {
					if (err) {
						//console.error(err)
						reject(new Error(err));
						process.exit(0);
					}
					resolve(record);
				});
		});
	}
	/**
	 * 
	 * @param {string[]} menu 
	 */
	async buscarMedallasDia(menu) {
		let medallas = [];
		let contNombres = 0;
		for (const index1 in menu) {
			const value1 = menu[index1];
			for (const index2 in value1) {
				let dia = this.quitaAcentos(index2);
				let datos = await this._buscarMedalla(dia);
				medallas.push({
					itemMenu: contNombres++,
					datos: datos
				});
			}
		}
		return medallas;
	}

	_buscarMedalla(dia) {
		return new Promise((resolve, reject) => {
			animesdb
				.count({ $and: [{ "dia": dia }, { $or: [{ "activo": true }, { "activo": { $exists: false } }] }, { "estado": { $gt: 0 } }] })
				.sort({ "orden": 1 })
				.exec(function (err, record) {
					if (err) {
						reject(new Error(err));
						process.exit(0);
					}
					resolve(record);
				});
		});
	}
	/**
	 * Retorna todos los animes activos
	 * ordenados por su fecha de creación
	 * del más reciente al más antiguo.
	 */
	buscarTodoEditar() {
		return new Promise((resolve, reject) => {
			animesdb
				.find({ $or: [{ "activo": true }, { "activo": { $exists: false } }] }, { "nombre": 1 })
				.sort({ "fechaCreacion": -1 })
				.exec(function (err, record) {
					if (err) {
						reject(new Error(err));
						process.exit(0)
					}
					return resolve(record);
				})
		});
	}
	/**
	 * Actualiza los campos de un anime en la base de datos.
	 * @param {string} id Id del anime.
	 * @param {any} setValues Objeto con los campos a modificar en la base de datos.
	 */
	actualizarAnime(id, setValues) {
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, setValues, function (err, numUpdate) {
				if (err) {
					M.toast({
						html: 'Houston, tenemos un problema',
						displayLength: 4000
					});
					reject(new Error(err));
					return;
				}
				M.toast({
					html: 'Datos actualizados correctamente',
					displayLength: 4000
				});
				resolve(numUpdate);
			});
		});
	}
	/**
	 * Retorna el anime que coincida con
	 * el id proporcionado.
	 * @param {number} id Id del anime.
	 */
	buscarAnimePorId(id) {
		return new Promise((resolve, reject) => {
			animesdb.findOne({ _id: id }, function (err, doc) {
				if (err) {
					reject(new Error(err));
					process.exit(0)
				}
				return resolve(doc);
			});
		});
	}
	/**
	 * Vuelve un anime inactivo y dejara de
	 * verse en la listas de animes.
	 * @param {string} id Id del anime.
	 */
	desactivarAnime(id) {
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, { $set: { "activo": false, "fechaEliminacion": new Date() } }, function (err, numUpdate) {
				if (err) {
					reject(new Error(err));
					return
				}
				return resolve(numUpdate);
			});
		});
	}

	buscarPorId(id) {
		animesdb.findOne({ _id: id }, function (err, doc) {
			if (err) {
				console.error(err)
				process.exit(0)
			}
			let render = new Historial()
			render.capitulosVistosUnAnime(doc)
		})
	}

	cargarHistorial(pag = 1, option = 1) {
		// console.log(pag, option);

		animesdb.count({}).exec(function (err, record) {
			if (err) {
				console.error(err)
				process.exit(0)
			}
			if (option == 1) {
				buscarTodoHistorial(pag, record)
			} else {
				buscarAnimesViendo()
			}
		})
	}

	buscarAnimesViendo() {
		animesdb.find({}).sort({
			"fechaUltCapVisto": -1
		}).exec(function (err, record) {
			if (err) {
				console.error(err)
				process.exit(0)
			}
			let historial = new Historial()
			historial.capitulosVistos(record)
		})
	}

	buscarTodoHistorial(pag, totalReg) {
		let render = new Render()
		let salto = render.saltoPaginacion(pag, totalReg)
		let limite = render.numReg
		animesdb.find({}).sort({ "fechaUltCapVisto": -1 }).skip(salto).limit(limite).exec(function (err, record) {
			if (err) {
				console.error(err)
				process.exit(0)
			}
			let historial = new Historial();
			historial.imprimirHistorial(record, salto);
			historial.imprimirPagination(totalReg, pag);
		})
	}

	buscarAutocompleteHistorial() {
		return new Promise((resolve, reject) => {
			animesdb.find({}, { "nombre": 1 }).sort({ "fechaUltCapVisto": -1 }).exec(function (err, record) {
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

	buscarAutocompleteAnimes(query, esFiltro, orden = { "fechaUltCapVisto": -1 }) {
		queryReg = escaparQuery(query);
		animesdb.find({ nombre: new RegExp(queryReg, 'i') }).sort(orden).exec(function (err, record) {
			if (err) {
				console.error(err);
				process.exit(0);
			}
			// console.log(record);
			if (esFiltro) {
				M.toast({
					html: `Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`,
					displayLength: 4000
				});
			}
			let historial = new Historial();
			historial.imprimirHistorial(record, 0);
		});
	}

	filtrarBuscadorHistorial(query, opciones, orden) {
		queryReg = escaparQuery(query);
		animesdb
			.find({ $and: [{ nombre: new RegExp(queryReg, 'i') }, opciones] })
			.sort(orden)
			.exec(function (err, record) {
				if (err) {
					console.error(err);
					process.exit(0);
				}
				M.toast({
					html: `Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`,
					displayLength: 4000
				});
				// console.log(record);
				let historial = new Historial();
				historial.imprimirHistorial(record, 0);
			});
	}

	escaparQuery(query) {
		query = query.replace(/\(|\)|\{|\}|\./g, (x) => {
			return `\\${x}`;
		});
		return query;
	}
	/**
	 * Actualiza el número de capitulo vistos. Si la
	 * consulta falla retornara 0.
	 * @param {string} id Id del anime.
	 * @param {float} cont Número de capítulos.
	 */
	actualizarCap(id, cont) {
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, { $set: { "nrocapvisto": cont, "fechaUltCapVisto": new Date() } }, function (err, numUpdate) {
				if (err) {
					reject(new Error(err));
					return;
				}
				resolve(numUpdate);
			});
		});
	}
	/**
	 * Guarda la nueva dirección de la carpeta del anime
	 * seleccionado.
	 * @param {string} id 
	 * @param {string} carpeta 
	 */
	actualizarCarpeta(id, carpeta) {
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, { $set: { "carpeta": carpeta } }, function (err, numUpdate) {
				if (err) {
					reject(new Error(err));
					return
				}
				resolve(numUpdate);
			});
		});
	}
	/**
	 * Guarda un nuevo estado al anime seleccionado.
	 * @param {string} id Id del anime
	 * @param {number} estado Nuevo estado:
	 * 		- 0 - Viendo
	 * 		- 1 - Finalizado
	 * 		- 2 - No me gusto
	 */
	estadoCap(id, estado) {
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, { $set: { "estado": estado } }, function (err, numUpdate) {
				if (err) {
					M.toast({
						html: 'Houston, tenemos un problema',
						displayLength: 4000
					});
					reject(new Error(err));
					return;
				}
				M.toast({
					html: 'Estado modificado correctamente',
					displayLength: 4000
				});
				return resolve(true);
			})
		});
	}

	restaurarFila(id) {
		swal({
				title: "¿Estás seguro?",
				text: "¡Volvera a aparecer en la lista de ver animes!",
				icon: "warning",
				buttons: ["Cancelar", "OK"],
				dangerMode: true,
			})
			.then((willDelete) => {
				if (willDelete) {
					animesdb.update({ "_id": id }, { $set: { "activo": true, "fechaEliminacion": null } }, function (err, numUpdate) {
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

	borrarAnime(id) {
		swal({
				title: "¿Estás seguro?",
				text: "¡Una vez borrado, no vas a poder recuperarlo!",
				icon: "warning",
				buttons: ["Cancelar", "OK"],
				dangerMode: true,
			})
			.then((willDelete) => {
				if (willDelete) {
					animesdb.remove({ _id: id }, {}, function (err, numRemoved) {
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
}

exports.BDAnimes = BDAnimes;
const { animesdb } = require('./db-animes');
const { RenderBase } = require('./RenderBase');

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
			animesdb.find({ $and: [{ $and: [{$not: {"totalcap": null}} ,{"totalcap": { $exists: true }}] }, { $or: [{ "activo": true }, { "activo": { $exists: false } }] }] }, { nombre: 1, totalcap: 1, nrocapvisto: 1, estado: 1 })
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
	 * Compara los días contra la base de 
	 * datos para encontrar la medallas.
	 * @param {string[]} menu 
	 */
	async buscarMedallasDia(menu) {
		let medallas = [];
		let contNombres = 0;
		for (const tipo in menu) {
			const grupo = menu[tipo];
			for (const titulo in grupo) {
				let dia = this.quitaAcentos(grupo[titulo].id);
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
	 * Hace un conteo de todos los registros de 
	 * animes, y retorna datos dependiendo de la
	 * opcion escogida.
	 * @param {number} pag Pagina a cargar.
	 * @param {number} option Opción:
	 * 		- 1: Retorna los datos de la paginación de Historial
	 * 		- 2: Retorna los datos de los animes (viendo).
	 */
	cargarHistorial(pag = 1, option = 1) {
		return new Promise((resolve, reject) => {
			animesdb.count({}).exec((err, record) => {
				if (err) {
					reject(new Error(err));
					process.exit(0);
				}
				if (option == 1) {
					return resolve(this.buscarTodoHistorial(pag, record));
				} else {
					return resolve(this.buscarAnimesViendo());
				}
			});
		});
	}

	buscarAnimesViendo() {
		return new Promise((resolve, reject) => {
			animesdb.find({}).sort({ "fechaUltCapVisto": -1 }).exec(function (err, record) {
				if (err) {
					reject(new Error(err));
					process.exit(0)
				}
				return resolve(record);
			})
		});
	}
	/**
	 * Genera todos los datos necesarios para
	 * crear la paginación para Historial.
	 * @param {number} pag Pagina a cargar.
	 * @param {number} totalReg Conteo del total de registros de animes.
	 */
	buscarTodoHistorial(pag, totalReg) {
		return new Promise((resolve, reject) => {
			let salto = this.saltoPaginacion(pag, totalReg);
			let limite = this.numReg; // este this pertenece a RenderBase
			animesdb.find({}).sort({ "fechaUltCapVisto": -1 }).skip(salto).limit(limite).exec(function (err, record) {
				if (err) {
					reject(new Error(err));
					process.exit(0);
				}
				return resolve({
					datos: record,
					salto,
					totalReg,
					pag
				});
				
			});
		});
	}

	buscarAutocompleteHistorial() {
		return new Promise((resolve, reject) => {
			animesdb.find({}, { "nombre": 1 }).sort({ "fechaUltCapVisto": -1 }).exec(function (err, record) {
				if (err) {
					reject(new Error(err));
					process.exit(0)
				}
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
	/**
	 * Busca solo los animes que coinciden con el query
	 * proporcionado. Se utiliza para el buscador.
	 * @param {string} query String a buscar.
	 * @param {any} esFiltro Opciones de busqueda.
	 * @param {any} orden Orden en se muestran las respuestas.
	 */
	buscarAutocompleteAnimes(query, esFiltro, orden = { "fechaUltCapVisto": -1 }) {
		return new Promise((resolve, reject) => {
			let queryReg = this.escaparQuery(query);
			animesdb.find({ nombre: new RegExp(queryReg, 'i') }).sort(orden).exec(function (err, record) {
				if (err) {
					reject(new Error(err));
					process.exit(0);
				}
				if (esFiltro) {
					M.toast({
						html: `Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`,
						displayLength: 4000
					});
				}
				return resolve(record);
			});
		});
	}
	/**
	 * Busca solo los animes que coinciden con el query
	 * proporcionado. Se utiliza para los filtros.
	 * @param {string} query String a buscar.
	 * @param {any} esFiltro Opciones de busqueda.
	 * @param {any} orden Orden en se muestran las respuestas.
	 */
	filtrarBuscadorHistorial(query, opciones, orden) {
		return new Promise((resolve, reject) => {
			let queryReg = this.escaparQuery(query);
			animesdb
				.find({ $and: [{ nombre: new RegExp(queryReg, 'i') }, opciones] })
				.sort(orden)
				.exec(function (err, record) {
					if (err) {
						reject(new Error(err));
						process.exit(0);
					}
					M.toast({
						html: `Filtrando ${query == "" ? 'todo' : '"'+query+'"'}: ${record.length} resultados`,
						displayLength: 4000
					});
					return resolve(record);
				});
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
	 * 		- 3 - En pausa
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
		return new Promise((resolve, reject) => {
			animesdb.update({ "_id": id }, { $set: { "activo": true, "fechaEliminacion": null } }, function (err, numUpdate) {
				if (err) {
					reject(new Error(err));
					return;
				}
				return resolve(numUpdate);
			});
		});
	}
	/**
	 * Borra un anime por su id.
	 */
	borrarAnime(id) {
		return new Promise((resolve, reject) => {
			animesdb.remove({ _id: id }, {}, function (err, numRemoved) {
				if (err) {
					reject(new Error(err));
					process.exit(0);
				}
				return resolve(numRemoved);
			});
		});
	}
}

exports.BDAnimes = BDAnimes;
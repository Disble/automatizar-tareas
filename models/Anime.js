/**
 * Representa todos los datos de la Base de Datos
 * correspondientes a un Anime.
 */
class Anime {
  /**
   * Representa un Anime.
   * @constructor
   * @param {number} orden Orden de los capitulos.
   * @param {string} nombre Nombre del anime.
   * @param {string} dia Dia en que se ve el anime, no necesariamente de la semana.
   * @param {number} nrocapvisto Número de capitulos vistos.
   * @param {number} totalcap Número total de capitulos.
   * @param {number} tipo Tipo de anime: 
   *    - 0 - TV
   *    - 1 - Película
   *    - 2 - Especial
   *    - 3 - OVA.
   * @param {string} pagina Pagina de descarga del animes, también se puede almacenar otro datos.
   * @param {string} carpeta Ubicación en disco del anime.
   * @param {number} estado Estado actual del anime: 
   *    - 0 - Viendo
   *    - 1 - Finalizado
   *    - 2 - No me gusto
   * @param {boolean} activo Representa si el anime es visible o no en las listas para ver animes.
   * @param {Date} fechaCreacion Fecha en la que se creo el anime.
   * @param {Date} fechaUltCapVisto Fecha en la que se marco el último capitulo visto.
   * @param {Date} fechaEliminacion Fecha en la que se elimino de las listas para ver animes.
   * @param {string} _id Identificador único por anime.
   */
  constructor(orden, nombre, dia, nrocapvisto, totalcap, tipo, pagina, carpeta, estado, activo, fechaCreacion, fechaUltCapVisto, fechaEliminacion, _id = "") {
    this.orden = orden;
    this.nombre = nombre;
    this.dia = dia;
    this.nrocapvisto = nrocapvisto;
    this.totalcap = totalcap;
    this.tipo = tipo;
    this.pagina = pagina;
    this.carpeta = carpeta;
    this.estado = estado;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.fechaUltCapVisto = fechaUltCapVisto;
    this.fechaEliminacion = fechaEliminacion;
    if (_id !== "") {
      this._id = _id;
    }
  }
}

exports.Anime = Anime;

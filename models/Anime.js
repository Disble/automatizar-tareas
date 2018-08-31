class Anime {
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

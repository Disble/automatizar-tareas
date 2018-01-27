class Pendiente {
    constructor(nombre, detalle, orden, pagina = null, activo = true, fechaFin = null, fechaCreacion = new Date) {
        this.nombre = nombre
        this.detalle = detalle
        this.orden = orden
        this.pagina = pagina
        this.activo = activo
        this.fechaFin = fechaFin
        this.fechaCreacion = fechaCreacion
    }

    set nombre() {
      this.nombre = nombre
    }

    get nombre() {
      return this.nombre
    }
}

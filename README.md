# Automatizador de Tareas (Nombre Provisional)

## Descripción y contexto
---

Esta aplicación tiene como principio la sencillez y accesibilidad de uso, ayudando al usuario con un sistema de control rápido y seguro. O como el lema que precede a esta aplicación dice.

>Apoyando la vagancia desde tiempos inmemoriales.

Enfocada principalmente como un Sistema de Control de Capítulos (o SCC siglas que acabo de inventar) de animes vistos. Teniendo un ciclo completo (agregar, ver, editar, borrar) en su presente versión Alpha.

Como parte del programa, diseñado al comienzo del desarrollo se presentarán como mínimo las siguientes funciones en la versión reléase 1.0.0. De las cuales actualmente ya se tienen cumplidas las siguientes funciones (sujetos a posibles cambios).

- **Lista de Animes (enlazado a carpetas y web)**
 - [x] Agregar
 - [x] Editar
 - [x] Ver
 - [x] Borrar (no permanente)
 - [x] Cambiar estado (finalizado, viendo, no me gusto)
- **Lista de Pendientes (solo como lista)**
 - [ ] Agregar
 - [ ] Editar
 - [ ] Ver
 - [ ] Borrar
- **Estadisticas**
 - [x] Historial de Animes vistos (todos)
    - Datos por anime
    - Borrar (permanente)
 - [x] Gráfica de capítulos vistos de todos los animes (viendo)

- [ ] **Alternar entre tema claro y oscuro**

### Características escondidas por Función
- **Lista de Animes**
 - [x] Si se guarda como página la url de la misma, se activa un link de redirección externo.
 - [x] No se necesita poner tíldes, ni mayúsculas a los días de la semana.

## Guía de usuario
---
Explica los pasos básicos sobre cómo usar la herramienta digital. Es una buena sección para mostrar capturas de pantalla o gifs que ayuden a entender la herramienta digital.

## Guía de instalación
---
Primero, se necesita tener instalado [nodejs](https://nodejs.org/en/download/) y [git](https://git-scm.com/downloads) para utilizar esta aplicación (al menos en versiones pre-release), recomiendo instalarlos desde su página oficial pero también hay otras páginas que dan mayores facilidades dependiendo del sistema operativo, la instalación es relativamente sencilla.

Una vez instalados, abrir la terminal, ir al lugar donde planea guardar la aplicación y ejecutar los siguientes comandos.

    git clone https://gitlab.com/Disble/automatizar-tareas.git
    npm install
    npm start

## Autor/es
---
Proyecto creado por [Disble](decoder@hotmail.es).

## Información adicional
---
Es fácil recordar una vez a la semana “Cierto hoy tengo que ver el nuevo capítulo de [agregue nombre de su anime favorito aquí]”, pero la situación cambia cuando se ven muchos animes por semana (yo he llegado a los 16 por semana), muchas veces, por día y a eso hay que sumarle que no siempre salen todos los animes en su página de descargas favorita y uno tiene que buscar en varias páginas para encontrar el capítulo deseado.

Es por esto y que me gusta apoyar a la vagancia (es el lema del proyecto) que he decidido hacer una aplicación que ayude a administrar todas estas variantes o como me gusta llamarlo Sistema de Control de Capítulos (o SCC) para enfocarse en lo que verdaderamente importa.

Ver anime.

## Versiones
---
Las versiones de esta aplicación fueron creadas basándose en [Versionado Semántico](http://semver.org/).

## Licencia
---
Este proyecto está bajo la licencia [MIT](./blob/master/LICENSE) que esta adjuntado en el mismo.

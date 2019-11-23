const conn = require('../lib/conexionbd');

// Ejecuta la query que le sea pasada por parametro, en caso de falla
// muestra por consola que fallo desde la query que se le paso por parametro
// y retorna el valor 500 para ser devuelto en el status al front-end
const ejecutarQuery = (query, descripcion) => {
  return new Promise ((resolve, reject) => {
    conn.query(query, (error, resultado, campos) => {
      if(error){
        console.log(`Hubo un error en la consulta para obtener ${descripcion}`, error.message);
        reject(error)
        return 500;
      }
      resolve(resultado);
    });
  });
};


// Se obtienen las competencias de la BD
const obtenerCompetencias = async (req, res) => {

  const sql = `SELECT id, nombre FROM competencia`;
  const competencias = await ejecutarQuery(sql, 'las competencias');

  if(competencias===500){
    return res.status(500).send('Hubo un error en la consulta para obtener las competencias');
  }
  return res.status(200).send(JSON.stringify(competencias));
};


// Se obtienen las opciones por las que puede votar el usuario
const obtenerOpciones = async (req, res) => {

  const competenciaId = req.params.id;

  const sqlCompetencia = `SELECT competencia.nombre AS competencia, genero_id
                            FROM competencia
                            WHERE competencia.id = ${competenciaId};`;
  const competencia = await ejecutarQuery(sqlCompetencia, 'el nombre de la competencia');

  if(competencia.length===0){
    return res.status(404).send('No existe la competencia para el ID indicado');
  }

  const genero_id = competencia[0].genero_id;

  if(genero_id!==0){
    const sqlPeliculas = `SELECT pelicula.id, pelicula.poster, pelicula.titulo
                              FROM pelicula
                              JOIN competencia ON pelicula.genero_id = competencia.genero_id
                              WHERE pelicula.genero_id = ${genero_id}
                              ORDER BY RAND()
                              LIMIT 2;`;
    const peliculas = await ejecutarQuery(sqlPeliculas, 'las peliculas de la competencia');

    if(competencia===500 || peliculas===500){
      return res.status(500).send('Hubo un error en la consulta para obtener las opciones');
    }
    const respuesta = {
      "competencia": competencia[0].competencia,
      "peliculas": peliculas
    }
    return res.status(200).send(JSON.stringify(respuesta));
  }

  const sqlPeliculas = `SELECT pelicula.id, pelicula.poster, pelicula.titulo
                          FROM pelicula
                          JOIN pelicula_competencia ON pelicula.id = pelicula_competencia.pelicula_id
                          WHERE pelicula_competencia.competencia_id = ${competenciaId};`;
  const peliculas = await ejecutarQuery(sqlPeliculas, 'las peliculas de la competencia');

  if(competencia===500 || peliculas===500){
    return res.status(500).send('Hubo un error en la consulta para obtener las opciones');
  }
  const respuesta = {
    "competencia": competencia[0].competencia,
    "peliculas": peliculas
  }
  return res.status(200).send(JSON.stringify(respuesta));
};


// Suma un voto a la pelicula según la competencia en la que esté
const sumarVoto = async (req, res) => {

  const competenciaId = req.params.id;
  const peliculaId = req.body.idPelicula;

  sqlCompetenciaPelicula = `SELECT id FROM competencia WHERE id = ${competenciaId};` 
  const existeCompetencia = await ejecutarQuery(sqlCompetenciaPelicula, 'la compentencia');

  if(existeCompetencia.length===0){
    return res.status(404).send('No exite la competencia');
  }

  sqlCantidadVoto = `SELECT cantidad FROM voto WHERE competencia_id = ${competenciaId} AND pelicula_id = ${peliculaId};`;
  const cantidadDeVotos = await ejecutarQuery(sqlCantidadVoto, 'la cantidad de votos');

  if(cantidadDeVotos.length===0) {
    const sqlNuevoIdVoto = `SELECT id+1 AS id FROM voto ORDER BY id DESC LIMIT 1;`;
    const queryNuevoIdVoto = await ejecutarQuery(sqlNuevoIdVoto, 'el último ID de la tabla voto');

    if(queryNuevoIdVoto===500) {
      return res.status(500).send('No se pudo obtener nuevo id para hacer la insercion en la tabla voto');
    }
    
    const votoId = queryNuevoIdVoto[0].id;
    const sqlInsertarVoto = `INSERT INTO voto (id, cantidad, pelicula_id, competencia_id) VALUES (${votoId}, 1, ${peliculaId}, ${competenciaId});`;
    const queryInsertarVoto = await ejecutarQuery(sqlInsertarVoto, 'INSERTAR LA NUEVA FILA EN LA TABLA voto');
    
    if(queryInsertarVoto===500) {
      return res.status(500).send('No se pudo insertar el nuevo voto');
    }
    return res.status(200).send('Se sumo el voto a la pelicula');
  }

  const sqlActualizarCantidadVoto = `UPDATE voto SET cantidad = ${cantidadDeVotos[0].cantidad+1} WHERE competencia_id = ${competenciaId} AND pelicula_id = ${peliculaId};`;
  const queryActualizarCantidadVoto = await ejecutarQuery(sqlActualizarCantidadVoto, 'SUMAR UN PUNTO A LA CANTIADA DE VOTOS');

  if(queryActualizarCantidadVoto===500) {
    return res.status(500).send('No se pudo sumar el voto a la pelicula');
  }
  return res.status(200).send('Se sumo el voto a la pelicula');
};


// Se obtienen los resultados de las competencias
const obtenerResultados = async (req, res) => {
  
  const competenciaId = req.params.id;
  const sqlCompetencia = `SELECT nombre FROM competencia WHERE id = ${competenciaId}`;
  const competencia = await ejecutarQuery(sqlCompetencia, 'el nombre de la competencia');

  if(competencia===500){
    return res.status(500).send('Hubo un error en la consulta para obtener el nombre de la competencia');
  }
  if(competencia.length===0){
    return res.status(404).send('No existe la competencia');
  }

  const nombreCompetencia = competencia[0].nombre;

  const sqlVotos = `SELECT voto.pelicula_id, voto.cantidad AS votos, pelicula.poster, pelicula.titulo
                    FROM voto
                    JOIN pelicula ON pelicula.id = voto.pelicula_id
                    AND competencia_id = ${competenciaId}
                    ORDER BY voto.cantidad DESC
                    LIMIT 3;`

  const votos = await ejecutarQuery(sqlVotos, 'obtener las 3 peliculas con mas votos de la competencia');

  if(votos===500){
    return res.status(votos).send('Hubo un error en la consulta para obtener las 3 peliculas con mas votos de la competencia');
  }
  if(votos.length===0) {
    return res.status(404).send('No existe la competencia o no se ha votado en la misma');
  }
  
  const respuesta = {
    "competencia": nombreCompetencia,
    "resultados": votos
  }  
  return res.status(200).send(JSON.stringify(respuesta));
};


// Se obtienen todos los generos de las peliculas
const obtenerGeneros = async (req, res) => {
  const sql = `select id, nombre from genero;`;
  const generos = await ejecutarQuery(sql, 'los generos');

  if(generos===500){
    return res.status(500).send('Hubo un error en la consulta para obtener los generos');
  }
  if(generos.length===0){
    return res.status(404).send('No hay generos guardados');
  }
  return res.status(200).send(JSON.stringify(generos));
};


// Se obtienen todos los directores de las peliculas
const obtenerDirectores = async (req, res) => {
  const sql = `select id, nombre from director;`;
  const directores = await ejecutarQuery(sql, 'los directores');

  if(directores===500){
    return res.status(500).send('Hubo un error en la consulta para obtener los directores o no hay directores guardados');
  }
  if(directores.length===0){
    return res.status(404).send('No hay directores guardados');
  }
  return res.status(200).send(JSON.stringify(directores));
};


// Se obtienen todos los actores de las peliculas
const obtenerActores = async (req, res) => {
  const sql = `select id, nombre from actor;`;
  const actores = await ejecutarQuery(sql, 'los actores');

  if(actores===500){
    return res.status(500).send('Hubo un error en la consulta para obtener los actores');
  }
  if(actores.length===0){
    return res.status(404).send('No hay actores guardados');
  }
  return res.status(200).send(JSON.stringify(actores));
};


// Permite al usuario crear una competencia nueva
const crearCompetencia = async (req, res) => {
  console.log('Body', req.body);

  const nombreCompetencia = req.body.nombre;
  const generoId = parseInt(req.body.genero);
  const directorId = parseInt(req.body.director);
  const actorId = parseInt(req.body.actor);

  console.log('generoId',generoId, typeof generoId);
  console.log('directorId',directorId, typeof directorId);
  console.log('actorId',actorId, typeof actorId);
  
  if(nombreCompetencia==='' || nombreCompetencia===null || nombreCompetencia===undefined){
    return res.status(422).send('La competencia debe tener un nombre asignado');
  }

  const sqlExiste = `SELECT nombre FROM competencia WHERE competencia.nombre = '${nombreCompetencia}';`;
  const existeCompetencia = await ejecutarQuery(sqlExiste, 'competencia existente');

  if(existeCompetencia===500){
    return res.status(500).send('Hubo un error al consultar las competencias');
  }
  if(existeCompetencia.length!==0){
    return res.status(422).send('Ya existe una competencia con el nombre indicado');
  }
  
  if(directorId!==0 && generoId!==0){
    const sqlDirectorGenero = `SELECT COUNT(pelicula.id) AS cantidad
                                FROM pelicula
                                JOIN director ON pelicula.director = director.nombre
                                WHERE pelicula.genero_id = ${generoId};`;

    const existePelicula = await ejecutarQuery(sqlDirectorGenero, 'pelicula con genero y director');
    if (existePelicula===500) {
      return res.status(500).send('Hubo un erro al consultar si existen peliculas según el director y genero');
    }
    if(existePelicula[0].cantidad<2){
      return res.status(422).send('No existen suficientes peliculas del genero y director seleccionado como para crear una competencia');
    }
  }
  if(directorId!==0 && actorId!==0){
    const sqlDirectorActor = `SELECT COUNT(pelicula.id) AS cantidad
                                FROM pelicula
                                JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
                                JOIN director ON pelicula.director = director.nombre
                                WHERE actor_pelicula.actor_id = ${actorId}
                                  AND director.id = ${directorId};`;

    const existePelicula = await ejecutarQuery(sqlDirectorActor, 'pelicula con actor y director');
    if (existePelicula===500) {
      return res.status(500).send('Hubo un erro al consultar si existen peliculas según el director y actor');
    }
    if(existePelicula[0].cantidad<2){
      return res.status(422).send('No existen suficientes peliculas del actor y director seleccionado como para crear una competencia');    
    }
  }
  if(generoId!==0 && actorId!==0){
    const sqlGeneroActor = `SELECT COUNT(pelicula.id) AS cantidad
                              FROM pelicula
                              JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
                              WHERE actor_pelicula.actor_id = ${actorId}
                                AND pelicula.genero_id = ${generoId};`;

    const existePelicula = await ejecutarQuery(sqlGeneroActor, 'pelicula con genero y actor');
    if (existePelicula===500) {
      return res.status(500).send('Hubo un erro al consultar si existen peliculas según el genero y actor');
    }
    if(existePelicula[0].cantidad<2){
      return res.status(422).send('No existen suficientes peliculas del genero y actor seleccionado como para crear una competencia');
    }
  }
  if(directorId!==0 && generoId!==0 && actorId!==0){
    const sqlDirectorGeneroActor = `SELECT COUNT(pelicula.id) AS cantidad
                                      FROM pelicula
                                      JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
                                      JOIN director ON pelicula.director = director.nombre
                                      WHERE actor_pelicula.actor_id = ${actorId}
                                        AND pelicula.genero_id = ${generoId}
                                        AND director.id = ${generoId};`;

    const existePelicula = await ejecutarQuery(sqlDirectorGeneroActor, 'pelicula con genero, actor y director');
    if (existePelicula===500) {
      return res.status(500).send('Hubo un erro al consultar si existen peliculas según el director genero y actor');
    }
    if(existePelicula[0].cantidad<2){
      return res.status(422).send('No existen suficientes peliculas del actor, genero y director seleccionado como para crear una competencia');
    }
  }

  const sqlNuevoIdCompetencia = `SELECT id+1 AS id FROM competencia ORDER BY id DESC LIMIT 1;`;
  const queryNuevoIdCompetencia = await ejecutarQuery(sqlNuevoIdCompetencia, 'el último ID de la tabla competencia');

  if(queryNuevoIdCompetencia===500) {
    return res.status(500).send('No se pudo obtener nuevo id para hacer la insercion en la tabla competencia');
  }
  
  const competenciaId = queryNuevoIdCompetencia[0].id;
  const sqlInsertarCompetencia = `INSERT INTO competencia (id, nombre, genero_id, actor_id, director_id) VALUES (${competenciaId}, '${nombreCompetencia}', ${generoId}, ${actorId}, ${directorId});`;
  const queryInsertarCompetencia = await ejecutarQuery(sqlInsertarCompetencia, 'INSERTAR LA NUEVA FILA EN LA TABLA competencia');
  
  if(queryInsertarCompetencia===500) {
    return res.status(500).send('No se pudo insertar la nueva competencia');
  }
  return res.status(200).send('Se creo la competencia');
};


// Se eliminan los votos de la competencia según su ID
const eliminarVotos = async (req, res) => {
  
  const competenciaId = req.params.id;

  sqlCompetenciaPelicula = `SELECT id FROM competencia WHERE competencia.id = ${competenciaId};`;
  const existeCompetencia = await ejecutarQuery(sqlCompetenciaPelicula, 'la compentencia según su ID');

  if(existeCompetencia.length===0){
    return res.status(404).send('No exite la competencia');
  }

  const sqlReiniciarCantidadVoto = `UPDATE voto SET cantidad = 0 WHERE competencia_id = ${competenciaId};`;
  const queryReiniciarCantidadVoto = await ejecutarQuery(sqlReiniciarCantidadVoto, 'REINICIAR la cantidad de votos');

  if(queryReiniciarCantidadVoto===500) {
    return res.status(500).send('No se pudo reiniciar la cantidad de votos');
  }
  return res.status(200).send('Se reinicio la cantidad de votos');
};


module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones,
  sumarVoto: sumarVoto,
  obtenerResultados: obtenerResultados,
  obtenerGeneros: obtenerGeneros,
  obtenerDirectores: obtenerDirectores,
  obtenerActores: obtenerActores,
  crearCompetencia: crearCompetencia,
  eliminarVotos: eliminarVotos
};
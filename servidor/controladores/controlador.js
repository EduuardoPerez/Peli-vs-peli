const conn = require('../lib/conexionbd');

// Ejecuta la query que le sea pasada por parametro, en caso de falla
// muestra por consola que fallo desde la query que se le paso por parametro
// y retorna el valor 404 para ser devuelto en el status al front-end
const ejecutarQuery = (query, descripcion) => {
  return new Promise ((resolve, reject) => {
    conn.query(query, (error, resultado, campos) => {
      if(error){
        console.log(`Hubo un error en la consulta para obtener ${descripcion}`, error.message);
        reject(error)
        return 404;
      }
      resolve(resultado);
    });
  });
};


// Se obtienen las competencias de la BD
const obtenerCompetencias = async (req, res) => {

  const sql = `SELECT id, nombre FROM competencia`;
  const competencias = await ejecutarQuery(sql, 'las competencias');

  if(competencias===404){
    return res.status(competencias).send('Hubo un error en la consulta para obtener las competencias');
  }
  res.send(JSON.stringify(competencias));
};


// Se obtienen las opciones por las que puede votar el usuario
const obtenerOpciones = async (req, res) => {

  const competenciaId = req.params.id;

  const sqlCompetencia = `SELECT competencia.nombre AS competencia
                            FROM competencia
                            WHERE competencia.id = ${competenciaId};`;

  const sqlPeliculas = `SELECT pelicula.id, pelicula.poster, pelicula.titulo
                          FROM pelicula
                          JOIN pelicula_competencia ON pelicula.id = pelicula_competencia.pelicula_id
                          WHERE pelicula_competencia.competencia_id = ${competenciaId};`;

  const competencia = await ejecutarQuery(sqlCompetencia, 'el nombre de la competencia');
  const peliculas = await ejecutarQuery(sqlPeliculas, 'las peliculas de la competencia')

  if(competencia===404 || peliculas===404){
    return res.status(opciones).send('Hubo un error en la consulta para obtener las opciones');
  }
  const respuesta = {
    "competencia": competencia[0].competencia,
    "peliculas": peliculas
  }  
  res.send(JSON.stringify(respuesta));
};

module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones
};
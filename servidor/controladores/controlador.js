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
    return res.status(competencia).send('Hubo un error en la consulta para obtener las competencias');
  }
  res.send(JSON.stringify(competencias));
};


// Se obtienen las opciones por las que puede votar el usuario
const obtenerOpciones = async (req, res) => {

  const peliculaId = req.params.id;

  const sql = `SELECT competencia.nombre AS competencia, pelicula.id, pelicula.poster, pelicula.titulo
                FROM competencia
                JOIN pelicula_competencia ON competencia.id = pelicula_competencia.competencia_id
                JOIN pelicula ON pelicula.id = pelicula_competencia.pelicula_id
                WHERE pelicula_competencia.competencia_id = ${peliculaId};`

  const opciones = await ejecutarQuery(sql, 'opciones por las que puede votar el usuario');
  console.log(opciones);
  
  
};

module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones
};
const conn = require('../lib/conexionbd');

// Se obtienen las competencias de la BD
const obtenerCompetencias = (req, res) => {

  const sql = `SELECT id, nombre FROM competencia`;

  conn.query(sql, (error, resultado) => {    
    if(error){
      console.log('Hubo un error en la consulta para obtener las competencias', error.message);
      return res.status(404).send('Hubo un error en la consulta para obtener las competencias');
    }
    res.send(JSON.stringify(resultado));
  });
};


module.exports = {
  obtenerCompetencias: obtenerCompetencias
};
CREATE TABLE `competencia` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `competencia` 
VALUES (1,'¿Cuál es la mejor comedia?'),
	   (2,'¿Cuál es el peor drama?'),
       (3,'¿Cuál es la mejor película de Sandra Bullock?'),
       (4,'¿Cuál es la mejor película de Steven Spielberg?'),
       (5,'¿Cuál es la mejor película de Di Caprio?'),
       (6,'¿Cuál es la película de terror que más te asustó?'),
       (7,'¿Cuál es la película con peores efectos especiales?'),
       (8,'¿Cuál es la película que más te hizo reir?'),
       (9,'¿Qué película de Transformers prefieres?');
       

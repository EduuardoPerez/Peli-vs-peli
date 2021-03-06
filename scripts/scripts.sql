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


CREATE TABLE `competencias`.`pelicula_competencia` (
  `id` INT NOT NULL,
  `pelicula_id` INT NOT NULL,
  `competencia_id` INT NOT NULL,
  PRIMARY KEY (`id`));


INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('1', '50', '1');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('2', '300', '1');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('3', '200', '2');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('4', '100', '2');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('5', '350', '3');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('6', '700', '3');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('7', '125', '4');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('8', '255', '4');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('9', '198', '5');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('10', '457', '5');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('11', '359', '6');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('12', '654', '6');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('13', '352', '7');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('14', '706', '7');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('15', '214', '8');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('16', '176', '8');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('17', '232', '9');
INSERT INTO `competencias`.`pelicula_competencia` (`id`, `pelicula_id`, `competencia_id`) VALUES ('18', '678', '9');


CREATE TABLE `competencias`.`voto` (
  `id` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 0,
  `pelicula_id` INT NOT NULL,
  `competencia_id` INT NOT NULL,
  PRIMARY KEY (`id`));


ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `genero_id` INT NULL AFTER `nombre`;


UPDATE `competencias`.`competencia` SET `genero_id` = '5' WHERE (`id` = '1');
UPDATE `competencias`.`competencia` SET `genero_id` = '8' WHERE (`id` = '2');
UPDATE `competencias`.`competencia` SET `genero_id` = '0' WHERE (`id` = '3');
UPDATE `competencias`.`competencia` SET `genero_id` = '0' WHERE (`id` = '4');
UPDATE `competencias`.`competencia` SET `genero_id` = '0' WHERE (`id` = '5');
UPDATE `competencias`.`competencia` SET `genero_id` = '10' WHERE (`id` = '6');
UPDATE `competencias`.`competencia` SET `genero_id` = '0' WHERE (`id` = '7');
UPDATE `competencias`.`competencia` SET `genero_id` = '5' WHERE (`id` = '8');
UPDATE `competencias`.`competencia` SET `genero_id` = '0' WHERE (`id` = '9');
UPDATE `competencias`.`competencia` SET `genero_id` = '3' WHERE (`id` = '10');


ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `director_id` INT NULL DEFAULT 0 AFTER `genero_id`,
ADD COLUMN `actor_id` INT NULL DEFAULT 0 AFTER `director_id`,
CHANGE COLUMN `genero_id` `genero_id` INT(11) NULL DEFAULT 0 ;

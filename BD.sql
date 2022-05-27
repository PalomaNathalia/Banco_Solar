-- CREAR BASE DE DATOS
CREATE DATABASE bancosolar;
\c bancosolar;
-- CREAR TABLA USUARIOS
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

-- CREAR TABLA TRANSFERENCIAS
CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));


SELECT fecha, e.nombre, r.nombre, monto FROM transferencias AS u INNER JOIN usuarios AS e ON u.emisor = e.id INNER JOIN usuarios AS r ON u.receptor = r.id

ALTER TABLE usuarios ADD estado BOOLEAN;
ALTER TABLE usuarios DROP COLUMN estado;
ALTER TABLE usuarios ADD estado BOOLEAN DEFAULT true;
UPDATE usuarios SET estado = true;


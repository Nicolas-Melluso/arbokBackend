# ArbokMovies (backend)

Proyecto creado para el Skill Factory de Avalith, en el que desarrollamos una aplicación web para ver películas con su descripción y agregarlas a favoritos. Cuenta con dos tipos de usuarios: administrador y cliente. El administrador puede agregar las películas que el cliente verá, estas peliculas vienen de la API de themoviedb. Front-end desarrollado con ReactJS, backend desarrollado con NodeJS.

### Requisitos

Para poder visualizar el proyecto correctamente, es necesario instalar ciertas cosas en nuestra computadora.

```
Node.js
Redis
MySql
```

### Instalación

Luego de instalar estas cosas en nuestro sistema, debemos posicionarnos con la consola en la carpeta donde tenemos el proyecto y ejecutar el siguiente comando:

```
npm install
```
Luego de esto, es necesario en MYSQL crear la base de datos, la misma está mostrada en este esquema:

```
CREATE DATABASE arbok_movies;
USE arbok_movies;

CREATE TABLE users
(id INT AUTO_INCREMENT,
username VARCHAR (30) UNIQUE,
pass VARCHAR (255),
role INT,
CONSTRAINT pk_id_user PRIMARY KEY (id));

INSERT INTO	users (username,pass,role) VALUES ("flor", "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", 1);
INSERT INTO	users (username, pass, role) VALUES ("leo","a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", 1);
INSERT INTO	users (username,pass, role) VALUES ("martin","a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", 2);

CREATE TABLE movies
(id INT AUTO_INCREMENT,
title VARCHAR(255),
description TEXT,
image VARCHAR(255),
CONSTRAINT pk_id_movie PRIMARY KEY(id));

CREATE TABLE genres
(id INT AUTO_INCREMENT,
name VARCHAR(30),
CONSTRAINT pk_id_genre PRIMARY KEY(id));

INSERT INTO genres (id,name) VALUES (12, "Adventure");
INSERT INTO genres (id,name) VALUES (14,"Fantasy");
INSERT INTO genres (id,name) VALUES (16,"Animation");
INSERT INTO genres (id,name) VALUES (18,"Drama");
INSERT INTO genres (id,name) VALUES (27,"Horror");
INSERT INTO genres (id,name) VALUES (28,"Action");
INSERT INTO genres (id,name) VALUES (35,"Comedy");
INSERT INTO genres (id,name) VALUES (36,"History");
INSERT INTO genres (id,name) VALUES (37,"Western");
INSERT INTO genres (id,name) VALUES (53,"Thriller");
INSERT INTO genres (id,name) VALUES (80,"Crime");
INSERT INTO genres (id,name) VALUES (99,"Documentary");
INSERT INTO genres (id,name) VALUES (878,"Science Fiction");
INSERT INTO genres (id,name) VALUES (9648,"Mystery");
INSERT INTO genres (id,name) VALUES (10402,"Music");
INSERT INTO genres (id,name) VALUES (10749,"Romance");
INSERT INTO genres (id,name) VALUES (10751,"Family");
INSERT INTO genres (id,name) VALUES (10752,"War");
INSERT INTO genres (id,name) VALUES (10770,"TV Movie");

CREATE TABLE movie_user( 
id_user INT,
id_movie INT,
PRIMARY KEY (id_user,id_movie),
CONSTRAINT FOREIGN KEY fk_id_user (id_user) REFERENCES users (id) ON DELETE CASCADE,
CONSTRAINT FOREIGN KEY fk_id_movie (id_movie) REFERENCES movies (id) ON DELETE CASCADE );

CREATE TABLE genre_movie( 
id_genre INT,
id_movie INT,
PRIMARY KEY (id_genre, id_movie),
CONSTRAINT FOREIGN KEY fk_id_genre (id_genre) REFERENCES genres (id) ON DELETE CASCADE,
CONSTRAINT FOREIGN KEY fk_id_movie2 (id_movie) REFERENCES movies (id) ON DELETE CASCADE );
```

De esta forma, terminaremos de instalar todo lo que requiere nuestro proyecto. :+1:

### Inicialización

Para inicialiarlo podremos escribir por consola el comando "nodemon server/server.js" o bien optar por el script personalizado -> "npm run watch" que hace exactamente lo mismo.

## Endpoints

### GET

#### Películas

Lista de películas que el administrador cargó para que el usuario vea
`/movies/`

Pelicula buscada por ID
`/movies/:id`

Lista de peliculas y los usuarios que las marcaron como favoritos
`/movies/favorites`

Película buscada por título
`/movies/title/:title`

Película buscada por titulo en la API de themoviedb
`/movies/nameapi/:movie`

Películas traídas de la API de themoviedb para que vea el administrador
`/movies/fill/:page`

#### Géneros

Lista de todos los géneros
`/genres/`

Genero buscado por ID
`/genres/:id/`

Géneros con sus películas
`/genres/movies`

#### Usuarios

Lista de todos los usuarios
`/users/`

Usuario buscado por ID
`/users/:id`

Peliculas favoritas del usuario buscado por ID
`/users/:id/favorites`

Todos los usuarios de cierto rol
`/users/role/:role`

Todos los usuarios separados por rol
`/users/split`

Usuario en sesión
`/users/getUser`

### POST

#### Películas

`/movies/`
Añade una nueva película, a ésta se le debe pasar por medio del body los atributos `title`, `description`, `image` y el id de los `genre`. Por ejemplo:

```
    {
      title: "Sonic",
      description: "Erizo",
      image: "/1.jpg",
      genres: [{id: 1}]
     }
```

#### Usuarios

`/users/`
Añade un nuevo usuario, se le debe pasar por medio del body los atributos `username`, `pass`, `role`. Por ejemplo:

```
    {
      username: "florencia123",
      pass: "1234",
      role: "1"
     }
```

`/users/login`
Hace que un usuario inicie sesión, se le debe pasar por medio del body el `username` y la `pass`.

`/users/logout`
Cierra sesión del usuario, se le debe pasar por medio del body el `token`.

`/users/:id/movie/:movie`
Añade una película a los favoritos de cierto usuario, se le debe pasar por URL el `id` del usuario y el id de la `movie`.

#### Géneros

`/genres/`
Añade un nuevo genero, se le debe pasar por medio del body el atributo `name`. Por ejemplo:

```
    {
      name: "Fantasía"
     }
```

`/genres/:id/movie/:movie`
Añade a una pélicula cierto genero. Se deben pasar por URL el `id` del género y el id de la `movie`.

### PUT

#### Users

`/users/updatepassword/`
Cambia la contraseña, se debe pasar por medio del body el `id` del usuario al que se le va a cambiar la contrasña y la nueva contraseña (`pass`).

#### Movies

`/movies/`
Cambia los datos de la pelicula, se debe pasar por medio del body el `id` de la pelicula, su título, su descripción, sus generos.

### DELETE

#### Users

`/users/:id`
Elimina a un usuario con el `id` pasado por URL.

#### Genres

`/genres/:id`
Elimina a un genero con el `id` pasado por URL.

#### Movies

`/movies/:id`
Elimina a una película con el `id` pasado por URL.

`/movies/:id_movie/:id_genre`
Borra de la tabla intermedia en donde están los géneros por película una fila que coincida `id_movie` y `id_genre`.

### Frontend

Este es el repositorio del front end que utilizamos para este Backend => https://github.com/NicolasMitre/arbokFrontend

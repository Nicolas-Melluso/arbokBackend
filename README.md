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
      name: "Sonic",
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

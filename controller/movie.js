const db = require("../config/config_mysql");
const fetch = require("node-fetch");
const keyApi = "ce62b7f668a97b07e6d58a85df75641b";

/* GET METHODS */

//VIEW ALL THE MOVIES WITH THEIR ATTRIBUTES
const viewAll = (req, res) => {
  db.query("SELECT m.id, m.title, m.description, m.image FROM movies m;", function(err, movieRows) {
    if (err) throw err;
    db.query(
      ` SELECT
        m.id as "movie_id",
        g.id as "genre_id",
        g.name AS "genre"
      from
        movies m
      JOIN genre_movie gm ON
        (gm.id_movie = m.id)
      JOIN genres g ON
        (g.id = gm.id_genre)`,
      function(err, genreRows) {
        if (err) throw err;

        movieRows.forEach(movie => {
          movie.genres = [];
          genreRows.map(genre => {
            if (movie.id === genre.movie_id) {
              const gen = {
                id: genre.genre_id,
                name: genre.genre
              };

              movie.genres.push(gen);
            }
          });
        });
        res.send(movieRows);
      }
    );
  });
};

//VIEW ONLY ONE MOVIE WITH ITS ATTRIBUTES BY ID, THE ID IS OBTEINED FROM THE URL
const viewByID = (req, res) => {
  const sql =
    "SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image' FROM movies AS m WHERE m.id=?;";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

const searchMovieByNameDB = (req, res) => {
  const nameMovie = req.params.movie;
  const sql =
    "SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image' FROM movies AS m WHERE m.title=?;";
  db.query(sql, [nameMovie], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

//VIEW ONLY ONE MOVIE WITH ITS ATTRIBUTES BY TITLE, THE TITLE IS OBTEINED FROM THE URL
const searchByTitle = (req, res) => {
  const sql =
    "SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image' FROM movies AS m WHERE m.title=?;";
  db.query(sql, [req.params.title], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

//VIEW ALL MOVIES WITH THE PERSON WHO MARKED THEM AS FAV
const viewMoviesFavorites = (req, res) => {
  const sql =
    "SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image', u.username AS 'user' FROM movies AS m INNER JOIN users AS u INNER JOIN movie_user AS mu ON mu.id_user=u.id AND mu.id_movie=m.id ORDER BY user;";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

const searchMovieByNameAPI = async (req, res) => {
  const page = req.params.page;
  const nameMovie = req.params.movie;

  const apiCall = `https://api.themoviedb.org/3/search/movie?api_key=${keyApi}&query=${nameMovie}&page=${page}&region=AR&include_adult=false&language=es-ES`;
  const response = await fetch(apiCall);
  const data = await response.json();
  res.json(data.results);
};

const fillAdminAdd = async (req, res) => {
  const keyApi = "ce62b7f668a97b07e6d58a85df75641b";
  const page = req.params.page;

  const apiCall = `https://api.themoviedb.org/3/movie/popular?api_key=${keyApi}&page=${page}&region=AR`;
  const response = await fetch(apiCall);
  const data = await response.json();
  res.json(data);
};

/* POST METHODS */

//INSERTS A NEW MOVIE IN THE TABLE

const addNewData = (req, res) => {
  const { title, description, image, genres } = req.body;
  let sql = "INSERT INTO movies (title, description, image) VALUES (?, ?, ?);";
  db.query(sql, [title, description, image], (err, data) => {
    if (err) throw err;
    genres.forEach(genre => {
      sql =
        "INSERT INTO genre_movie (id_genre, id_movie) VALUES (?, (SELECT id from movies WHERE title=? AND description=?  LIMIT 1))";
      db.query(sql, [genre.id, title, description, image], (err, data) => {
        if (err) throw err;
      });
    });
  });

  res.status(201).json("Creado");
};

/* DELETE METHODS */

// DELETES ONE MOVIE BY ID
const deleteByID = (req, res) => {
  const sql = "DELETE FROM movies WHERE id=?;";
  db.query(sql, [req.params.id], (error, results) => {
    if (error) return console.error(error.message);
    res.json(results.affectedRows);
  });
};

//DELETES A MOVIE_GENRE ROW BY ID
const deleteGenreMovieByID = (req, res) => {
  const sql = "DELETE FROM genre_movie WHERE id_genre=? AND id_movie=?;";
  db.query(sql, [req.params.id_genre, req.params.id_movie], (error, results) => {
    if (error) return console.error(error.message);
    res.json(results.affectedRows);
  });
};

/* PUT METHODS */

// SETS NEW VALUES FOR A MOVIE
const upgrade = (req, res) => {
  const { id, title, description, image } = req.body;
  const sql = "UPDATE movies SET title = ?, description = ?, image = ? WHERE id = ?;";
  db.query(sql, [title, description, image, id], function(err, result) {
    if (err) throw err;
    res.json(result.affectedRows);
  });
};

module.exports = {
  viewAll,
  viewByID,
  searchMovieByNameDB, //from db
  searchMovieByNameAPI, //from api
  searchByTitle,
  viewMoviesFavorites,
  fillAdminAdd,
  addNewData,
  deleteByID,
  deleteGenreMovieByID,
  upgrade
};

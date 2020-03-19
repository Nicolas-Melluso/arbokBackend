const db = require("../config/config_mysql");

/* GET METHODS */

//VIEW ALL THE GENRES WITH THEIR ATTRIBUTES
const viewAll = (req, res) => {
  const sql = "SELECT g.id AS 'id', g.name AS 'name' FROM genres AS g;";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

//VIEW ONLY ONE GENRE WITH ITS ATTRIBUTES BY ID, THE ID IS OBTEINED FROM THE URL
const viewByID = (req, res) => {
  const sql = "SELECT g.id AS 'id', g.name AS 'genre' FROM genres AS g WHERE g.id=?;";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

// //VIEW ALL GENRES WITH THEIR MOVIES
const viewGenresMovies = (req, res) => {
  const sql =
    "SELECT g.id AS 'id', g.name AS 'genre', m.title AS 'movie' FROM genres AS g INNER JOIN movies AS m INNER JOIN genre_movie AS gm ON gm.id_genre=g.id AND gm.id_movie=m.id ORDER BY genre;";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
};

/* POST METHODS */

//INSERTS A NEW GENRE IN THE TABLE

const addNewData = (req, res) => {
  const { name } = req.body;
  let sql = "INSERT INTO genres (name) VALUES (?)";
  db.query(sql, [name], (err, data) => {
    if (err) throw err;
    res.json(data);
  });
};

//INSERTS ONE ROW IN THE TABLE GENRE_MOVIE
const addMovieToGenre = (req, res) => {
  const sql = "INSERT INTO genre_movie (id_genre, id_movie) VALUES (?, ?)";
  db.query(sql, [req.params.id, req.params.movie], (err, data) => {
    if (err) throw err;
    res.json(data);
  });
};

/* DELETE METHODS */

// DELETES ONE GENRE BY ID
const deleteByID = (req, res) => {
  let sql = "DELETE FROM genres WHERE id=?;";
  db.query(sql, [req.params.id], (error, results) => {
    if (error) return console.error(error.message);
    res.json(results.affectedRows);
  });
};

module.exports = {
  viewAll,
  viewByID,
  viewGenresMovies,
  addNewData,
  deleteByID,
  addMovieToGenre
};

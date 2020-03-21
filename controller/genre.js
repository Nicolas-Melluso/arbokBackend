const db = require("../config/config_mysql");

/* GET METHODS */

//VIEW ALL THE GENRES WITH THEIR ATTRIBUTES
const viewAll = (req, res) => {
  const sql = "SELECT g.id AS 'id', g.name AS 'name' FROM genres AS g;";
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not genres found");
    }
    res.status(200).json(rows);
  });
};

//VIEW ONLY ONE GENRE WITH ITS ATTRIBUTES BY ID, THE ID IS OBTEINED FROM THE URL
const viewByID = (req, res) => {
  const sql = "SELECT g.id AS 'id', g.name AS 'genre' FROM genres AS g WHERE g.id=?;";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not genre found with that ID");
    }
    res.status(200).json(rows);
  });
};

// //VIEW ALL GENRES WITH THEIR MOVIES
const viewGenresMovies = (req, res) => {
  const sql =
    "SELECT g.id AS 'id', g.name AS 'genre', m.title AS 'movie' FROM genres AS g INNER JOIN movies AS m INNER JOIN genre_movie AS gm ON gm.id_genre=g.id AND gm.id_movie=m.id ORDER BY genre;";
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not movie/genre combinations found");
    }

    res.status(200).json(rows);
  });
};

/* POST METHODS */

//INSERTS A NEW GENRE IN THE TABLE

const addNewData = (req, res) => {
  const { name } = req.body;
  let sql = "INSERT INTO genres (name) VALUES (?)";
  db.query(sql, [name], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't add the Genre");
    }
    const { insertId } = results;
    res.status(200).json({ id: insertId, name: name });
  });
};

//INSERTS ONE ROW IN THE TABLE GENRE_MOVIE
const addMovieToGenre = (req, res) => {
  const sql = "INSERT INTO genre_movie (id_genre, id_movie) VALUES (?, ?)";
  db.query(sql, [req.params.id_genre, req.params.id_movie], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't add the genre/movie relation");
    }
    res.status(200).json({ id_genre: req.params.id_genre, id_movie: req.params.id_movie });
  });
};

/* DELETE METHODS */

// DELETES ONE GENRE BY ID
const deleteByID = (req, res) => {
  console.log("atrpdem",req.params.id);
  
  let sql = "DELETE FROM genres WHERE id=?;";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't delete the genre");
    }
    res.status(200).send("Genre deleted successfully");
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

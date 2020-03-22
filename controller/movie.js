const db = require("../config/config_mysql");
const fetch = require("node-fetch");
const apiKey = process.env.API_KEY;

/* GET METHODS */

//VIEW ALL THE MOVIES WITH THEIR ATTRIBUTES
const viewAll = (req, res) => {
  db.query(
    "SELECT m.id, m.title, m.description, m.image FROM movies m;",
    function(err, movieRows) {
      if (err) {
        res.status(500).send("Internal error.");
        throw err;
      }

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
          if (err) {
            res.status(500).send("Internal error.");
            throw err;
          }

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
          if (!movieRows.length) {
            return res.status(400).send("Not movies found.");
          }
          res.send(movieRows);
        }
      );
    }
  );
};

//VIEW ONLY ONE MOVIE WITH ITS ATTRIBUTES BY ID, THE ID IS OBTEINED FROM THE URL
const viewByID = (req, res) => {
  const sql =
    "SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image' FROM movies AS m WHERE m.id=?;";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).send("Internal error.");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not movie found according to that id.");
    }
    const result = rows[0];
    res.json(result);
  });
};

const searchMovieByNameDB = (req, res) => {
  const movie_name = req.params.movie_name;

  const sql = `SELECT m.id AS 'id', m.title AS 'title', m.description AS 'description', m.image AS 'image' FROM movies AS m WHERE m.title LIKE '%${movie_name}%';`; //Wont work with "?" instead
  db.query(sql, [movie_name], (err, rows) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not movie found according to that title");
    }
    res.json(rows);
  });
};

//VIEW ALL MOVIES WITH THE PERSON WHO MARKED THEM AS FAV
const viewMoviesFavorites = (req, res) => {
  const sql =
    "SELECT m.id AS 'id_movie', m.title AS 'title', m.description AS 'description', m.image AS 'image', u.username AS 'user' FROM movies AS m INNER JOIN users AS u INNER JOIN movie_user AS mu ON mu.id_user=u.id AND mu.id_movie=m.id ORDER BY user;";
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (rows && !rows.length) {
      return res.status(400).send("Not movie marked as favorites");
    }
    res.json(rows);
  });
};

const searchMovieByNameAPI = async (req, res) => {
  const { page, movie_name } = req.params;

  const apiCall = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${movie_name}&page=${page}&include_adult=false&region=AR`;
  const response = await fetch(apiCall).catch(() => {
    return res.status(500).send("Internal error");
  });
  const data = await response.json();
  if (data.results && !data.results.length) {
    return res.status(400).send("Not movies found according to that name");
  }
  res.json(data.results);
};

const fillAdminAdd = async (req, res) => {
  const page = req.params.page;

  const apiCall = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&region=AR`;
  const response = await fetch(apiCall).catch(() => {
    return res.status(500).send("Internal error");
  });
  const data = await response.json();
  if (data.results && !data.results.length) {
    return res.status(400).send("Not movies found");
  }
  if (data.errors) {
    return res.status(404).send("Page not found. Can't search beyond page 500");
  }
  res.json(data);
};

/* POST METHODS */

// const addNewData = (req, res) => {
//   const { title, description, image, genres } = req.body;

//   let sql = "INSERT INTO movies (title, description, image) VALUES (?, ?, ?);";
//   db.query(sql, [title, description, image], (err, results) => {
//     if (err) {
//       res.status(500).send("Internal error");
//       throw err;
//     }
//     const { insertId } = results;
//     genres.forEach((genre, i) => {
//       let sql = `INSERT INTO genre_movie (id_genre, id_movie) VALUES (?, ${insertId})`;
//       db.query(sql, [genre.id, title], (err, data) => {
//         if (err) {
//           res.status(500).send("Internal error");
//           throw err;
//         } else if (i === genres.length - 1) res.status(201).send("Movie Succesfully added!");
//       });
//     });
//   });
// };

const addNewData = (req, res) => {
  const { title, description, image, genres } = req.body;

  let sql = "INSERT INTO movies (title, description, image) VALUES (?, ?, ?);";
  db.query(sql, [title, description, image], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    const { insertId } = results;

    genres.forEach((genre, i) => {
      let sql = `INSERT INTO genre_movie (id_genre, id_movie) VALUES (?, ${insertId})`;
      db.query(sql, [genre.id, title], (err, data) => {
        if (err) {
          let sql = "DELETE FROM movies WHERE title=?";
          db.query(sql, [title], (err, data) => {
            if (err) {
              res.status(500).send("Couldn't rollback");
              throw err;
            } else {
              res.status(500).send("Error surged but rollback was executed");
              throw err;
            }
          });
        } else if (i === genres.length - 1) {
          res.status(201).send("Movie Succesfully added!");
        }
      });
    });
  });
};

/* DELETE METHODS */

// DELETES ONE MOVIE BY ID
const deleteByID = (req, res) => {
  const sql = "DELETE FROM movies WHERE id=?;";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res
        .status(400)
        .send("Didn't find any movie to remove with that ID");
    }
    res.status(200).send("Movie Succesfully removed!");
  });
};

//DELETES A MOVIE_GENRE ROW BY ID
const deleteGenreMovieByID = (req, res) => {
  const sql = "DELETE FROM genre_movie WHERE id_genre=? AND id_movie=?;";
  db.query(sql, [req.params.id_genre, req.params.id_movie], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res
        .status(400)
        .send(
          "Didn't find any movie/genre relation to remove with that criteria"
        );
    }
    res.status(200).send("Movie/Genre relation removed!");
  });
};

/* PUT METHODS */

// SETS NEW VALUES FOR A MOVIE
const update = (req, res) => {
  const { title, description, image } = req.body;
  const sql = `UPDATE movies SET title = ?, description = ?, image = ? WHERE id = ${req.params.id};`;
  db.query(sql, [title, description, image], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Didn't find any movie to edit with that ID");
    }
    res.json({
      id: res.params.id,
      title: title,
      description: description,
      image: image
    });
  });
};

module.exports = {
  viewAll,
  viewByID,
  searchMovieByNameDB, //from db
  searchMovieByNameAPI, //from api
  viewMoviesFavorites,
  fillAdminAdd,
  addNewData,
  deleteByID,
  deleteGenreMovieByID,
  update
};

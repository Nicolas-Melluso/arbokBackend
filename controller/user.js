const db = require("../config/config_mysql");
const crypto = require("crypto");
const util = require("../helper/util");
const redisService = require("../services/redis");

const register = (req, res) => {
  const { username, pass, role } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(pass)
    .digest("hex");

  const sql = `INSERT INTO users (username, pass, role) VALUES (?,?,?);`;
  db.query(sql, [username, hashedPassword, role], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't register the user");
    }

    res.status(200).json({ username: username, role: role });
  });
};

const getLoggedUser = (req, res) => {
  if (!req.session) {
    return res.status(400).send("Not logged session detected");
  }
  const user = req.session;
  user.pass = undefined;
  res.json(user);
};

const updatePassword = (req, res) => {
  const { newPassword, id } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(newPassword)
    .digest("hex");

  const sql = `UPDATE users SET pass = ? WHERE id=? ;`;
  db.query(sql, [hashedPassword, id], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't update the password");
    }

    res.status(200).send("Password was updated");
  });
};

const deleteUserById = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE from users WHERE id=? ;`;
  db.query(sql, [id], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't delete any user with that ID");
    }

    res.status(200).send("User deleted successfully");
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT id, username, pass, role FROM users WHERE id=? ;`;
  db.query(sql, [id], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.length) {
      return res.status(400).send("Not user found according to that ID");
    }
    const user = results[0];
    user.pass = undefined;
    res.status(200).json(user);
  });
};

const getUserByRole = (req, res) => {
  const { role } = req.params;

  const sql = `SELECT id, username, role FROM users WHERE role=? ;`;
  db.query(sql, [role], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.length) {
      return res.status(400).send("Not users found according to that criteria");
    }
    res.status(200).json(results);
  });
};

const getAllSplittedByRole = (req, res) => {
  const sql = `SELECT id, username, role FROM users;`;
  db.query(sql, function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.length) {
      return res.status(400).send("Not users found");
    }
    const normalUsers = results.filter(user => user.role === 2);
    const adminUsers = results.filter(user => user.role === 1);

    res.status(200).json(
      (users = {
        normalUsers: normalUsers,
        adminUsers: adminUsers
      })
    );
  });
};

const login = (req, res) => {
  const { username, pass } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(pass)
    .digest("hex");

  const sql = `SELECT id, username, pass, role FROM users WHERE username=? AND pass =?;`;
  db.query(sql, [username, hashedPassword], function(err, results) {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }

    if (results && !results.length) {
      return res.status(400).send("Wrong Username/Password Combination");
    }
    const token = util.generateString(28);
    const result = results[0];

    redisService.insert(`TOKEN_${token}`, JSON.stringify(result), 3000, err => {
      if (err) {
        return res.status(500).send(false);
      }
      const resp = {
        user: {
          id: result.id,
          username: result.username,
          role: result.role
        },
        access_token: token
      };

      res.send(resp);
    });
  });
};

const logout = (req, res, next) => {
  const { token } = req.body;

  redisService.delete(`TOKEN_${token}`, (err, results) => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }
    if (!results) {
      // 0 or 1
      return res.status(400).send("Logout failed");
    }

    return res.status(200).end("Logged out Successfully");
  });
};

const viewUserFavorites = (req, res) => {
  db.query(
    "SELECT m.id, m.title, m.description, m.image FROM movies m JOIN	movie_user mu ON (m.id = mu.id_movie) WHERE id_user = ?",
    [req.params.id],
    function(err, movieRows) {
      if (err) {
        res.status(500).send("Internal error");
        throw err;
      }
      if (movieRows && !movieRows.length) {
        return res.status(400).send("Not favorites movies found for that user ID");
      }
      db.query(
        ` SELECT
        m.id as "movie_id",
        g.id as "genre_id",
        g.name AS "genre"
      from
        movies m
      JOIN movie_user mu ON
        (m.id = mu.id_movie)
      JOIN genre_movie gm ON
        (gm.id_movie = m.id)
      JOIN genres g ON
        (g.id = gm.id_genre)
      WHERE
        m.id IN (
        SELECT
          id_movie
        from
          movie_user
        WHERE
          id_user = ?) `,
        [req.params.id],
        function(err, genreRows) {
          if (err) {
            res.status(500).send("Internal error");
            throw err;
          }
          movieRows.forEach(movie => {
            movie.genres = [];
            genreRows.forEach(genre => {
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
    }
  );
};

const newFavorite = (req, res) => {
  const sql = "INSERT INTO movie_user (id_user, id_movie) VALUES (?, ?)";
  db.query(sql, [req.params.id_user, req.params.id_movie], (err, results) => {
    if (err) {
      res.status(500).send("Internal error");
      throw err;
    }
    if (results && !results.affectedRows) {
      return res.status(400).send("Couldn't add movie to favorites!");
    }

    res.status(200).json({ id_user: req.params.id_user, id_movie: req.params.id_movie });
  });
};

module.exports = {
  register,
  getLoggedUser,
  updatePassword,
  deleteUserById,
  getUserById,
  getUserByRole,
  getAllSplittedByRole,
  newFavorite,
  login,
  logout,
  viewUserFavorites
};

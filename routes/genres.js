const express = require("express");
const genresController = require("../controller/genre.js");
const router = express.Router();
const auth = require("../middlewares/auth").auth;
const validate = require("../middlewares/validator").validate;

/* getters */
router.get("/", auth, validate, genresController.viewAll);
router.get("/:id([0-9]*)", auth, validate, genresController.viewByID);
router.get("/movies", auth, validate, genresController.viewGenresMovies);

// /* posters */
router.post("/", auth, validate, genresController.addNewData);
router.post("/:id_genre/movie/:id_movie", auth, validate, genresController.addMovieToGenre);

/* deleters */
router.delete("/:id", auth, validate, genresController.deleteByID);

module.exports = router;

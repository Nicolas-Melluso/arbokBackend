const express = require("express");
const genresController = require("../controller/genre.js");
const router = express.Router();

/* getters */
router.get("/", genresController.viewAll);
router.get("/:id([0-9]*)", genresController.viewByID);
router.get("/movies", genresController.viewGenresMovies);


// /* postters */
router.post("/", genresController.addNewData);
router.post("/:id/movie/:movie", genresController.addMovieToGenre);

/* deletters */
router.delete("/:id", genresController.deleteByID); 

module.exports = router;

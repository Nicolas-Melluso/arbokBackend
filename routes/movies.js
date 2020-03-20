const express = require("express");
const moviesController = require("../controller/movie.js");
const router = express.Router();
const auth = require("../middlewares/auth").auth;
const validate = require("../middlewares/validator").validate;

/* getters */
router.get("/", auth, validate, moviesController.viewAll); //add
router.get("/:id([0-9]*)", auth, validate, moviesController.viewByID);
router.get("/favorites", auth, validate, moviesController.viewMoviesFavorites); //add
router.get("/nameapi/:movie_name/:page", auth, validate, moviesController.searchMovieByNameAPI);
router.get("/namedb/:movie_name", auth, validate, moviesController.searchMovieByNameDB);
router.get("/fill/:page([0-9]*)", auth, validate, moviesController.fillAdminAdd);

// /* posters */
router.post("/", auth, validate, moviesController.addNewData); // by body - parser

/* deleters */
router.delete("/:id", auth, validate, moviesController.deleteByID);
router.delete("/:id_movie/:id_genre", auth, validate, moviesController.deleteGenreMovieByID);

// /* updaters */
router.put("/", auth, validate, moviesController.update); // by body - parser

module.exports = router;

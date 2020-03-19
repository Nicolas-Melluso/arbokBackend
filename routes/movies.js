const express = require("express");
const moviesController = require("../controller/movie.js");
const router = express.Router();
const auth = require("../middlewares/auth").auth;
const validate = require("../middlewares/validator").validate;

/* getters */
router.get("/", moviesController.viewAll); //add
router.get("/:id([0-9]*)", moviesController.viewByID);
router.get("/favorites", moviesController.viewMoviesFavorites); //add
router.get("/title/:title", moviesController.searchByTitle);
router.get("/nameapi/:movie", moviesController.searchMovieByNameAPI);
router.get("/namedb/:movie", moviesController.searchMovieByNameDB);
router.get("/fill/:page([0-9]*)", auth, validate, moviesController.fillAdminAdd);

// /* posters */
router.post("/", moviesController.addNewData); // by body - parser

/* deleters */
router.delete("/:id", moviesController.deleteByID);
router.delete("/:id_movie/:id_genre", moviesController.deleteGenreMovieByID);

// /* updaters */
// router.put("/", moviesController.upgrade); // by body - parser

module.exports = router;

const express = require("express");
const userController = require("../controller/user.js");
const router = express.Router();
const auth = require("../middlewares/auth").auth;
const validate = require("../middlewares/validator").validate;

router.get("/:id([0-9]*)/favorites", auth, validate, userController.viewUserFavorites);
router.get("/:id([0-9]*)", auth, validate, userController.getUserById);
router.get("/role/:role([0-9]*)", auth, validate, userController.getUserByRole);
router.get("/split", auth, validate, userController.getAllSplittedByRole);
router.get("/getUser", auth, validate, userController.getLoggedUser);

router.post("/", userController.register);
router.post("/login", userController.login);
router.post("/logout", auth, validate, userController.logout);
router.post("/:id_user([0-9]*)/movie/:id_movie([0-9]*)", auth, validate, userController.newFavorite);

router.put("/updatePassword", auth, validate, userController.updatePassword);

router.delete("/:id([0-9]*)", auth, validate, userController.deleteUserById);

module.exports = router;

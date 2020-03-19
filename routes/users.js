const express = require("express");
const userController = require("../controller/user.js");
const router = express.Router();
const auth = require("../middlewares/auth").auth;
const validate = require("../middlewares/validator").validate;

router.get("/:id([0-9]*)/favorites", userController.viewUserFavorites);
router.get("/:id([0-9]*)", userController.getUserById);
router.get("/role/:role([0-9]*)", userController.getUserByRole);
router.get("/split", userController.getAllSplittedByRole);

router.post("/", userController.register);
router.post("/getUser", userController.getLoggedUser);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/:id([0-9]*)/movie/:movie([0-9]*)", userController.newFavorite);

router.put("/updatePassword", userController.updatePassword);

router.delete("/:id([0-9]*)", userController.deleteUserById);

module.exports = router;

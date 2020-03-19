"use strict";

const redisService = require("../services/redis");

/**
 * Checks if the user token is valid.
 *
 * @name auth
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.headers - Request headers.
 * @param {String} req.headers.authorization - Authorization header containing the token.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.auth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    req.session = null;
    return next();
  }

  token = token.replace("Bearer ", ""); // Se deberia cambiar por algo mejor como una expresion regular

  redisService.get(`TOKEN_${token}`, (err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }

    if (!result) {
      /* Otra alternativa es que le envie un error particular */
      req.session = null;
      return next();
    }

    try {
      req.session = JSON.parse(result);
    } catch (e) {
      return res.status(500).send("Internal Server Error.");
    }

    req.session.token = token;

    return next();
  });
};

/*  Requires for Express */
const express = require("express");
const app = express();

/* Route of routes */
const routes = require("../routes/routes");

/* Middlewares */
const morgan = require("morgan");

/* Body-parser */
const bodyParser = require("body-parser");

/* Adding .env to the proyect */
require("dotenv").config();
const port = process.env.NODE_PORT; // PORT global

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

/* Adding to the header this config to allow some states in the web */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

routes(app);

app.get("*", (req, res) =>
  res.status(400).send({
    message: "No se encuentra el recurso"
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

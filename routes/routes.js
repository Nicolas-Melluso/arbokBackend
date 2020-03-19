module.exports = routes = app => {
  app.use("/api/movies", require("./movies"));
  app.use("/api/users", require("./users"));
  app.use("/api/genres", require("./genres"));
};

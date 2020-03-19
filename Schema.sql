CREATE DATABASE arbok_movies;
USE arbok_movies;

CREATE TABLE users(
    id INT AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE,
    pass VARCHAR(255),
    role INT,
    CONSTRAINT pk_id_user PRIMARY KEY (id)
);

INSERT INTO users (username, pass, role) VALUES ("flor", "123", 1);
INSERT INTO users (username, pass, role) VALUES ("nico", "123", 2);
INSERT INTO users (username, pass, role) VALUES ("martin", "123", 2);

CREATE TABLE movies(
    id INT AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    CONSTRAINT pk_id_movie PRIMARY KEY(id) 
);

CREATE TABLE genres(
    id INT AUTO_INCREMENT,
    name VARCHAR(30),
    CONSTRAINT pk_id_genre PRIMARY KEY(id)
);

INSERT INTO genres (id, name) VALUES (12, "Adventure");
INSERT INTO genres (id, name) VALUES (14, "Fantasy");
INSERT INTO genres (id, name) VALUES (16, "Animation");
INSERT INTO genres (id, name) VALUES (18, "Drama");
INSERT INTO genres (id, name) VALUES (27, "Horror");
INSERT INTO genres (id, name) VALUES (28, "Action");

CREATE TABLE movie_user(
    id_user INT,
    id_movie INT,
    PRIMARY KEY (id_user, id_movie),
    CONSTRAINT FOREIGN KEY fk_id_user (id_user) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY fk_id_movie (id_movie) REFERENCES movies (id) ON DELETE CASCADE
);

CREATE TABLE genre_movie(
    id_genre INT,
    id_movie INT,
    PRIMARY KEY (id_genre, id_movie),
    CONSTRAINT FOREIGN KEY fk_id_genre (id_genre) REFERENCES genres (id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY fk_id_movie2 (id_movie) REFERENCES movies (id) ON DELETE CASCADE
);
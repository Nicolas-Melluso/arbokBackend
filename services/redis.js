"use strict";

const redis = require("redis");

/**
 * Get the value of a key on Redis.
 *
 * @name get
 * @function
 * @param {String} key - Redis key.
 * @param {Function} cb - Callback argument.
 */
exports.get = (key, cb) => {
  let client = redis.createClient({ host: "127.0.0.1", port: "6379" });

  client.on("error", function(err) {
    return cb(err);
  });

  client.get(key, function(err, result) {
    client.quit();
    return cb(err, result);
  });
};

/**
 * Insert a new value on Redis.
 *
 * @name insert
 * @function
 * @param {String} key - Key of the new value.
 * @param {String} value - The value.
 * @param {Integer} ttl - Expire time in seconds.
 * @param {Function} cb - Callback argument.
 */
exports.insert = (key, value, ttl, cb) => {
  let client = redis.createClient({ host: "127.0.0.1", port: "6379" });

  client.on("error", function(err) {
    return cb(err);
  });

  if (ttl) {
    client.set(key, value, "EX", ttl, function(err, result) {
      client.quit();
      return cb(err, result);
    });
  } else {
    client.set(key, value, function(err, result) {
      client.quit();
      return cb(err, result);
    });
  }
};

exports.update = (key, value, cb) => {};

/**
 * Delete a key of Redis.
 *
 * @name delete
 * @function
 * @param {String} key - Key to be deleted.
 * @param {Function} cb - Callback argument.
 */
exports.delete = (key, cb) => {
  let client = redis.createClient({ host: "127.0.0.1", port: "6379" });

  client.on("error", function(err) {
    return cb(err);
  });

  client.del(key, function(err, result) {
    client.quit();
    return cb(err, result);
  });
};

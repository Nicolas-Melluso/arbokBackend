/**
 * Generates a random string.
 *
 * @name generateString
 * @function
 * @param {Integer} size - Size of the string to generate.
 * @returns {String} Generated string.
 */
exports.generateString = (size = 10) => {
  let text = "";
  let possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < size; i++) {
    text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return text;
};

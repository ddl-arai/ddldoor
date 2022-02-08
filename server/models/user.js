let mongoose = require("mongoose"),
 userSchema = mongoose.Schema({
    email: String,
    password: String,
  });

module.exports = mongoose.model("User", userSchema, 'user');
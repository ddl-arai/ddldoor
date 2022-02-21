let mongoose = require("mongoose"),
 userSchema = mongoose.Schema({
    email: String,
    password: String,
    pw_reset_token: String,
    pw_reset_token_expire: Date,
    admin: Boolean
  });

module.exports = mongoose.model("User", userSchema, 'user');
let mongoose = require("mongoose"),
 memberSchema = mongoose.Schema({
    id: Number,
    name: String,
    lastname: String,
    firstname: String,
    company: String,
    enable: Boolean,
    status: Number
  });

module.exports = mongoose.model("Member", memberSchema, 'member');
let mongoose = require("mongoose"),
 memberSchema = mongoose.Schema({
    id: Number,
    name: String,
    lastname: String,
    firstname: String,
    company: String,
    attendance: Boolean,
    init: Boolean
  });

module.exports = mongoose.model("Member", memberSchema, 'member');
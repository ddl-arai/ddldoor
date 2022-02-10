let mongoose = require("mongoose"),
 cardSchema = mongoose.Schema({
    idm: String,
    id: Number,
    enable: Boolean,
    expire: Date,
    remark: String,
  });

module.exports = mongoose.model("Card", cardSchema, 'card');
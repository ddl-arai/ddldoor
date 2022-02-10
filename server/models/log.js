let mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose);
let Schema = mongoose.Schema;
let logSchema = new Schema({
    no: Number,
    date: String,
    time: String,
    idm: String,
});
logSchema.plugin(autoIncrement, {inc_field: 'no'});
module.exports = mongoose.model("Log", logSchema, 'log');
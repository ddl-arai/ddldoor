let mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose);
let Schema = mongoose.Schema;
let logSchema = new Schema({
    no: Number,
    sec: Number,
    idm: String,
    devid: Number,
    prevStat: Number,
    success: Boolean
});
logSchema.plugin(autoIncrement, {inc_field: 'no'});
module.exports = mongoose.model("Log", logSchema, 'log');

/*
let mongoose = require("mongoose"),
    logSchema = mongoose.Schema({
        no: Number,
        date: String,
        time: String,
        idm: String,
    });

module.exports = mongoose.model("Log", logSchema, 'log');*/
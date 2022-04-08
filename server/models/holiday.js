let mongoose = require("mongoose"),
 holidaySchema = mongoose.Schema({
    date: String,
    remark: String
  });

module.exports = mongoose.model("Holiday", holidaySchema, 'holiday');
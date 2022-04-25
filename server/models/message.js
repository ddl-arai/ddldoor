let mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose);
let Schema = mongoose.Schema;
let messageSchema = new Schema({
    id: Number,
    timestamp: Number,
    content: String
});
messageSchema.plugin(autoIncrement, {inc_field: 'id'});
module.exports = mongoose.model("Message", messageSchema, 'message');
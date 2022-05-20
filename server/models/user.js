let mongoose = require("mongoose"),
 userSchema = mongoose.Schema({
    email: String,
    password: String,
    pw_reset_token: String,
    pw_reset_token_expire: String,
    admin: Boolean,
    associated_member_id: Number,
    qr_token: String,
    qr_token_expire: String,
    messageIds: [Number],
    tutorial: Boolean
  });

module.exports = mongoose.model("User", userSchema, 'user');
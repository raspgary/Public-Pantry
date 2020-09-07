const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true
  },
  rewards: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  phone: {
    type: Number,
  },
});

module.exports = User = mongoose.model("user", UserSchema);

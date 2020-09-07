const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PantrySchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  expiration: {
    type: String,
    // required: true
  },
  username: {
    type: String,
    // required: true
  },
  notification: {
    type: String,
    // required: true
  },
});

module.exports = User = mongoose.model("pantry", PantrySchema);

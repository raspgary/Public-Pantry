const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  picture: {
    type: String,
    // required: true,
  },
  quantity: {
    type: Number,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  username: {
    type: String,
    // required: true
  },
  longitude: {
    type: Number,
    // required: true
  },
  latitude: {
    type: Number,
    // required: true
  },
  price: {
    type: Number,
    // required: true
  },
  phone: {
    type: String,
    // required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
    // required: true
  },
});

module.exports = Sale = mongoose.model("sale", SaleSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    type: {
      type: String, // expirationSoon, expired, ordered, or order
      // required: true,
    },
    food: {
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
    otherUser: {
      type: String,
      // required: true
    },
    otherPhone: {
      type: String,
      // required: true
    },
    otherID: {
      type: String,
      // required: true
    },
    donated: {
      type: Number, // 0 or 1
    },
  },
  { timestamps: true }
);

module.exports = Notification = mongoose.model(
  "notification",
  NotificationSchema
);

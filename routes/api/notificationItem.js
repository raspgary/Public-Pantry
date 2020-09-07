const express = require("express");
const router = express.Router();

// Item Model
const notificationItem = require("../../models/notification.model");

// @route GET api/items
// @ access Public
router.get("/:user/:type", (req, res) => {
  // console.log(req.params.type);
  // if (req.params.type === undefined) {
  //   notificationItem
  //     .find({ username: req.params.user, type: req.params.type })
  //     .sort({ timeStamp: -1 })
  //     .then((sale) => res.json(sale));
  // } else {
  notificationItem
    .find({ username: req.params.user, type: req.params.type })
    .sort({ timeStamp: -1 })
    .then((notification) => res.json(notification));
});

router.get("/:user", (req, res) => {
  notificationItem
    .find({ username: req.params.user })
    .sort({ createdAt: -1 })
    .then((notification) => res.json(notification));
});

// @route POST api/items
// @ access Public
router.post("/", (req, res) => {
  const newItem = new notificationItem({
    type: req.body.type,
    username: req.body.username,
    otherUser: req.body.otherUser,
    otherPhone: req.body.otherPhone,
    food: req.body.food,
    expiration: req.body.expiration,
  });
  newItem.save().then((notification) => res.json(notification));
});

router.put("/:otherID/:donated", (req, res) => {
  notificationItem
    .findOneAndUpdate(
      {
        otherID: req.params.otherID,
      },
      { donated: req.params.donated }
    )
    //notificationItem.save().then((sale) => res.json(sale));
    .then((notification) => res.json(notification));
});

// @route DELETE api/items/:id
// @ access Public
router.delete("/:id", (req, res) => {
  notificationItem
    .findById(req.params.id)
    .then((notification) =>
      notification.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;

const express = require("express");
const router = express.Router();

// Item Model
const userItem = require("../../models/user.model");

// @route GET api/items
// @desc Get All histories
// @ access Public
router.get("/:username", (req, res) => {
  userItem
    .find({ username: req.params.username }) //{ username: req.params.username }
    .then((user) => res.json(user));
});

router.put("/:username", (req, res) => {
  userItem
    .findOneAndUpdate(
      {
        username: req.params.username,
      },
      { $inc: { rewards: 20 } }
    )
    //notificationItem.save().then((sale) => res.json(sale));
    .then((user) => res.json(user));
});

// @route POST api/items
// @desc Create a history
// @ access Public
// router.post("/", (req, res) => {
//   const newItem = new historyItem({
//     equation: req.body.equation,
//     date: req.body.date,
//   });
//   newItem.save().then((history) => res.json(history));
// });

// @route DELETE api/items/:id
// @desc Delete a history
// @ access Public
// router.delete("/:id", (req, res) => {
//   historyItem
//     .findById(req.params.id)
//     .then((history) => history.remove().then(() => res.json({ success: true })))
//     .catch((err) => res.status(404).json({ success: false }));
// });

module.exports = router;

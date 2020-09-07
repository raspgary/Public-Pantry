const express = require("express");
const router = express.Router();

// Item Model
const pantryItem = require("../../models/pantry.model");

// @route GET api/items
// @desc Get All pantries
// @ access Public
router.get("/:user", (req, res) => {
  pantryItem
    .find({ username: req.params.user })
    .sort({ expiration: 1 })
    .then((pantry) => res.json(pantry));
});

// @route POST api/items
// @desc Create a pantryItem
// @ access Public
router.post("/", (req, res) => {
  const newItem = new pantryItem({
    name: req.body.name,
    expiration: req.body.expiration,
    username: req.body.username,
    notification: req.body.notification,
  });
  newItem.save().then((pantry) => res.json(pantry));
});

router.put("/:id/:notif", (req, res) => {
  pantryItem
    .findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { notification: req.params.notif }
    )
    //notificationItem.save().then((sale) => res.json(sale));
    .then((pantry) => res.json(pantry));
});

// @route DELETE api/items/:id
// @desc Delete a pantryItem
// @ access Public
router.delete("/:id", (req, res) => {
  pantryItem
    .findById(req.params.id)
    .then((pantry) => pantry.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;

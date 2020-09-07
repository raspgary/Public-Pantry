const express = require("express");
const router = express.Router();

// Item Model
const donateItem = require("../../models/donate.model");

// @route GET api/items
// @desc Get All donations
// @ access Public
router.get("/:user", (req, res) => {
  donateItem
    .find({ username: req.params.user })
    .sort({ expiration: 1 })
    .then((donate) => res.json(donate));
});

router.get("/", (req, res) => {
  donateItem
    .find()
    .sort({ expiration: 1 })
    .then((donate) => res.json(donate));
});

// @route POST api/items
// @desc Create a donation
// @ access Public
router.post("/", (req, res) => {
  const newItem = new donateItem({
    name: req.body.name,
    picture: req.body.picture,
    quantity: req.body.quantity,
    description: req.body.description,
    expiration: req.body.expiration,
    username: req.body.username,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    phone: req.body.phone,
  });
  newItem.save().then((donate) => res.json(donate));
});

router.put("/:id/:quantity", (req, res) => {
  donateItem
    .findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { quantity: req.params.quantity }
    )
    //notificationItem.save().then((sale) => res.json(sale));
    .then((donate) => res.json(donate));
});

// @route DELETE api/items/:id
// @desc Delete a donation
// @ access Public
router.delete("/:id", (req, res) => {
  donateItem
    .findById(req.params.id)
    .then((donate) => donate.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;

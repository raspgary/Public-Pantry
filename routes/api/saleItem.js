const express = require("express");
const router = express.Router();

// Item Model
const saleItem = require("../../models/sale.model");

// @route GET api/items
// @ access Public
router.get("/:user", (req, res) => {
  saleItem
    .find({ username: req.params.user })
    // .sort({ expiration: 1 })
    .then((sale) => res.json(sale));
});

// @route GET api/items
// @ access Public
router.get("/", (req, res) => {
  saleItem
    .find()
    // .sort({ expiration: 1 })
    .then((sale) => res.json(sale));
});

// @route POST api/items
// @ access Public
router.post("/", (req, res) => {
  const newItem = new saleItem({
    name: req.body.name,
    picture: req.body.picture,
    quantity: req.body.quantity,
    description: req.body.description,
    price: req.body.price,
    username: req.body.username,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    phone: req.body.phone,
  });
  newItem.save().then((sale) => res.json(sale));
});

router.put("/:id/:quantity", (req, res) => {
  saleItem
    .findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { quantity: req.params.quantity }
    )
    //notificationItem.save().then((sale) => res.json(sale));
    .then((sale) => res.json(sale));
});

// @route DELETE api/items/:id
// @ access Public
router.delete("/:id", (req, res) => {
  saleItem
    .findById(req.params.id)
    .then((sale) => sale.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;

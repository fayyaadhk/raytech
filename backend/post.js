const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  created: { type: Date, default: Date.now(), required: false }
});

module.exports = mongoose.model("Supplier", supplierSchema);
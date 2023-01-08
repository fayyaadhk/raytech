const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  title: { type: String, required: false },
  name: { type: String, default: 'A new supplier', required: true },
  thumbnail: { type: String, required: false },
  active: { type: Boolean, default: true, required: false },
  created: { type: Date, default: Date.now(), required: false }
});

supplierSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

supplierSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model("Supplier", supplierSchema);
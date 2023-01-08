const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: { type: String, required: false },
  thumbnail: { type: String, required: false },
  mobile: { type: String, required: false },
  email: { type: String, required: false },
  active: { type: Boolean, required: false},
  created: { type: Date, default: Date.now(), required: false }
});

clientSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

clientSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model("Client", clientSchema);
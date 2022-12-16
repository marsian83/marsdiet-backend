const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, default: null },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  diabetic: { type: Boolean, default: false },
  photoUrl: { type: String, default: null },
});

const User = mongoose.model("User", schema);

module.exports = User;

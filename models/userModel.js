const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    username: { type: String, required: true, set: (v) => v.toLowerCase() },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userShema);

module.exports = User;

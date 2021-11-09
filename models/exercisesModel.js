const mongoose = require("mongoose");

const exercisesSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: String, required: true },
      username: { type: String, required: true },
    },
    exercises: [
      {
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { versionKey: false }
);

const Exercise = mongoose.model("Exercise", exercisesSchema);

module.exports = Exercise;

const express = require("express");
const asyncHandler = require("express-async-handler");
const userRoute = express.Router();
const User = require("../models/userModel");
const Exercise = require("../models/exercisesModel");
const filtredArr = require("../utils/filterArr");
const checkDate = require("../utils/checkDate");

userRoute.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const { username } = req.body;

      const user = new User({ username });

      const savedUser = await user.save();
      res.json(savedUser);
    } catch (error) {
      res.send(error.message.split(":")[2].trim());
    }
  })
);

userRoute.post(
  "/:id?/exercises",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { description, duration, date } = req.body;

    const user = await User.findById(id);

    if (!user) return res.send("Unknown userId");

    const userExercise = await Exercise.findOne({
      "user._id": user._id,
    });

    try {
      if (!userExercise) {
        const exercise = new Exercise({
          user: {
            _id: user._id,
            username: user.username,
          },
          exercises: [{ description, duration, date }],
        });

        const savedExer = await exercise.save();

        return res.send(savedExer);
      }

      userExercise.exercises = [
        ...userExercise.exercises,
        { date: date ? date : undefined, duration, description },
      ];
      const {
        user: { _id, username },
        exercises,
      } = await userExercise.save();

      const exercise = exercises[exercises.length - 1];

      res.send({
        _id,
        username,
        date: exercise.date.toDateString(),
        duration: exercise.duration,
        description: exercise.description,
      });
    } catch (error) {
      const { errors } = error;
      res.send(errors[Object.keys(errors)[0]].message);
    }
  })
);

userRoute.get(
  "/:id/logs",
  asyncHandler(async (req, res) => {
    const { from, to, limit } = req.query;
    const { id } = req.params;

    if (!id) return res.send("Not found");

    const {
      user: { _id, username },
      exercises,
    } = await Exercise.findOne({
      "user._id": id,
    });

    // //* from & to
    {
      checkDate(from) &&
        checkDate(to) &&
        res.send({
          _id,
          username,
          from: new Date(from).toDateString(),
          to: new Date(to).toDateString(),
          count:
            limit &&
            Number(limit) <
              filtredArr(new Date(from), new Date(to), exercises).length
              ? Number(limit)
              : filtredArr(new Date(from), new Date(to), exercises).length,
          log: filtredArr(new Date(from), new Date(to), exercises).slice(
            0,
            Number(limit) ? Number(limit) : undefined
          ),
        });
    }

    // //* from

    {
      checkDate(from) &&
        res.send({
          _id,
          username,
          from: new Date(from).toDateString(),
          count:
            limit &&
            Number(limit) <
              filtredArr(new Date(from), null, exercises).length &&
            Number(limit) > 0
              ? Number(limit)
              : filtredArr(new Date(from), null, exercises).length,
          log: filtredArr(new Date(from), null, exercises).slice(
            0,
            Number(limit) ? Number(limit) : undefined
          ),
        });
    }

    // //* to
    {
      checkDate(to) &&
        res.send({
          _id,
          username,
          to: new Date(to).toDateString(),
          count:
            limit &&
            Number(limit) < filtredArr(null, new Date(to), exercises).length &&
            Number(limit) > 0
              ? Number(limit)
              : filtredArr(null, new Date(to), exercises).length,
          log: filtredArr(null, new Date(to), exercises).slice(
            0,
            Number(limit) ? Number(limit) : undefined
          ),
        });
    }

    // //* all

    {
      !checkDate(to) &&
        !checkDate(from) &&
        res.send({
          _id,
          username,
          count:
            limit && Number(limit) < exercises.length && Number(limit) > 0
              ? Number(limit)
              : exercises.length,
          log: filtredArr(null, null, exercises).slice(
            0,
            Number(limit) ? Number(limit) : undefined
          ),
        });
    }
  })
);

module.exports = userRoute;

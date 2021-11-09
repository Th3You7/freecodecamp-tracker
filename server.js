const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "./sample.env",
  });
}

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

console.log("mongo", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost/freecodecamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(express.static("public"));

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

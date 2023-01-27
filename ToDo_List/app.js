const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { verifyAccessToken } = require("./Utilities/jwt");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Good Morning");
});

app.use("/todo", require("./routes/api.route"));
app.use("/users", require("./routes/users"));
app.use("/Auth", require("./routes/Auth.routes"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

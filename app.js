const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const password = encodeURIComponent("M@ciek12312312");
mongoose
  .connect(
    `mongodb+srv://olaf4343:${password}@cluster0.yquce.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Error connecting to the database");
    console.error(err);
    process.exit(1);
  });

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;

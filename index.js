const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
const cors = require("cors");
mongoose
  .connect(
    "mongodb+srv://admin:qEgxCDbmb4XMxPRX@cluster0.yxpf8lq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });
app.use(cors());
app.use(express.json());
app.use("/v1/uploads", express.static("uploads"));
app.use("/", routes);
app.listen("3333", () => {
  console.log("Server started at 3333 port");
});

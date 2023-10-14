const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const app = express();

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

app.use(express.json());
app.get("/v1/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/v1/auth/register", async (req, res) => {
  try {
    const { name, surname, email, age, gender, photoUri, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      email,
      age,
      gender,
      photoUri,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const responseUser = { ...savedUser._doc };
    res.status(201).json(responseUser);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        age: user.age,
        gender: user.gender,
        photoUri: user.photoUri,
      },
      "abmoneySecretKey123",
      { expiresIn: "1y" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/v1/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "abmoneySecretKey123");

    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const responseUser = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      age: user.age,
      gender: user.gender,
      photoUri: user.photoUri,
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen("3333", () => {
  console.log("Server started at 3333 port");
});

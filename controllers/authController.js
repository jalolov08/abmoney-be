const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser(req, res) {
  try {
    const { name, surname, email, age, gender, photoUri, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

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
}

async function loginUser(req, res) {
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

    const responseUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      age: user.age,
      gender: user.gender,
      photoUri: user.photoUri,
      userPlan: user.userPlan,
    };

    res.status(200).json({ token, user: responseUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function updateUserInformation(req, res) {
  try {
    const userId = req.params.userId;
    const { photoUri, age, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { photoUri, age, gender } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const responseUser = {
      _id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      surname: updatedUser.surname,
      age: updatedUser.age,
      gender: updatedUser.gender,
      photoUri: updatedUser.photoUri,
      userPlan: updatedUser.userPlan,
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUserInformation,
};

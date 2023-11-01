const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser(req, res) {
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
}

async function loginUser(req, res){
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
module.exports = {
  registerUser,
  loginUser
};

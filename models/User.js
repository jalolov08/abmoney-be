const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password:{
        type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      },
    gender: {
      type: String,
     
    },
    photoUri: {
      type: String,
     
    },
    userPlan:{
      type:String,
      default:"Start"
    },
    favoriteVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
      }
    ],
    favoriteAudios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audio'
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User" , UserSchema)

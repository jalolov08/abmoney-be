const mongoose = require("mongoose")

const AudioSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    audioUri:{
        type:String,
        required:true
    }
},
{
    timestamps:true
})

module.exports = mongoose.model("Audio" , AudioSchema)
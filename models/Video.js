const mongoose = require("mongoose")

const VideoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    videoUri:{
        type:String,
        required:true,
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("Video" , VideoSchema)
const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    enTitle:{
        type:String,
        required:true
    },
   enDescription:{
    type:String,
    required:true
},
    photoUri:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    }
}
, 
{
    timestamps:true
}
)

module.exports = mongoose.model("Post" , PostSchema)
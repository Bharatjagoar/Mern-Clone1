const Mongoose= require("mongoose")

const PostSchema = Mongoose.Schema({
    caption:{
        type:"String"
    },
    mediaUrl:{
        type:"String"
    },
    userId:{
        type:Mongoose.Types.ObjectId,
        ref:"userSChema"
    },
    userName:{
        type:"String"
    },
    mediaId:{
        type:"String"
    }
},
    {timestamps:true}
)

const Post= Mongoose.model("PostSchema",PostSchema)
module.exports=Post
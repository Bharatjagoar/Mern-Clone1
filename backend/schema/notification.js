const mongoose= require("mongoose")

const notification =mongoose.Schema({
    User:{
        type:mongoose.Types.ObjectId,
        ref:"userSChema"
    },
    notificationArr:[
        type:String
    ]
})
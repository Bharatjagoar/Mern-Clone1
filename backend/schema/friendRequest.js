const mongoose = require("mongoose")


const FriendRequestRoomSchema = mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:"userSChema"
    },
    Friend:[
        {
            friendsUniqueId:{
                type:mongoose.Types.ObjectId,
                ref:"userSChema"
            }
        },
    ]
},{timestamps:true})

const FriendRequest = mongoose.model("FRschema",FriendRequestRoomSchema)

module.exports=FriendRequest
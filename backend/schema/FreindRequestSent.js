const mongoose = require("mongoose")


const FriendRequestSentRoomSchema = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"userSChema"
    },
    SentFR:[{type:mongoose.Types.ObjectId,ref:"userSChema"}]
})
const FriendRequest = mongoose.model("SentFRschema",FriendRequestSentRoomSchema)
module.exports = FriendRequest
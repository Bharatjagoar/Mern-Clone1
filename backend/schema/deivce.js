const mongoose=require("mongoose")


const DevicesSchema = mongoose.Schema({
    User:{
        type:mongoose.Types.ObjectId,
        ref:"userSChema"
    },
    Device:[
        {os:String,description:String}
    ]
},{timeStamps:true})
const Device=mongoose.model("Devices",DevicesSchema)
module.exports=Device;

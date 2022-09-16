const mongoose =require("mongoose")
const data = mongoose.Schema({
    UserName:{
        type:"String"
    },
    pin:{
        type:"String"
    }
},{timestamps:true}
)

const testData=mongoose.model("test",data)
module.exports = testData
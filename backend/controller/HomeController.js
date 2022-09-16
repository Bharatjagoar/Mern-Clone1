const path =require("path")
const data =require("../schema/test")
const User=require("../schema/UserSchema")
module.exports.home=(req,res)=>{
    console.log("Home request !!")
    res.send()
}

module.exports.delete=(req,res)=>{
    console.log("winfdsafs")
    User.deleteMany({},(err)=>{
        if(err){
            console.log(err)
            return res.status(400)
        }
        console.log("deleted everything !! ")

    })
    res.status(200).send("hellow world ")
}
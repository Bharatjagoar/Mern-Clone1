const mongo = require("mongoose");
mongo.connect("mongodb://localhost:27017/databasedb")
const connect = mongo.connection
connect.on("error",function(err){console.log("error connecting to database !!",err)})
connect.once("open",function(){
    console.log("successfully connected to the Database !!")
})
// hellow orldsa


module.exports=mongo
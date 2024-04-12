const mongo = require("mongoose");
mongo.connect('mongodb://0.0.0.0:27017/databasedb' ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
const connect = mongo.connection
connect.on("error",function(err){console.log("error connecting to database !!",err)})
connect.once("open",function(){
    console.log("successfully connected to the Database !!")
})
// hellow orldsa


module.exports=mongo


// const mongoose = require("mongoose")
// mongoose.connect("mongodb://localhost:27017/databasedb")
// .then(()=>{
//     console.log("database connected successfully")
// })
// .catch((err)=>{
//     console.log("error connecting data base!")
//     console.log(err)
// })
// module.exports = mongoose

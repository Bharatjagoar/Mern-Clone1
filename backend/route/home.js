const express = require("express")
const HomeController = require("../controller/HomeController")

const PostRouter= require("./post")()
const UserRouter=require("./user")()

function socketRoutes(io){
    io.on("connection",async (socket)=>{
        
        socket.on("connectionpossible",(data)=>{  
            console.log(socket.id)  
            console.log("from useEffect",data)
        })
        
        socket.on("leftside",data=>{
            console.log("data ::::2::::",data)
        })
        socket.on("joinRoom",data=>{
            // console.log(data,"this room is joinerd ")
            socket.join(data)
            console.log(data,"joined")
        })
        

        socket.on("helloworld",data=>{
            
            console.log(data,"this is bharat room")
            socket.join(data.room)
            socket.to(data.room).emit("friendrequest",data.username)
        })
    })

    console.log("hi")
    const Router = express.Router()
    Router.use("/User",UserRouter)
    Router.use("/Post",PostRouter)
    Router.get("/home",HomeController.home)
    Router.get("/delete",HomeController.delete)
    return Router
}



module.exports=socketRoutes;
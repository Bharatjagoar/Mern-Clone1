const express = require("express")
const HomeController = require("../controller/HomeController")

const PostRouter= require("./post")()
const UserRouter=require("./user")()

function socketRoutes(io){
    io.on("connection",async (socket)=>{
        
        socket.on("connectionpossible",(data)=>{  
              
            console.log("from useEffect",data)
        })
        socket.on("loggedinUser",data=>{
            console.log(data,"\n","data")
        })
        socket.on("JoinTheseFriendRequestroom",data=>{
            // console.log("rom list data",data.myid)
            data.arr.forEach(element => {
                console.log(element,"joinedsdsa")
                socket.join(data.myid+"friendsRequest"+element)
            });
        })
        socket.on("helloworld",data=>{
            // console.log("hello world :: ",data)
            socket.emit("windows")
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
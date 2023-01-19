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
        socket.on("jointheseRevievedFriendsRQ",data=>{
            if(data.array[0]){
                data.array.forEach(element => {
                    console.log(element.friendsUniqueId._id,"these are p[;'0the ")
                    console.log("session",data.sessionid)
                    socket.join(data.sessionid+element.friendsUniqueId._id)
                    socket.to(data.sessionid+element.friendsUniqueId._id).emit("joinedforrecieved",
                    {
                        message: element.friendsUniqueId.fname +" "+element.friendsUniqueId.fname+" " +"has joined"
                    })
                });
            }
        })
        socket.on("jointheseSentFriendsRQ",data=>{
            console.log(data.sessionid,"thiese")
            data.array.forEach(element => {
                console.log(element._id,"these are the send")
                socket.join(element._id+data.sessionid) 
                socket.to(element._id+data.sessionid).emit("joinedforsent",{
                    message:"someone joined"
                })
            });
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
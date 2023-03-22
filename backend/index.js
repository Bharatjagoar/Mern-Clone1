const bodyParser = require("body-parser");
const express = require("express");
const path= require("path");
const app = express();
const http =require("http")
const {Server}=require("socket.io")
const server=new http.createServer(app)



const cookieParser = require("cookie-parser")
const db =require("./config/mongoose")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const cors = require("cors")

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

const io= new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
io.use((socket,next)=>{
    const userId = socket.handshake.auth.socketUserId
    // console.log(socket.id,"this is the id ")
    // console.log(userId,"tbis us uesrid")
    if(!userId){
        return next(new Error("invalid user naem"))
    }
    socket.userId=userId
    next()
})
io.in().fetchSockets()
const socketRouter = require("./route/home")(io)

app.use(express.json())

app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
    secret: 'somethingsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxage:1000*60*60},
    store:mongoStore.create({
        mongoUrl:"mongodb://localhost:27017/databasedb",
        autoRemove:"disabled"
    },(err)=>{
        Console.log(err || "error from mongo store !! ")
    })
  }))
  

console.log("hello world")

app.use("/",socketRouter);
server.listen("5000",'0.0.0.0',()=>{
    console.log("port 5000")
})
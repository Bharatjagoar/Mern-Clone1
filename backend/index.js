const bodyParser = require("body-parser");
const express = require("express");
const path= require("path");
const app = express();
const cookieParser = require("cookie-parser")
const db =require("./config/mongoose")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const cors = require("cors")

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

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
  




app.use("/",require("./route/home"));
app.listen("5000",'0.0.0.0',()=>{
    console.log("port 5000")
})
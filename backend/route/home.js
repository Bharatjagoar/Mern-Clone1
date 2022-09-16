const express = require("express")
const Router = express.Router()
const HomeController = require("../controller/HomeController")
Router.use("/User",require("./user"))
Router.use("/Post",require("./post"))


Router.get("/home",HomeController.home)
Router.get("/delete",HomeController.delete)

module.exports=Router
const express =require("express");
const Router = express.Router();
const PostController = require("../controller/postConrtroller")

Router.post("/CreatePost",PostController.createPost)
Router.get("/GetPost",PostController.GetPost)
Router.get("/delete",PostController.Delete)
Router.get("/deleteThisCloudinary",PostController.deleteThisCloudinary)

module.exports=Router
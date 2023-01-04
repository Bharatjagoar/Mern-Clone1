const express =require("express");
const PostController = require("../controller/postConrtroller")
function PostRoutes(io){

    const Router = express.Router();

    Router.post("/CreatePost",PostController.createPost)
    Router.get("/GetPost",PostController.GetPost)
    Router.get("/delete",PostController.Delete)
    Router.get("/deleteThisCloudinary",PostController.deleteThisCloudinary)
    Router.get("/funny",PostController.funny)


    return Router
}




module.exports=PostRoutes
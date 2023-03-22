const express = require("express")
const usercontroller = require("../controller/userController")  

function UserRouter(){
    const router = express.Router()
    router.post("/CreateUser",usercontroller.createuser)
    router.post("/login",usercontroller.LoginUser)
    router.get("/loginSesion",usercontroller.SessionCheck)
    router.post("/logout",usercontroller.logOut)
    router.patch("/UpdateInfoName/:id",usercontroller.updateName);
    router.get("/Getthedevices",usercontroller.GettheUserDevices)
    router.post("/DeviceNamestorage",usercontroller.userDeviceDetail);
    router.post("/updateProfilePicture",usercontroller.UpdateProfilePicture)
    router.post("/updatePassword",usercontroller.UpdatePassword)
    
    router.get("/PullBack",usercontroller.Pullback)
    router.get("/RoomFriendsRequest",usercontroller.RoomCheck)
    router.get("/polulatedata",usercontroller.populate)
    // router.get("/testthis2")
    // router.get("testthis",usercontroller.testthis1)
    router.get("/friendsUpdate/:sentto",usercontroller.FriendsaddOrUpdate)
    router.get("/FriendsRequestCheck",usercontroller.FriendRequestEnquery)
    router.get("/FriendsRequestPage",usercontroller.FriendsRequestPage)

    router.get("/CheckingApi",usercontroller.checktheApi)

    return router
}

// router.get("/logout")





module.exports= UserRouter
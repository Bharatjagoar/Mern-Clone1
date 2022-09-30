import React from "react";
import CropperReact from "./security and login/updateProfilePic";
import ChangePassword from "./updation forms/passwordChange";
function Blocking({obj}){


    function hellow(){
        obj.emit("join",{message:"hi"})
    }
    return <div>
        <h1 onClick={()=>{hellow()}}>bharat jagoar</h1>
        <CropperReact/>
    </div> 
}

export default Blocking
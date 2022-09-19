import React from "react";
import NameUpdateCss from "./nameupdate.module.css"

function ChangePassword({funct}){
    function CancelFunct(){
        funct(true)
    }
    return <div>
            <div>
            <form method="put" action="" className={NameUpdateCss.forum}>
            <h3 className={NameUpdateCss.headingOftheForm}>Password change</h3>
            <input onChange={(e)=>{}} className={NameUpdateCss.inputData} type="text" placeholder="enter the first name"/>
            <input onChange={(e)=>{}} className={NameUpdateCss.inputData} type="text" placeholder="enter the last name "/>
            <div className={NameUpdateCss.BtncontainerUpdatename}>
                <button className={NameUpdateCss.updatenameSubmit} type="button" onClick={(e)=>{}}>submit</button>
                <button className={NameUpdateCss.updatenamecancel} type="button" onClick={(e)=>{CancelFunct()}}> cancel</button>
            </div>
            
        </form>
    </div>
        </div>
}

export default ChangePassword;
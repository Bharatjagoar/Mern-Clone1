import React from "react";
import PasswordupdateCss from "./passwordupdate.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faKey} from "@fortawesome/free-solid-svg-icons"
import ChangePassword from "../updation forms/passwordChange";
import { useState } from "react";


function Password(){
    const [cancel,setcancel]= useState(true)
    
    function BtnClicked(){
        setcancel(false)
    }
    
    return <div className={PasswordupdateCss.outerMostdiv}>
        <div className={PasswordupdateCss.headingContainer}>
            <h4 className={PasswordupdateCss.heading}>Password</h4>
        </div>
        <div className={PasswordupdateCss.content}>
            <div className={PasswordupdateCss.contentdivone}>
                {cancel?<FontAwesomeIcon icon={faKey} className={PasswordupdateCss.KeyIcon}/>:null} 
            </div>
            <div className={PasswordupdateCss.contentdivtwo}>
                {cancel?
                <>
                <h4>Change password</h4>
                <p>It's a good idea to use a strong password that you don't use elsewhere</p>
            </>:<ChangePassword funct={(bool)=>setcancel(bool)}/>}
                
            </div>
            <div className={PasswordupdateCss.contentdivthree}>
                {cancel&&<button onClick={()=>{BtnClicked()}}>Edit</button>}
            </div>
        </div>
    </div>
}
export default Password;
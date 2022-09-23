import React from "react";
import { useState , useRef} from "react";
import PasswordChangeCss from "./passwordChange.module.css"
import axios from "axios"
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NameUpdateCss from "./nameupdate.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye,faEyeSlash} from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react";


toast.configure()

function ChangePassword({funct}){
    const oldPasswordref=useRef()
    const newPasswordref=useRef()
    const confirmref=useRef()
    const [oldpassword,setoldpassword]=useState()
    const [newPassword,setnewPassword]=useState()
    const [confirm,setconfirm]=useState()
    const [newicon,setnewicon] =useState(true)
    const [oldicon,setoldicon] =useState(true)
    const [confirmicon,setconfirmicon] =useState(true)

    function old(e){
        setoldpassword(e.target.value)
        
    }
    function newPass(e){
        setnewPassword(e.target.value)
        
    }
    function confirmpass(e){
        setconfirm(e.target.value)
        
    }



    function submitBtn(){
        if(confirm!=newPassword){
            console.log("fdas")
            toast.info("Confirm password didnt matched",{
                position: "top-right",
                autoClose: 5000,
                theme:"colored"
            })
            return
        } 
        if(oldpassword===""||newPassword===""){
            console.log("0")
            toast.warn("fields cant be empty",{theme:"colored"})
            return 
        }
        let Passwordstring=String(newPassword)
        console.log(Passwordstring.length)
        if(Passwordstring.length<8){
            console.log("nt secured")
            toast.warn("Set a secured password !!",
            {
                theme:"colored"
            })
            return
        }
        axios.post("http://localhost:5000/User/updatePassword",{
            old:oldpassword,
            new:newPassword
        })
        .then((respose)=>{
            console.log(respose)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function eyeClickednew(event){
        
        newPasswordref.current.type=newPasswordref.current.type=="text"?"password":"text"
    }
    function eyeClickedconfirm(event){
        confirmref.current.type=confirmref.current.type=="text"?"password":"text"
    }
    function eyeClickedold(event){
        oldPasswordref.current.type = oldPasswordref.current.type=="text"?"password":"text"
    }


    function CancelFunct(){
        funct(true)
    }
    return <div>
            <div>
            <form action="" className={NameUpdateCss.forum}>
            <h3 className={NameUpdateCss.headingOftheForm}>Password change</h3>
            <div className={PasswordChangeCss.inputContainer}>
                <div className={PasswordChangeCss.ConatinerINputAndICon}>
                <input ref={oldPasswordref} onChange={(e)=>{old(e)}} className={PasswordChangeCss.inputData} type="password" placeholder="Old password "/>
                <FontAwesomeIcon onClick={(e)=>{eyeClickedold(e)}} id="old" icon={faEye} className={PasswordChangeCss.eye}/>
                </div>
                
                <div className={PasswordChangeCss.ConatinerINputAndICon}>
                    <input ref={newPasswordref} onChange={(e)=>{newPass(e)}} className={PasswordChangeCss.inputData} type="password" placeholder="New password"/>
                    <FontAwesomeIcon onClick={(e)=>{eyeClickednew(e)}} id="new" icon={faEye} className={PasswordChangeCss.eye}/>
                </div>

                <div className={PasswordChangeCss.ConatinerINputAndICon}>
                    <input ref={confirmref} onChange={(e)=>{confirmpass(e)}} className={PasswordChangeCss.inputData} type="password" placeholder="Confirm password"/>
                    <FontAwesomeIcon onClick={(e)=>{eyeClickedconfirm(e)}} id="confirm" icon={faEye} className={PasswordChangeCss.eye}/>
                </div>
                
            </div>
            
            <div className={NameUpdateCss.BtncontainerUpdatename}>
                <button className={NameUpdateCss.updatenameSubmit} type="button" onClick={(e)=>{submitBtn()}}>submit</button>
                <button className={NameUpdateCss.updatenamecancel} type="button" onClick={(e)=>{CancelFunct()}}> cancel</button>
            </div>
            
        </form>
    </div>
        </div>
}

export default ChangePassword;
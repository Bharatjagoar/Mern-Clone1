import React from "react";
import RightsideCSS from "./rightmenu.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DisplayPicture from "./sides/DisplayPicture";
import {useNavigate} from "react-router-dom"
import {
    faFacebookMessenger, faLess
} from "@fortawesome/free-brands-svg-icons"
// import {} from "@fortawesome/free-regular-svg-icons"
import {
    faAdd,faBell,
    faGear,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useState ,useRef} from "react";
import { useEffect } from "react";
import axios from "axios";



function RightsideMenu(){
    const navigate = useNavigate()
    const DpRef=useRef(null);
    const btnRef =useRef(null)
    const [style,setStyle]=useState(true)
    function btnpressed(){
        // console.log(btnRef.current.className,"btn pressed")
        setStyle(false)
    }
    function updateProfile(){
        console.log("he")
        navigate("/Settings")
    }
    function destroy(){
        const logout = axios.post("http://localhost:5000/User/logout",{withCredentials:true})
        logout.then(()=>{
            document.location.reload()
        })
        logout.catch((err)=>{
            console.log(err)
        })
    }
    useEffect(()=>{
        // console.log(DpRef.current.className)
        // console.log(btnRef.current.className)
        document.addEventListener("click",(e)=>{
            // console.log(DpRef.current.className,"this is ther")
            var windows=e.target.className
            // console.log(windows,"this is class required")
            if(!(windows==DpRef.current.className || windows==btnRef.current.className)){
                setStyle(true)
            }
        })
    })
    
    return <div className={RightsideCSS.right}>
        <div className={RightsideCSS.outerside}><FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faAdd} /></div>
        <div className={RightsideCSS.outerside}><FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faFacebookMessenger}/></div>
        <div className={RightsideCSS.outerside}><FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faBell}/></div>
        <div className={RightsideCSS.outerside} id="#windows"> <button className={RightsideCSS.ProfileBtn} ref={DpRef}  onClick={()=>{btnpressed()}}><DisplayPicture name={btnRef}/></button>
            <div className={RightsideCSS.ProfileSetting} style={style?{display:"none"}:{display:"block"}}>
                <div className={RightsideCSS.ProfileMenu}><button onClick={()=>{destroy()}}><FontAwesomeIcon icon={faRightFromBracket} /> logout</button></div>
                <hr/>
            <div className={RightsideCSS.ProfileMenu}><button onClick={()=>{updateProfile()}}> <FontAwesomeIcon icon={ faGear}/> Settings </button></div>
            </div>
        </div>
        
    </div> 
}
{/* <img src="/static/media/BlankImage.2099e5a8dc8f7c3c685f.jpg" class="displayPicture_image__LseWT"> */}

export default RightsideMenu;
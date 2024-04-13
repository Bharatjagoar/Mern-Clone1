import React from "react";
import RightsideCSS from "./rightmenu.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DisplayPicture from "./sides/DisplayPicture";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
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
import socket from "../../socket";
import { motion } from "framer-motion";
import axios from "axios";




function RightsideMenu(){
    const [requestnumber,setrequestnumber]=useState()
    const navigate = useNavigate()
    const [ReqCounts,setReqCounts]=useState()
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
    async function numbersetting() {
            const FrRooms = await axios.get("http://localhost:5000/User/FriendsRequestCheck")
            // console.log(FrRooms.data.RevievedFriendsRQ.length)
            setReqCounts(FrRooms.data.RevievedFriendsRQ.length)
    }
    useEffect(()=>{

        socket.on("onlineFriends",()=>{
            alert("hello world !!")
            numbersetting()
            setrequestnumber(true)
            // console.log(Date.now().toLocaleString())
            timeOut()
        })
        document.addEventListener("click",(e)=>{
            var windows=e.target.className
            if(!(windows==DpRef.current.className || windows==btnRef.current.className)){
                setStyle(true)
            }
        })
        console.log(requestnumber,Date.now().toLocaleString(),"fdsafdsadfsaf")
    },[])
    
    async function timeOut(){
        setTimeout(() => {
            setrequestnumber(false)
            console.log(Date.now().toLocaleString(),"under time out ")
        }, 2000);
        
    }

    return <div className={RightsideCSS.right}>
        <motion.div whileTap={{scale:0.8}} className={RightsideCSS.outerside}><FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faAdd} /></motion.div>
        <motion.div whileTap={{scale:0.8}} className={RightsideCSS.outerside}><FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faFacebookMessenger}/></motion.div>
        <motion.div whileTap={{scale:0.8}} className={RightsideCSS.outerside}>
            
            {requestnumber?<div className={RightsideCSS.totalFriendsRequest}>{ReqCounts}</div>:null}
            <FontAwesomeIcon className={RightsideCSS.rightFonticons} icon={faBell}/>
        </motion.div>
        <motion.div className={RightsideCSS.outerside} id="#windows"><button className={RightsideCSS.ProfileBtn} ref={DpRef}  onClick={()=>{btnpressed()}}><DisplayPicture name={btnRef}/></button>
            <div className={RightsideCSS.ProfileSetting} style={style?{display:"none"}:{display:"block"}}>
                <div className={RightsideCSS.ProfileMenu}><button onClick={()=>{destroy()}}><FontAwesomeIcon icon={faRightFromBracket} /> logout</button></div>
                <hr/>
            <div className={RightsideCSS.ProfileMenu}><button onClick={()=>{updateProfile()}}> <FontAwesomeIcon icon={ faGear}/> Settings </button></div>
            </div>
        </motion.div>
        
    </div> 
}

export default RightsideMenu;
import React from "react";
import rightCSS from "./Rightside.module.css"
import axios from "axios"
import {useNavigate} from "react-router-dom";
import { motion } from "framer-motion";

function Rightside(){
    const navigate = useNavigate()
    function destroy(){
        const logout = axios.post("http://localhost:5000/User/logout",{withCredentials:true})
        logout.then(()=>{
            document.location.reload()
        })
        logout.catch((err)=>{
            console.log(err)
        })
    }
    return <>
    <div className={rightCSS.outermost}>
    <h1 className={rightCSS.header}>chatbox</h1>
    <div className={rightCSS.chatboxcontainer}>
    <motion.div className={rightCSS.chatbox} whileTap={{scale:0.98}}>
        fdsa
    </motion.div>
    </div>
    

    </div>
    </>
    
}


export default Rightside;
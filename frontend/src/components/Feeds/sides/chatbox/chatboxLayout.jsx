import React from "react";
import { motion } from "framer-motion";
import ChatboxCSS from "./chatbox.module.css"
import ChatBoxHeader from "./chatboxHeader";
import ChatBody from "./chatboxBody";
import { useSelector } from "react-redux";


const Chatbox = function ({data}){
    // const {ChatUserDetails}  = useSelector(state=>state.custom)
    console.log("this is user chat details",data)
    return <>
        <motion.div whileTap={{scale:0.99}} className={ChatboxCSS.mainDiv} >
            <ChatBoxHeader data={data}/>
            <ChatBody/>
        </motion.div>
    </>
}


export default Chatbox;

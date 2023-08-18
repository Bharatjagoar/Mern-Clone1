import React,{useEffect, useState} from "react";
import FeedsNavBar from "../Navbar";
import {useDispatch, useSelector} from "react-redux"

import Leftside from "./leftSide";
import panesCSS from "./panes.module.css"
import {motion} from "framer-motion"
import Rightside from "./rightside";
// import { useDispatch,useSelector } from "react-redux";

function Panes({obj}){
    const [chattingengine,setchattingengine]=useState(false)
    const dispatch = useDispatch()
    const { chatengine } = useSelector(state=>state.custom)
    useEffect(()=>{
        setchattingengine(chatengine)
    },[chatengine])
    

    
    console.log(chatengine)

    document.title="Facebook"
    obj.emit("loggedinUser",{message:"bharat jagoar"})
    return <div className={panesCSS.mainConatiner}>
        <FeedsNavBar/>
        <div className={panesCSS.flex}>
            <Leftside object={obj}/>
            <Rightside/>
        </div>
        {chattingengine?
         <motion.div className={panesCSS.ChattinWindow}
         whileTap={{scale:0.8}}
         onClick={()=>{}}
         >
         <h2>fdsaasdfadfdsa</h2>
     </motion.div>:
     null    
    }
        
    </div>
}

export default Panes;
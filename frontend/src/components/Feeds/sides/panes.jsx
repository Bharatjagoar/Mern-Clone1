import React,{useEffect, useState} from "react";
import FeedsNavBar from "../Navbar";
import {useDispatch, useSelector} from "react-redux"
// import { motion } from "framer-motion";
import Leftside from "./leftSide";
import panesCSS from "./panes.module.css"
import {motion} from "framer-motion"
import Rightside from "./rightside";
import Chatbox from "./chatbox/chatboxLayout";
// import { useDispatch,useSelector } from "react-redux";

function Panes({obj}){
    
    const [chattingengine,setchattingengine]=useState(false)
    const [chatboxdivs,setchatboxdivs] = useState([])
    const {ChatUserDetails}  = useSelector(state=>state.custom)
    const dispatch = useDispatch()
    const { chatengine } = useSelector(state=>state.custom)
    useEffect(()=>{
        setchatboxdivs(prevelement=>[...prevelement,ChatUserDetails])
    },[ChatUserDetails])
    
    
    
    const fun=function (data){
        return data!=null
    }
    var arr=chatboxdivs.filter(fun)
    console.log(chatboxdivs,"divs")
    document.title="Facebook"
    console.log(arr,"this is arrrrrrrr")
    obj.emit("loggedinUser",{message:"bharat jagoar"})
    return <div className={panesCSS.mainConatiner}>
        <FeedsNavBar/>
        <div className={panesCSS.allcontainer}>
            <div>
            <h1>2</h1>
                {
                    arr.map((data,index)=>{
                        return(
                        <div key={index}>
                            <Chatbox data={data}/>
                        </div>
                        )
                    })
                }
            </div>
        
        <div className={panesCSS.flex}>
            <Leftside />
            <Rightside/>
        </div>
        </div>
        
        
        {chattingengine?
         <motion.div className={panesCSS.ChattinWindow}
         whileTap={{scale:0.8}}
         onClick={()=>{}}
         >
         <h2>bharat</h2>
     </motion.div>:
     null    
    }
        
    </div>
}

export default Panes;
import React from "react";
import DisplayPicture from "../DisplayPicture";
import chatboxheaderCSS from "./chatboxHeader.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons"
const ChatBoxHeader = function ({data}){
    console.log(data,"in display")
    let srcc =data.displayPicture?data.displayPicture:null
    return<>
        <div className={chatboxheaderCSS.mainContainer}>
            <div className={chatboxheaderCSS.dpcontainer}>
                <DisplayPicture pic={srcc}/>
                <p className={chatboxheaderCSS.chatusername}>{data.fname +"   "+data.lname}</p>
            </div>
            
            <FontAwesomeIcon  icon={faXmark} size={"2x"} className={chatboxheaderCSS.closebtn}/>
        
        </div>
        
    </>
}

export default ChatBoxHeader;
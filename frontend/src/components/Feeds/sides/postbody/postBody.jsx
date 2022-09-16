import React from "react";
import { Navigate } from "react-router-dom";
import PostBodyCSS from "./postBoyd.module.css"



function PostBody(props){
    return <div className={PostBodyCSS.OuterBody}>
        <h4 className={PostBodyCSS.captionPara}>{props.caption}</h4>
        <div className={PostBodyCSS.imagecontainer} > 
            <img src={props.src} alt="this i"  className={PostBodyCSS.imageTag}/>
        </div>
        
        
    </div>
}

export default PostBody;
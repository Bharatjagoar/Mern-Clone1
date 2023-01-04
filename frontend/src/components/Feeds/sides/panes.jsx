import React,{useEffect, useState} from "react";
import FeedsNavBar from "../Navbar";
import {useDispatch, useSelector} from "react-redux"
import axios from "axios"
import Leftside from "./leftSide";
import panesCSS from "./panes.module.css"
import Rightside from "./rightside";
// import {} from ""

function Panes({obj}){
    document.title="Facebook"
    obj.emit("loggedinUser",{message:"bharat jagoar"})
    return <div>
        <FeedsNavBar/>
        <div className={panesCSS.flex}>
            <Leftside object={obj}/>
            <Rightside/>
        </div>
    </div>
}

export default Panes;
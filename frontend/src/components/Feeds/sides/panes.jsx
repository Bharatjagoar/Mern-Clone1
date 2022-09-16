import React,{useEffect, useState} from "react";
import FeedsNavBar from "../Navbar";
import {useDispatch, useSelector} from "react-redux"
import axios from "axios"
import Leftside from "./leftSide";
import panesCSS from "./panes.module.css"
import Rightside from "./rightside";
// import {} from ""

function Panes(){
    document.title="Facebook"
    
    return <div>
        <FeedsNavBar/>
        <div className={panesCSS.flex}>
            <Leftside/>
            <Rightside/>
        </div>
    </div>
}

export default Panes;
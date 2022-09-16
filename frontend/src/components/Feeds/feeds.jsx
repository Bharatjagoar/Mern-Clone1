import React from "react"
import FeedsNavBar from "./Navbar"
import { Outlet } from "react-router-dom"
import FeedsCSS from "./feeds.module.css"
import Panes from "./sides/panes";




function Feeds(){
    return <div className={FeedsCSS.main}>
        <FeedsNavBar/>
    </div>
}

export default Feeds;
import React from "react";
import FeedsNavBar from "../Feeds/Navbar";
import FreindsLeft from "./panes/FriendsLeft";
import FriendsRight from "./panes/friendsRight";
import FriendsPageCss from "./FriendsPage.module.css"
import axios from "axios";



function Frineds(){
    const Friends= async ()=>{
        console.log("hello worlds")
    }
    return <div>
        <FeedsNavBar/>
        <div className={FriendsPageCss.container}>
            <div className={FriendsPageCss.FriendsLeft}><FreindsLeft/></div>
            <div className={FriendsPageCss.FriendsRight}><FriendsRight/></div>
        </div>
    </div>
}


export default Frineds;
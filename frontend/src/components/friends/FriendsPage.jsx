import React from "react";
import FeedsNavBar from "../Feeds/Navbar";
import FreindsLeft from "./panes/FriendsLeft";
import FriendsRight from "./panes/friendsRight";
import FriendsPageCss from "./FriendsPage.module.css"



function Frineds(){
    return <div>
        <FeedsNavBar/>
        <div className={FriendsPageCss.container}>
            <div className={FriendsPageCss.FriendsLeft}><FreindsLeft/></div>
            <div className={FriendsPageCss.FriendsRight}><FriendsRight/></div>
        </div>
    </div>
}


export default Frineds;
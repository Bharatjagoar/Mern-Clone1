import React, { useState } from "react";
import feedsNavbarCSS from "./feedsNavbar.module.css"
import RightsideMenu from "./rightmenu";
import {useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCoffee,
    faMagnifyingGlass,
    faHouse,
    faUserGroup,
    faBars
} from "@fortawesome/free-solid-svg-icons"


function FeedsNavBar(){
    const usenave= useNavigate();
    const [home,sethome]=useState(false);
    const [more,setmore]=useState(false);
    const [friends,setfriends]=useState(false);

    function centraldiv(e){
        setfriends(false)
        setmore(false)
        sethome(false)
        switch (e.target.id) {
            case "Home":
                console.log("home")
                usenave("/panes")
                sethome(true)
                break;
            case "Friends":
                usenave("/friends")
                setfriends(true)
                break
            case "More":
                setmore(true)
                console.log("more")
                break
            default:
                break;
        }    
        
    }
        let stylethis= {
            color:"#1B74E4",
            borderBottom: "5px #1B74E4 solid",
        }
    return <div className={feedsNavbarCSS.parentNavbar}>
        <div className={feedsNavbarCSS.logo}>
            <img src="https://res.cloudinary.com/dyjngm7az/image/upload/v1663238102/xchjascf8xwse2pio7te.png" alt="fdsafdsa" />     
            <div className={feedsNavbarCSS.SearchBoxContainer}><FontAwesomeIcon icon={faMagnifyingGlass} className={feedsNavbarCSS.windows} size="2x"/></div>
        </div>
        <div className={feedsNavbarCSS.stylethisdiv}>
            <div className={feedsNavbarCSS.outerIconDiv} style={home?stylethis:null} onClick={(e)=>{centraldiv(e)}} id="Home" > <FontAwesomeIcon icon={faHouse}  className={feedsNavbarCSS.styling}/></div>
            <div className={feedsNavbarCSS.outerIconDiv} style={friends?stylethis:null} onClick={(e)=>{centraldiv(e)}} id="Friends" >  <FontAwesomeIcon icon={faUserGroup} className={feedsNavbarCSS.styling}/></div>
              <div className={feedsNavbarCSS.outerIconDiv} style={more?stylethis:null} onClick={(e)=>{centraldiv(e)}} id="More" >  <FontAwesomeIcon icon={faBars} className={feedsNavbarCSS.styling}/></div>
        </div>
        <RightsideMenu/>
    </div>
}

export default FeedsNavBar;
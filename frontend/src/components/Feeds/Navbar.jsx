import React, { useState } from "react";
import feedsNavbarCSS from "./feedsNavbar.module.css"
import RightsideMenu from "./rightmenu";
import {useNavigate,} from "react-router-dom"
import socket from "../../socket";
import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCoffee,
    faMagnifyingGlass,
    faHouse,
    faUserGroup,
    faBars
} from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react";


function FeedsNavBar(){
    const usenave= useNavigate();
    const [home,sethome]=useState(false);
    const [more,setmore]=useState(false);
    const [friends,setfriends]=useState(false);
    const [friendsRequest,setfriendsRequest] = useState(false)

    useEffect(()=>{
        console.log("he")
    },[])

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
                break;

            case "friendsChild":
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
    const image = ()=>{
        usenave("/")
    }
        let stylethis= {
            color:"#1B74E4",
            borderBottom: "5px #1B74E4 solid",
        }
        let REQ={
            backgroundColor: "red"
        }
        let iconStyle={
            color: "white"
        }
    // socket.on("onlineFriends",()=>{
    //     alert("hello world ")
    //     console.log("helfdasaaaaaaaaaaaaaaaaaaaaaaa")
    //     // console.log(friendsRequest)
    //     // setfriendsRequest(friendsRequest? false:true)
    // })




    return <div className={feedsNavbarCSS.parentNavbar}>
        <div className={feedsNavbarCSS.logo}>
            <img onClick={()=>{image()}} 
            src="https://res.cloudinary.com/dyjngm7az/image/upload/v1663238102/xchjascf8xwse2pio7te.png" 
            alt="fdsafdsa" />     
            <div className={feedsNavbarCSS.SearchBoxContainer}><FontAwesomeIcon icon={faMagnifyingGlass} className={feedsNavbarCSS.windows} size="2x"/></div>
        </div>
        <div className={feedsNavbarCSS.stylethisdiv}>
            <div className={feedsNavbarCSS.outerIconDiv} style={home?stylethis:null} onClick={(e)=>{centraldiv(e)}} id="Home" > <FontAwesomeIcon icon={faHouse} className={feedsNavbarCSS.styling}/></div>
            <div className={feedsNavbarCSS.outerIconDiv} onClick={(e)=>{centraldiv(e)}} id="Friends" > 
                <div className={feedsNavbarCSS.innericonFriendsDiv}
                 style={friendsRequest?REQ:null} 
                 onClick={(e)=>{centraldiv(e)}} id="friendsChild">
                    <FontAwesomeIcon icon={faUserGroup} className={feedsNavbarCSS.styling} style={friendsRequest?iconStyle:null}/>
                </div>
            </div>
            <div className={feedsNavbarCSS.outerIconDiv} style={more?stylethis:null} onClick={(e)=>{centraldiv(e)}} id="More" >  <FontAwesomeIcon icon={faBars} className={feedsNavbarCSS.styling}/></div>
        </div>
        <RightsideMenu/>
    </div>
}

export default FeedsNavBar;
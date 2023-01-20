import React from "react";
import {useNavigate} from "react-router-dom"
import FriendsLeftCss from "./FriendsLeft.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPaperPlane,faUsers,faUserPlus,faGift,faUserGroup} from "@fortawesome/free-solid-svg-icons"
import {faSquareInstagram} from "@fortawesome/free-brands-svg-icons"
import {faUser,faGrinSquintTears} from "@fortawesome/free-regular-svg-icons"

function FreindsLeft() {
    const Navi = useNavigate();
    const optionClicked = (nav)=>{
        console.log("hello",nav)
        Navi("/friends"+nav)
    }
    const arr=[
        {
            title:"Home",
            nav:"",
            icon:faUserGroup
        },
        {
            title:"Friend Requests",
            nav:"/Friendsrequests",
            icon:faUserPlus
        },
        {
            title:"suggestion",
            nav:"/suggestion",
            icon:faUser
        },
        {
            title:"All Friends",
            nav:"/AllFriends",
            icon:faUsers
        },
        {
            title:"Birthdays",
            nav:"",
            icon:faGift
        }
    ]



    return <div className={FriendsLeftCss.outerMostDiv}>
        <h2 className={FriendsLeftCss.header}>Friends</h2>
        <div className={FriendsLeftCss.options}>
            {
                arr.map((element)=>{
                    console.log(element)
                    return <div key={element.title} onClick={()=>{optionClicked(element.nav)}} className={FriendsLeftCss.container}>
                        <div className={FriendsLeftCss.iconcontainer}>
                            <div className={FriendsLeftCss.circleDiv}>
                                <FontAwesomeIcon className={FriendsLeftCss.optionsIcon} icon={element.icon} />
                            </div>
                            
                        </div>
                        <div className={FriendsLeftCss.TitleContainer}>
                            <h4 className={FriendsLeftCss.Title}>{element.title}</h4>
                        </div>
                        
                    </div>
                })
            }
        </div>
    </div>
}


export default FreindsLeft;
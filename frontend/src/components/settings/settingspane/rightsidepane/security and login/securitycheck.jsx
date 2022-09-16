import React from "react";
import SecurityAndLoginContainerCss from "./securityandloginContiner.module.css"
import axios from "axios";
import platform from "platform"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons"
import DevicesNames from "./devicelist";


function SecurityAndLoginContainer(){
    console.log(platform.description,"this is desc")
    function btnclicked(e){

        e.preventDefault()
    }

    return <div className={SecurityAndLoginContainerCss.outermostDiv}>
        <h2 className={SecurityAndLoginContainerCss.Mainheading}>Security and login</h2>
        <div className={SecurityAndLoginContainerCss.recommendation}>
            <h4 className={SecurityAndLoginContainerCss.recommendationHead}>Recommended</h4>
            <div className={SecurityAndLoginContainerCss.checktheimportant}>
                <div className={SecurityAndLoginContainerCss.iconcontainer}>
                    <FontAwesomeIcon icon={faCheckCircle} className={SecurityAndLoginContainerCss.Check}/>
                </div>
                <div className={SecurityAndLoginContainerCss.paraContainer}>
                    <p>Check your important security settings</p>
                    <p className={SecurityAndLoginContainerCss.secondpara}>We'll take you through some steps to help protect your account.</p>
                </div>
            </div>
        </div>
        <DevicesNames/>
    </div>
    
}

export default SecurityAndLoginContainer;
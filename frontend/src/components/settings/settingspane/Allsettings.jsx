import React from "react";
import AllsettingsCss from "./Allsettings.module.css"
import {useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGear,
        faShield,
        faCircleQuestion,
        faLock,
        faTag,
        faEarthAmericas,
        faUserLock
} from "@fortawesome/free-solid-svg-icons"

function AllSettings(){
	const navr =useNavigate();
    const settings=[
        {
            text:"general setting",
            icon:faGear,
            Link:""
    }, {
            text:"Security and login",
            icon:faShield,
            Link:"/securityLogin"
    },{
            text:"Login Information",
            icon:faCircleQuestion,
            Link:"/LoginInfo"
    },{
            text:"Privacy",
            icon:faLock,
            Link:"/Privacy"
    },{
            text:"Profile and Tagging",
            icon:faTag,
            Link:"/ProfileAndTagging"
    },{
            text : "public post",
            icon:faEarthAmericas,
            Link:"/PublicPost"
    },{
            text : "Blocking",
            icon:faUserLock,
            Link:"/Blocking"
    }

]
        function thisedit(sev){
		navr("/Settings"+sev.Link)
        }
    return <div className={AllsettingsCss.mappingContainer}>{
        settings.map((set,pos)=>{
        return <div key={pos} className={AllsettingsCss.container} onClick={()=>{thisedit(set)}}>
                <div className={AllsettingsCss.windows}>
                        {<FontAwesomeIcon icon={set.icon} className={AllsettingsCss.seting} />}
                        <p className={AllsettingsCss.settingdescription}>{set.text}</p>
                </div>
        </div>
    })
        }
    </div>

}
export default AllSettings;

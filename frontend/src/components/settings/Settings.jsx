import React from "react";
import FeedsNavBar from "../Feeds/Navbar";
import LeftSettingsPane from "./settingspane/leftsettingPanes";
import RightSettingsPane from "./settingspane/rightSettingpanes";
import SettingsCss from "./settings.module.css"


function Settings(){
    document.title="Settings and privacy | Facebook"
    return <>
        <FeedsNavBar />
        <div className={SettingsCss.OuterMost}>
            <div className={SettingsCss.leftside}><LeftSettingsPane/></div>
            <div className={SettingsCss.rightSide}><RightSettingsPane/></div>
        </div>
        
    </>
}

export default Settings;
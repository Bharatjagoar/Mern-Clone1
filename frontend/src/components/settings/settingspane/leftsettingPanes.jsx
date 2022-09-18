import React from "react";
import LeftsideSettings from "./leftsettingPanes.module.css"
import AllSettings from "./Allsettings";


function LeftSettingsPane(){
    console.log("helll world ")
    return <div className={LeftsideSettings.containerDiv}>
        <h1 className={LeftsideSettings.headone}>Settings</h1>
        <AllSettings/>
    </div>
}

export default LeftSettingsPane;
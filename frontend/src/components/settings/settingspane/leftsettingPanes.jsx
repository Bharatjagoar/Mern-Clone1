import React from "react";
import LeftsideSettings from "./leftsettingPanes.module.css"
import AllSettings from "./Allsettings";


function LeftSettingsPane(){
    
    return <div className={LeftsideSettings.containerDiv}>
        <h1 className={LeftsideSettings.headone}>Settings</h1>
        <AllSettings/>
    </div>
}

export default LeftSettingsPane;
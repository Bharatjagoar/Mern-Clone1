import React from "react";
import PasswordupdateCss from "./passwordupdate.module.css"


function Password(){
    
        return <div className={PasswordupdateCss.outerMostdiv}>
            <div className={PasswordupdateCss.headingContainer}>
                <h3 className={PasswordupdateCss.heading}>Password</h3>
            </div>
            <div className={PasswordupdateCss.content}>
                <div className={PasswordupdateCss.contentdivone}></div>
                <div className={PasswordupdateCss.contentdivtwo}></div>
                <div className={PasswordupdateCss.contentdivthree}></div>
            </div>
        </div>
}
export default Password;
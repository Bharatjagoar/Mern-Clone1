import React from "react";
import SecurityAndLoginContainer from "./security and login/securitycheck";
import SecurityAndLoginCss from "./securityAndLogin.module.css"
import Password from "./security and login/passwordupdate";

function SecurityAndLogin(){
    
    return <div className={SecurityAndLoginCss.outerDiv}>
        <SecurityAndLoginContainer/>
        <Password/> 
    </div>
}

export default SecurityAndLogin;
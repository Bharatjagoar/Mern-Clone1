import React from "react";
import SecurityAndLoginContainer from "./security and login/securitycheck";
import SecurityAndLoginCss from "./securityAndLogin.module.css"

function SecurityAndLogin(){
    
    return <div className={SecurityAndLoginCss.outerDiv}>
        <SecurityAndLoginContainer/>        
    </div>
}

export default SecurityAndLogin;
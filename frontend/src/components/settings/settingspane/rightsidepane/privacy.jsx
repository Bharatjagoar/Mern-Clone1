import React from "react";
import privacyCss from "./privacy.module.css"
import InsidePrivacy from "./privacy/InsidePrivacy";

function Privacy(){

    return <div className={privacyCss.NoneDiv}>
        <InsidePrivacy/>
    </div>
}

export default Privacy;
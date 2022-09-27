import React from "react";
import InsidePrivacyCss from"./InsidePrivacy.module.css"

function InsidePrivacy(){
    function thisisclicked(){
        alert("clicked")
    }



    return <div className={InsidePrivacyCss.OuterMostdiv}>
        <div className={InsidePrivacyCss.hedingcontainer}>
            <h2 className={InsidePrivacyCss.Componentheading}>Privacy Settings and Tools</h2>
        </div>
        <div className={InsidePrivacyCss.contentContainerDiv}>
            <div className={InsidePrivacyCss.generasubcontainerDiv}>
                <div className={InsidePrivacyCss.Privacyshortcutsleft}>
                    <h3>Privacy shortcuts</h3>
                </div>
                <div className={InsidePrivacyCss.Privacyshortcutsright}>
                    <div onClick={()=>{thisisclicked()}} className={InsidePrivacyCss.contenDiv}>
                        <p>Check a few important settings</p>
                        <p style={{color:"#8a888b",fontSize:"0.9rem",margin:"5px 0px 0px 0px "}}>Quickly review some important settings to make sure that you're sharing with the people you want.</p>
                    </div>
                    <div onClick={()=>{thisisclicked()}} className={InsidePrivacyCss.contenDiv}>
                        <p>Manage your profile</p>
                        <p style={{color:"#8a888b",fontSize:"0.9rem",margin:"5px 0px 0px 0px "}}>Go to your profile to change your profile information privacy, such as who can see your date of birth or relationships.</p>
                    </div>
                    <div onClick={()=>{thisisclicked()}} className={InsidePrivacyCss.contenDiv}>
                        <p>Learn more about privacy basics </p>
                        <p style={{color:"#8a888b",fontSize:"0.9rem",margin:"5px 0px 0px 0px "}}>get your common questions answer in the guide</p>
                    </div>
                </div>
                
                </div>

                <div className={InsidePrivacyCss.generasubcontainerDiv}>
                    <div className={InsidePrivacyCss.YourActivityLeftDiv}>
                        <h3>Your activity</h3>
                    </div>
                    <div className={InsidePrivacyCss.YourActivityrightDiv}>
                        <div className={InsidePrivacyCss.YourActivityrightDivsubcontainer}>
                            <div><p>who can see your future post ?</p></div> 
                            <div><p> <b>only me</b> </p></div>
                            <div><p>edit</p></div>
                        </div>
                        
                        <div className={InsidePrivacyCss.YourActivityrightDivsubcontainer}>
                            fdsfds
                        </div>
                    </div>
                    
                </div>
                




        </div>
        
        
    </div>
}

export default InsidePrivacy;
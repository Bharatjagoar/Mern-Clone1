import React from "react";
import DisplayPictureCSS from "./displayPicture.module.css"

function DisplayPicture({name}){
    const srces="https://res.cloudinary.com/dyjngm7az/image/upload/v1663294887/fcaynjnwvdhgxh3trdjc.jpg"
    return <div className={DisplayPictureCSS.containerDIV}>
        <img src={srces} ref={name} className={DisplayPictureCSS.image}/>
    </div>
}

export default DisplayPicture;
import React from "react";
import Left from "./left";
import Right from "./right";


function Home(){
    document.title="Facebook - log in or sign up"
    return <div className="home">
        <Left/>
        <Right/>
    </div>
}


export default Home
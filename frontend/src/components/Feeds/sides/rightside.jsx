import React from "react";
import rightCSS from "./Rightside.module.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"

function Rightside(){
    const navigate = useNavigate()
    function destroy(){
        const logout = axios.post("http://localhost:5000/User/logout",{withCredentials:true})
        logout.then(()=>{
            document.location.reload()
        })
        logout.catch((err)=>{
            console.log(err)
        })
    }
    return 
}


export default Rightside;
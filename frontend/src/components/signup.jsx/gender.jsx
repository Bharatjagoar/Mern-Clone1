import React from "react";
import genderCSS from "./Gender.module.css"
import {useDispatch} from "react-redux"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";



function Gender(){
    const dispatch = useDispatch()
    function genderinput(e){
        dispatch({
            type:"genderSelection",
            payload:e.target.value
        })
    }
    return  <> <div className={genderCSS.thisdiv}>
        <label className={genderCSS.label} htmlFor="male">Male</label>
        <input onClick={(e)=> {genderinput(e)}} type="radio" id="male" value="male" name="gender"/>
        <label htmlFor="female" className={genderCSS.label}>Female</label>
        <input onClick={(e)=> {genderinput(e)}} type="radio" value="female" name="gender" id="female"/>
    </div> 
    <div className={genderCSS.termsandcondi}><h5>By clicking Sign Up, you agree to our <a href="">Terms, Data Policy </a> and <a href="">Cookie Policy</a> . You may receive SMS notifications from us and can opt out at any time.</h5></div>
    </>
}

export default Gender;
import React from "react";
import { useState } from "react";
import axios from "axios";
import NameUpdateCss from "./nameupdate.module.css"
import {useSelector,useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"


function NameUpdate(props){
    const dispatch=useDispatch();
    const navr = useNavigate();
    const {Sess} = useSelector(state=>state.custom)
    const[fname,setFname]=useState();
    const [lname,setlname]=useState();
    function btnReaction(event){

        axios.patch("http://localhost:5000/User/UpdateInfoName/"+Sess._id,
        {
            fname:fname,
            lname:lname
        }).then((respo)=>{
            console.log(respo.data,"\n\n\n this was data ")
            dispatch({
                type:"Session",
                payload:respo.data
              })
        })
        .catch((err)=>{
            console.log(err)
            console.log("this is the error !! from updation of name !!")
        })
        props.func()
        event.preventDefault();
    }
    function Fnameon(e){
        let fname=e.target.value;
        fname=fname.replace(/\s/g,"")
        setFname(fname)
        console.log(fname);
    }
    function Lnameon(e){
        let lname=e.target.value;
        lname=lname.replace(/\s/g,"")
        setlname(e.target.value)
        console.log(lname)
    }
    return <div>
        <form method="put" action="" className={NameUpdateCss.forum}>
            <h3 className={NameUpdateCss.headingOftheForm}>Name update </h3>
            <input onChange={(e)=>{Fnameon(e)}} className={NameUpdateCss.inputData} type="text" placeholder="enter the first name"/>
            <input onChange={(e)=>{Lnameon(e)}} className={NameUpdateCss.inputData} type="text" placeholder="enter the last name "/>
            <div className={NameUpdateCss.BtncontainerUpdatename}>
                <button className={NameUpdateCss.updatenameSubmit} type="button" onClick={(e)=>{btnReaction(e)}}>submit</button>
                <button className={NameUpdateCss.updatenamecancel} type="button" onClick={props.func}> cancel</button>
            </div>
            
        </form>
    </div>
}
export default NameUpdate;
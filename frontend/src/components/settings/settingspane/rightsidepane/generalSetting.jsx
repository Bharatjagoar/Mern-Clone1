import React from "react";
import generalSettingCss from "./generalSetting.module.css"
import {useSelector} from "react-redux"
import NameUpdate from "./updation forms/nameupdation";
import { useState,useRef } from "react";


function GeneralSetting(){
    const [username,setuesrname]=useState(false);
    const {Sess} = useSelector(state=>state.custom)
    let number=Math.random()
    function thisEdit(item){
        console.log("hello")
        console.log(item)
        if(item.Name=="Name"){
            setuesrname(true)
        }
    }
    function removetheform(){
        setuesrname(false)
    }
    const array=[{Name:"Name",data:Sess.fname+" "+Sess.lname},
        {Name:"Username",data:"https://facebook.com/"+Sess.fname+Sess.lname+"/"+Math.floor(number*1000000)},
        {Name:"contact",data:Sess.UserName},
        {Name:"Memorialzition",data:"We'll let your legacy contact know that you've chosen them. They won't be notified again until your account is memorialised."},
        {Name:"identity Confirmation",data:"We'll let your legacy contact know that you've chosen them. They won't be notified again until your account is memorialised."}

    ]


    return <div >
            <h2 className={generalSettingCss.heading}>General Account Setting </h2>
            <hr />
            <div className={generalSettingCss.GeneralsettingDescription}>
                {array.map((item,pos)=>{
                    return <div key={pos} className={generalSettingCss.innercontainerGeneral}>
                        <div className={generalSettingCss.onediv}><p>{item.Name}</p></div>
                    <div className={generalSettingCss.twodiv}>{username&&pos===0?<NameUpdate func={removetheform}/>:<p>{item.data}</p>}</div>
                    <div className={generalSettingCss.threediv}>{!username?<p onClick={()=>{thisEdit(item)}} style={pos==0?{cursor:"pointer"}:{cursor:"none"}}>Edit</p>:null}</div>
                    </div>

                })}
                
            </div>
    </div>
}
export default GeneralSetting;



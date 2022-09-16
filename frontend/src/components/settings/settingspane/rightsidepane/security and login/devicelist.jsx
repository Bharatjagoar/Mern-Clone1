import React from "react";
import DevicesCss from "./devicelist.module.css"
import {useSelector} from "react-redux"
import axios from "axios";
import platform from "platform"
import { useState } from "react";
import { useEffect } from "react";


function DevicesNames(){
    const [Devices,setdevices]= useState()
    
    useEffect( ()=>{
        const devicesRes= axios.get("http://localhost:5000/User/Getthedevices")
        devicesRes.then((res)=>{
            console.log(res.data)
            setdevices(res.data)
        })
        devicesRes.catch((err)=>{
            console.log(err,"this is the error !! ")
        })
    },[])
    function src(item){
        console.log(item,"fda")
        var srcs=""
        switch (item.os) {
            case "Windows":
                srcs="https://res.cloudinary.com/dyjngm7az/image/upload/v1663237888/zigsbnpz4zhjq8ozhj2w.png"
                break;
            case "Android":
                srcs="https://res.cloudinary.com/dyjngm7az/image/upload/v1663238394/da4vvruwb2dflmmc9ul2.png"
                break;
            case "iOS":
                srcs="https://res.cloudinary.com/dyjngm7az/image/upload/v1663254065/ks6ti4ghknhw5ags7ruh.jpg"
                break;
            default:
                break;
        }
        return srcs
    }


    return <div className={DevicesCss.outerMostcontainer}>
        <div className={DevicesCss.HeadingContainer}>
            <h4 className={DevicesCss.heading}>Logged in with these devices  </h4>
        </div>
        <div className={DevicesCss.parentMaincontainer}>
        <div className={DevicesCss.maincontainer}>
                <div className={DevicesCss.MappingContainer}> 
                    {
                        Devices?.map((item,pos)=>{
                            return (<div key={pos} className={DevicesCss.MapperDiv}>
                                <div className={DevicesCss.logoDiv}>
                                    <img src={src(item)} alt=""  className={DevicesCss.logos}/>
                                </div>
                                <div className={DevicesCss.Devicedetails}>{item.description}</div>
                            </div>)
                        })
                    }        
                </div>            
        </div>
        </div>
    </div>
}

export default DevicesNames;
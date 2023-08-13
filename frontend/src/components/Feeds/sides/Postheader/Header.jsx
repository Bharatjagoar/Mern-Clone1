import React from "react";
import HeaderPost from "./Header.module.css"
import DisplayPicture from "../DisplayPicture";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faTrash,
    faUserPlus,
    faCircleCheck
} from "@fortawesome/free-solid-svg-icons"
import Axios from "axios";
import { useSelector} from "react-redux"
import { useState } from "react";
import socket from "../../../../socket";
import axios from "axios";

function PostHeader({name,created,Post,media,user,deleted,display}){
    const[changeIcon,setchangeIcon]=useState(false)
    const {Sess}= useSelector(state=>state.custom)
    const date= new Date().getDate(created)
    const day =new Date().getDay(created)
    const month = new Date().getMonth(created)
    const year = new Date().getFullYear(created)
    
    console.log(display,"----------------------------------")
    // console.log(display)

    const time = new Date(Date.now()).getFullYear()
    // console.log(year,"fdafdsafdsafds ")
    // console.log(time)
    // console.log(nowdate.) 
    function deletethisPost(){
        return <div onClick={()=>{heloDelete(Post,media)} } className={HeaderPost.CrudPost}>
                    <FontAwesomeIcon icon={faTrash}/>
                </div>
    }
    async function heloDelete(post,med){
    
        const response=await Axios.get("http://localhost:5000/Post/deleteThisCloudinary?"+"post="+post+"&media="+med)
        response.then((result)=>{
            console.log(result.data)
            
        })
        .catch((err)=>{
            console.log(err)
        })
        
        console.log(post)
        deleted(post)
        // console.log("afd")
    }

    async function AddFriendClicked(){
        console.log(Sess.fname+" "+Sess.lname,"**************************************")
        console.log(user._id,"hari bol")
        const friends = await axios.get("http://localhost:5000/User/friendsUpdate/"+user._id)
        // console.log(friends.data)
        setchangeIcon(changeIcon?false:true)
        
        console.log(Sess._id)
        console.log(user)
        socket.emit("addFriends",{check:user})
    }



    // console.log(Sess._id,"\n",user._id)
    // Sess._id
    return <div className={HeaderPost.Header}>
        <DisplayPicture pic={display.displayPicture&&display.displayPicture}/>
        <div >
            <p className={HeaderPost.Name}>{name}</p> 
        </div>
        
            {Sess._id===user._id?deletethisPost():
            <FontAwesomeIcon icon={changeIcon?faCircleCheck:faUserPlus} 
            onClick={()=>{AddFriendClicked()}} 
            className={HeaderPost.IconAddfriend}
            />} 
        
        
    </div>
}

export default PostHeader;
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
import axios from "axios";

function PostHeader({name,created,Post,media,user,socketObject}){
    const[changeIcon,setchangeIcon]=useState(false)
    const {Sess}= useSelector(state=>state.custom)
    const date= new Date().getDate(created)
    const day =new Date().getDay(created)
    const month = new Date().getMonth(created)
    const year = new Date().getFullYear(created)
    function deletethisPost(){
        return <div onClick={()=>{heloDelete(Post,media)} } className={HeaderPost.CrudPost}>
                    <FontAwesomeIcon icon={faTrash}/>
                </div>
    }
    function heloDelete(post,med){
    
        const response=Axios.get("http://localhost:5000/Post/deleteThisCloudinary?"+"post="+post+"&media="+med)
        response.then((result)=>{
            console.log(result.data)
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    async function AddFriendClicked(){
        console.log(Sess.fname+" "+Sess.lname,"**************************************")
        
        setchangeIcon(changeIcon?false:true)    
    }
    

    return <div className={HeaderPost.Header}>
        <DisplayPicture />
        <div >
            <p className={HeaderPost.Name}>{name}</p> 
        </div>
        
            {Sess._id===user?deletethisPost():
            <FontAwesomeIcon icon={changeIcon?faCircleCheck:faUserPlus} 
            onClick={()=>{AddFriendClicked()}} 
            className={HeaderPost.IconAddfriend}
            />} 
        
        
    </div>
}

export default PostHeader;
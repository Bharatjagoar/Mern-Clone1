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
        socketObject.emit("helloworld",{room:user,username:Sess._id})
        socketObject.on("windows",()=>{
            console.log("windows 10 pro lets do it")
        })
        
        try {
            console.log("++++++++++++++++++++",user)
            const checkFriends = await axios.get('http://localhost:5000/User/Checkthefriend/'+user+'/'+Sess._id)
            console.log("---->>>>",checkFriends.data)            
            if(checkFriends.data.message){
                console.log("mesage",typeof(checkFriends.data.message))
                console.log("inside the if of check")
                try {
                    const addFriends = await axios.post("http://localhost:5000/User/AddFriend/"+user,{
                        friendid:Sess._id
                    })
                    console.log("add freinds psot request :: ",addFriends);
                    

                } catch (error) {
                    console.log("error at addfriends post request ",error);
                }
            }
            else{
                console.log("not")
                console.log("inside the else of checkfriends ")
                try {
                    const foundFriendsRq = await axios.patch("http://localhost:5000/User/UpdateFriends/"+user,{
                        friendid:Sess._id
                    })
                    console.log(foundFriendsRq,"789456123")
                } catch (error) {
                    console.log("error","\n",error)
                }
            }
        } catch (error) {
            console.log("error","\n",error)            
        }

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
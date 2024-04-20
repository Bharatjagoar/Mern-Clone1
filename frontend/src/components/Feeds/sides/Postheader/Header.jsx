import React, { useEffect } from "react";
import HeaderPost from "./Header.module.css"
import { useDispatch } from "react-redux"
import {motion} from "framer-motion"
import DisplayPicture from "../DisplayPicture";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCreativeCommonsPd, faFacebookMessenger} from "@fortawesome/free-brands-svg-icons"
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
    var {ChatUserDetails}=useSelector(state=>state.custom)
    const dispatch=useDispatch()
    useEffect(()=>{
        let icon = document.getElementById("headericon")
        // console.log(icon)
        // icon.addEventListener("click",()=>{
        //     console.log("helloworld")
        // })
    },[])
    
    // console.log(display,"----------------------------------")
    // console.log(display)

    const time = new Date(Date.now()).getFullYear()
    // console.log(year,"fdafdsafdsafds ")
    // console.log(time)
    // console.log(nowdate.) 
    function deletethisPost(){
        return <div whileTap={{scale:0.8}} onClick={()=>{heloDelete(Post,media)} } className={HeaderPost.CrudPost}>
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

        // console.log(Sess.fname+" "+Sess.lname,"**************************************")
        // console.log(user._id,"hari bol")
        const friends = await axios.get("http://localhost:5000/User/friendsUpdate/"+user._id)
        console.log(friends.data.mes,"-------------------------")
        // console.log(friends.data)
        setchangeIcon(changeIcon?false:true)
        console.log(Sess._id)
        console.log(user,"this is user id !!!!!!",user)
        if(friends.data.mes){
            console.log("hello world");
            socket.emit("addFriends",{check:user});
        }
    }

    function Chatting(){
        // console.log("chatting ....",user)
        dispatch({
            type:"userChatboxDetailsupdate",
            payload:user
        })
    }

    // console.log(Sess._id,"\n",user._id)
    // Sess._id
    return <div className={HeaderPost.Header}>
        <DisplayPicture pic={display.displayPicture&&display.displayPicture}/>
        <div >
            <motion.h4 className={HeaderPost.Name}
                whileTap={{scale:0.8}}
            >
                {name}
            </motion.h4> 
        </div>
        <div className={HeaderPost.iconcontainer}>
            {Sess._id===user._id?deletethisPost():
                    <motion.div style={{display:"inline-block"}}
                        whileTap={{scale:0.8}}
                    >
                        <FontAwesomeIcon icon={faFacebookMessenger}
                            className={HeaderPost.headericon}
                            id="headericon"
                            onClick={ () => Chatting()}
                        />
                    </motion.div>
                                            
        
                    // <i class="fa-brands fa-facebook-messenger"></i>

                
                
            }
            {Sess._id===user._id?deletethisPost():
            <motion.div style={{display:"inline-block"}}
                whileTap={{scale:0.8}}
            >
            <FontAwesomeIcon icon={changeIcon?faUserPlus:faCircleCheck}
            onClick={()=>{AddFriendClicked()}}
            className={HeaderPost.headericon}
            />    
            </motion.div>
            }
        </div>
             
        
        
    </div>
}

export default PostHeader;
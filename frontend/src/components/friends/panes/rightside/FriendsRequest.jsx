import React from "react";
import axios from "axios"
import FriendsRequestCSS from "./FriendsRequest.module.css"
import { useEffect } from "react";
import { useState } from "react";


function Friendrequest(props){
    const [friendsArr,setfriendsArr]=useState([])
    useEffect(()=>{
        
    const RequestCheck = async ()=>{
        try {
            const FreindsRequest =await axios.get("http://localhost:5000/User/FriendsRequestPage")
            console.log(FreindsRequest.data,"fdsafdsafdsafdsafdsafdsafd")
            if(FreindsRequest.data){
                console.log(FreindsRequest.data)
                setfriendsArr(FreindsRequest.data)
            }

        } catch (error) {
            console.log(error)
        }
    }
    RequestCheck()
    },[])
    const imging = async ()=>{

    }
    // const RecievedfriendsRQ = await axios.get()
    return <div className={FriendsRequestCSS.OuterMostFriendRuquestContainer}>
        <div className={FriendsRequestCSS.Mapcontainer}>
            {
                friendsArr.map((item)=>{
                    console.log(item)
                    return <div key={item.friendsUniqueId._id} className={FriendsRequestCSS.innercontainer}>
                        <div className={FriendsRequestCSS.nameandDP}>
                            <div className={FriendsRequestCSS.image} onClick={imging}>
                                <img className={FriendsRequestCSS.photo} src={item.friendsUniqueId.displayPicture} alt="" />
                            </div>
                            <p>{item.friendsUniqueId.fname+" "+item.friendsUniqueId.lname } </p>
                        </div>
                        <div>fdfd</div>
                        <div>4564</div>
                    </div>
                })
            }
        </div>
    </div>
}
export default Friendrequest;
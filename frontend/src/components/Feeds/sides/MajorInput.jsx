import React, { useState } from "react";
import majorinputCSS from "./majorInput.module.css"
import { toast} from "react-toastify"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useDispatch} from "react-redux"
import {
    faXmark,
    faUserTag,
    faLocationPin
} from "@fortawesome/free-solid-svg-icons"
import {
    faImage,
    faSmile,
} from "@fortawesome/free-regular-svg-icons"
import { useSelector } from "react-redux"
import DisplayPicture from "./DisplayPicture";
import {Link} from "react-router-dom"
import Axios from "axios";



toast.configure()
function MajorInput(props){
    const dispatch =useDispatch()
    const [uploadPicture,setuploadPicture]=useState()
    const [previewImage,setpreviewImage]=useState();
    const {Sess}= useSelector(state=>state.custom)
    const [caption,setcaption]=useState()
    const [previewdisplay,setpreviewdisplay]=useState(false);
    const [imagetag,setimagetag]=useState(true)
    function captionsetting(e){
        setcaption(e.target.value)
    }
    function FilesInput(file){
        setuploadPicture(file)
        setpreviewdisplay(true)
        setimagetag(true)
        let src = URL.createObjectURL(file[0])
        setpreviewImage(src)
    }
    function cancellingImage(){
        setpreviewdisplay(false)
        setimagetag(false)
    }
    
   let PostBtn = async ()=>{

        setTimeout( ()=> {
            dispatch({
                type:"InputBox",
                payload:false
            })            
        }, 1000);

        const data = new FormData()
        data.append("file",uploadPicture[0])
        data.append("upload_preset","lbsiqzlz")
        await Axios.post("https://api.cloudinary.com/v1_1/dyjngm7az/image/upload",data,{withCredentials:false})
        .then(async (result)=>{
                console.log(result.data)
                console.log("hello from respi")
                await Axios.post("http://localhost:5000/post/CreatePost",{
                caption:caption,
                URL:result.data.secure_url,
                userId:Sess._id,
                Name:Sess.fname+" "+Sess.lname,
                mediaId:result.data.public_id
            },{withCredentials:true})
            .then((result)=>{
                console.log(result.data)
                toast.success("successfully posted !! ")
            })
            .catch((err)=>{
                console.log(err)
            })    
        })
        .catch((err)=>{
            console.log(err)
        })
        
        }
        function closemajor(){
            dispatch({
                type:"InputBox",
                payload:false
            })            
        }
    return  <div className={majorinputCSS.MajorOut}>
            <div className={majorinputCSS.Createpost}>
            <div className={majorinputCSS.headerCreatePost}>
            <div className={majorinputCSS.text}><h2 className={majorinputCSS.h2}>Create Post</h2></div>
            <div className={majorinputCSS.close} onClick={closemajor}><FontAwesomeIcon className={majorinputCSS.closeMark} icon={faXmark}/></div>
            </div>
            <hr />   
            
            <div className={majorinputCSS.outerDiv}>
                <DisplayPicture/>
                <h4 className={majorinputCSS.header5}>{Sess.fname+" "+Sess.lname}</h4>
                <div className={majorinputCSS.textareaDIV}>
                    
                    <textarea autoFocus onChange={(e)=>{captionsetting(e)}} className={majorinputCSS.mainInputBox} placeholder={"what's in your mind,"+" "+Sess.fname+"?"}/>
                    <div className={majorinputCSS.previewImageContainer} style={previewdisplay?null:{display:"none"}}>
                    <div className={majorinputCSS.cancelimage} onClick={cancellingImage}>
                        <FontAwesomeIcon icon={faXmark} className={majorinputCSS.CloseIcon}/>
                    </div> 
                        <img src={previewImage} alt="" style={imagetag?null:{display:"none"}} className={majorinputCSS.preview}/>
                    </div>
                    
                </div>
                <div className={majorinputCSS.DetailsTab}>
                    <div ><p>Add to your post </p></div>
                    <div className={majorinputCSS.AddPostOptions}>
                        
                        <label htmlFor="files"> <div className={majorinputCSS.CreatepostIconContainer}> <FontAwesomeIcon icon={faImage}  color="#41B35D" className={majorinputCSS.CreatePostIcons}/> </div></label>
                        <div className={majorinputCSS.CreatepostIconContainer}><FontAwesomeIcon icon={faUserTag}  color="#1771E6" className={majorinputCSS.CreatePostIcons}/></div>
                        <div className={majorinputCSS.CreatepostIconContainer}><FontAwesomeIcon icon={faSmile}  color="yellow" className={majorinputCSS.CreatePostIcons}/></div>
                        <div className={majorinputCSS.CreatepostIconContainer}><FontAwesomeIcon icon={faLocationPin}  color="#E94F3A" className={majorinputCSS.CreatePostIcons}/></div>
                    </div>
                </div>
                <input type="file" id="files" onChange={(e)=>{FilesInput(e.target.files)}} style={{display:"none"}}/>
                <button onClick={PostBtn} className={majorinputCSS.PostBtn}>Post</button>
            </div>
                
        </div>
        
    </div>
}

export default MajorInput;
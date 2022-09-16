import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faVideo,faPhotoFilm,faFaceSmile} from "@fortawesome/free-solid-svg-icons"
import leftsideCSS from "./Leftside.module.css"
import MajorInput from "./MajorInput";
import DisplayPicture from "./DisplayPicture";
import Axios from "axios";
import Post from "./Post";
import { useDispatch, useSelector} from "react-redux"


function Leftside(){
    const {Sess}= useSelector(state=>state.custom)
    const dispatch = useDispatch()
    const {InputDialougeBox}=useSelector(state=>state.custom)
    // const [checkMajor,setcheckMajor]=useState(InputDialougeBox);
    function thisisbtn(e){
        e.preventDefault();
        console.log("window 10 !!")
    }

    function openmaininput(){
        dispatch({
            type:"InputBox",
            payload:true
        })
        // setcheckMajor(true)

    }
    return <div className={leftsideCSS.left}>
        {InputDialougeBox?<MajorInput/>:null}
        
        <div className={leftsideCSS.DP}></div>
        <div className={leftsideCSS.inputContainer} >
            <div className={leftsideCSS.status}>
            <div className={leftsideCSS.DPcontainer}>
                <DisplayPicture/>
            </div> 
                <div className={leftsideCSS.statusInput}>
                    <form action="">
                        <input className={leftsideCSS.mainInput} onClick={openmaininput} type="text" placeholder={"whats in your mind,"+" "+Sess.fname+"?"}/>
                        <button hidden onClick={e=>thisisbtn(e)}>fdsa</button>
                    </form>
                </div>
            </div>
            
            <hr  className={leftsideCSS.HR}/>
            <div className={leftsideCSS.MediaFeelingsContainer}>
                <div className={leftsideCSS.MediaAndFeelings} onClick={openmaininput}> <FontAwesomeIcon icon={faVideo} color="red" className={leftsideCSS.MediaIcon}/><span className={leftsideCSS.spantage}> live video</span> </div>
                <div className={leftsideCSS.MediaAndFeelings} onClick={openmaininput}><FontAwesomeIcon icon={faPhotoFilm} color="green" className={leftsideCSS.MediaIcon}/><span className={leftsideCSS.spantage}> Photos</span> </div>
                <div className={leftsideCSS.MediaAndFeelings} onClick={openmaininput}><FontAwesomeIcon icon={faFaceSmile} color="yellow"  className={leftsideCSS.MediaIcon}/> <span className={leftsideCSS.spantage}>feelings</span></div>
            </div>
        </div>
        <Post/>
    </div>
}

export default Leftside;
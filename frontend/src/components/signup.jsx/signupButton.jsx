import React from "react";
import signupButtunCSS from "./signupButton.module.css";
import {useSelector} from "react-redux";
import {
    useNavigate
} from "react-router-dom"
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";

toast.configure()
function SignupButton(props){
    const navigate=useNavigate()
    // console.log(props.lname,"fdsafdsafd")
    const notify = ()=>{
        toast.error("password didnt match !!",{
            position:toast.POSITION.TOP_LEFT,
            autoClose:3000
        })
    }
    const {gender,date,year,Months} = useSelector(state=>state.custom) 
    function signup(eve){
        
        if(props.confirmpassword!==props.password){
            notify()
            return
        }
        else{
            let fname=String(props.fname);
            fname=fname.replace(/\s/g,"")
            fname=fname.charAt(0).toUpperCase()+fname.slice(1);
            let lname=String(props.fname);
            lname=lname.replace(/\s/g,"")
            lname=lname.charAt(0).toUpperCase()+lname.slice(1);
            Axios.post("http://localhost:5000/User/CreateUser",{
                fname:fname,
                lname:lname,
                username:props.username,
                password:props.password,
                confirmpassword:props.confirmpassword,
                gender:gender,
                date:date,
                month:Months,
                year:year
            }).then((result)=>{
                console.log("heloowo")
                console.log(result.data)
                if(result.data.message==0){
                    toast.info("user already exist !",
                    {
                        position:toast.POSITION.BOTTOM_LEFT,
                        autoClose:  1000
                }
                    )
                }
                else{
                    toast.success("user created ! 🙂🙂",{
                        position:toast.POSITION.TOP_RIGHT,
                        autoClose:2000
                    })
                navigate("/")
                }
            })
            .catch((error)=>{
                console.log("err")
                console.log(error)
            })
        }
    }
    return <div className={signupButtunCSS.signupButton}>
        <button type="button" onClick={(eve)=>{signup(eve)}} className={signupButtunCSS.btn} >Sign Up</button>
        </div> 
}

export default SignupButton;
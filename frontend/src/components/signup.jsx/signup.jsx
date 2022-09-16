import React,{useState} from "react";
import DateOfBirth from "./Dateofbirth";
import { Link } from "react-router-dom";
import signupCSS from "./signup.module.css"
import Gender from "./gender";
import SignupButton from "./signupButton";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


toast.configure()
function Signup(){
    const [fname,setfname]=useState();
    const [lname,setlname]=useState();
    const [usename,setusername]=useState();
    const [password,setPassword]=useState();
    const [confirmPassword,setconfirpassword]=useState();
    const [passwordtoast,setpasswordtoast] = useState(true);



    function passwordalert(){
        if(passwordtoast){
            toast.info("set a strong Password !")
            setpasswordtoast(false)
        }
    }
    function buttonsetfname(e){
        setfname(e.target.value)
    }
    
    function buttonsetlname(e){
        setlname(e.target.value)
    }

    function buttonsetusername(e){
        setusername(e.target.value)
        
    }

    function buttonsetPassword(e){
        setPassword(e.target.value)
    }
    function buttonsetConfirmPassword(e){
        setconfirpassword(e.target.value)
    }
    return <div className="signupdiv"> 
        <form action="" className="CreateUserForm">
        <h1>Sign Up</h1>
        <h5>It's quick and easy.</h5>
        <hr></hr>
        <div className="name">
        <input onChange={(e)=>(buttonsetfname(e))} type="text" name="Firstname" placeholder="First name" className="Namediv" />
        <input onChange={(e)=>(buttonsetlname(e))} type="text" name="lastname" placeholder="last name"  className="Namediv"/>
        </div>
        <div className={signupCSS.here}>
            <input onChange={(e)=>(buttonsetusername(e))} type="text" placeholder="Mobile number or email address" className={signupCSS.emailPassword}/>
            <input onChange={(e)=>(buttonsetPassword(e))} onClick={passwordalert} type="password" placeholder="Password" className={signupCSS.emailPassword} />
            <input onChange={(e)=>(buttonsetConfirmPassword(e))} type="password" placeholder="Confirm Password" className={signupCSS.emailPassword}/>
        </div>

        <DateOfBirth/>
        <Gender/>
        <SignupButton fname={fname} lname={lname} username={usename} password={password} confirmpassword={confirmPassword}/>
        <Link to="/"><button type="button">this is it !!</button></Link> 
        </form>
    </div>
}


export default Signup;

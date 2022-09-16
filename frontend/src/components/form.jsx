import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import platform from "platform"

toast.configure();
function Form() {
  const [ses, setsess] = useState();
  function errorfunction() {
    toast.info("Invalid username or password !! ",{position:toast.POSITION.BOTTOM_CENTER,theme:"dark"});
  }
  const dispatch = useDispatch();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const Navigate = useNavigate();
  function onChangeinput() {
    Navigate("/signup");
  }
  function LoginButton(e) {
    
    e.preventDefault();
    axios
      .post("http://localhost:5000/User/login", {
        username: email,
        password: password,
      })
      .then((result) => {
        console.log("helo worodajbkaf a")
        if (result.data.message) {
          console.log(result.data.message, "messa");
            const SesResponse = axios.get("http://localhost:5000/User/loginSesion",{Credential:true});
            SesResponse.then((respose) => {
              let device= axios.post("http://localhost:5000/User/DeviceNamestorage",{
                DeviceDetail:platform
              })
              device.then((device)=>{
                console.log("device data stored succesfully")

              })
              device.catch((err)=>{
                console.log("error in device data storage");
                console.log(err)
              })
			      document.location.reload()
            });

          Navigate("/panes");
        } else {
          errorfunction();
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("this is from Form.jsx");
      });
  }
  function emailaddresslogin(e) {
    setemail(e.target.value);
  }
  function passwordlogin(e) {
    setpassword(e.target.value);
  }

  return (
    <form className="Homesignup" action="" method="post">
      <input
        placeholder="Email address"
        onChange={(e) => {
          emailaddresslogin(e);
        }}
        className="thisinput"
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          passwordlogin(e);
        }}
      />
      <button
        className="Login"
        onClick={(e) => {
          LoginButton(e);
        }}
      >
        Log in
      </button>
      <Link className="windows10" to="/signup">
        Forgotten Passoword ?
      </Link>
      <hr />
      <button type="button" onClick={onChangeinput} className="createAccont">
        Create New Account
      </button>
    </form>
  );
}

export default Form;

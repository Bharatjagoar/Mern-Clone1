import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes ,useNavigate} from "react-router-dom";
import App from "./app";
import Panes from "./components/Feeds/sides/panes";
import Frineds from "./components/friends/FriendsPage";
import Settings from "./components/settings/Settings";
import Signup from "./components/signup.jsx/signup";
import Error from "./error";
import GeneralSetting from "./components/settings/settingspane/rightsidepane/generalSetting";
import SecurityAndLogin from "./components/settings/settingspane/rightsidepane/securityAndLogin";
import LoginInfo from "./components/settings/settingspane/rightsidepane/loginInfo";
import Privacy from "./components/settings/settingspane/rightsidepane/privacy";
import ProfileAndTagging from "./components/settings/settingspane/rightsidepane/profileandtagging";
import Publicpost from "./components/settings/settingspane/rightsidepane/publicpost";
import Blocking from "./components/settings/settingspane/rightsidepane/blocking";



function Routing() {
  // const navr = useNavigate()
  const [ses, setses] = useState();
  const dispatch = useDispatch();
  useEffect(() =>{
      const SesResponse =  axios.get("http://localhost:5000/User/loginSesion", {
        withCredentials: true,
      });
      SesResponse.then((Response) => {
        setses(Response.data.message);
        dispatch({
          type:"Session",
          payload:Response.data.user
        })
      });
      SesResponse.catch((err)=>{
        console.log(err);
      })
  });``
  return (
    <Router>
      <Routes>
        <Route path="/" element={ses ? <Panes /> : <App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
        <Route path="/panes" element={ses ? <Panes /> : <App />} />
        <Route path="/friends" element={ses?<Frineds />:<App/>} />
        <Route path="/settings" element={ses?<Settings/>:<App/>}>
            <Route path="" element={ses?<GeneralSetting/>:<App/>}/> 
            <Route path="securityLogin" element={ses?<SecurityAndLogin/>:<App/>}/>
            <Route path="LoginInfo" element={<LoginInfo/>}/>
            <Route path="Privacy" element={<Privacy/>}/>
            <Route path="ProfileAndTagging" element={<ProfileAndTagging/>} />
            <Route path="publicpost" element={<Publicpost/>}/>
            <Route path="blocking" element={<Blocking/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;

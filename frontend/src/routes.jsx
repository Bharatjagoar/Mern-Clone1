import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client"
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import Modal from "react-modal"
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
const socket=io.connect("http://localhost:5000")




Modal.setAppElement('#root')
function Routing() {
  const [ses, setses] = useState();
  const dispatch = useDispatch();
  useEffect( () =>{
       
      
      const sessionLoad = async ()=> {
        try {

            const SesResponse = await axios.get("http://localhost:5000/User/loginSesion", {
            withCredentials: true,
            });
            setses(SesResponse.data.user);
            // console.log(SesResponse.data.user)
            
            dispatch({
                type:"Session",
                payload:SesResponse.data.user
              })  
            console.log("this is the session ::",SesResponse.data.user._id)
            // const CheckingApi = axios.get("http://localhost:5000/User/CheckingApi")
            
            const FrRooms = await axios.get("http://localhost:5000/User/FriendsRequestCheck")
              console.log(FrRooms.data)
              socket.emit("jointheseRevievedFriendsRQ",{array:FrRooms.data.RevievedFriendsRQ,
                  sessionid:SesResponse.data.user._id}
              )
              socket.emit("jointheseSentFriendsRQ",{
                array:FrRooms.data.SentFriendsRQ,
                sessionid:SesResponse.data.user._id
              })
              
            socket.on("joinedforrecieved",data=>{
              console.log(data,"from Recieved FR rooms")
            })
            socket.on("joinedforsent",data=>{
              console.log(data,"from sent FR rooms")
            })
              // console.log(SesResponse.data.user._id)

            
        } catch (error) {
          console.log(error,"fdsafdsa")
        }
        console.log("after1 try")
      }
      sessionLoad();
},[])
      
  // });

  socket.on("hell",(socket)=>{
    console.log(socket,"this is the socket")
  })
  socket.on("friendrequest",data=>{
    console.log("data freind request data :: ",data)
  })
  return (
    <Router>
      <Routes>
        <Route path="/" element={ses ? <Navigate to={'/panes'} replace/> : <App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
        <Route path="/panes" element={ses ? <Panes obj={socket} /> : <Navigate to={'/'} replace/> } />
        <Route path="/friends" element={ses?<Frineds />:<App/>} />
        <Route path="/settings" element={ses?<Settings/>:<App/>}>
            <Route path="" element={ses?<GeneralSetting/>:<App/>}/> 
            <Route path="securityLogin" element={ses?<SecurityAndLogin/>:<App/>}/>
            <Route path="LoginInfo" element={<LoginInfo/>}/>
            <Route path="Privacy" element={<Privacy/>}/>
            <Route path="ProfileAndTagging" element={<ProfileAndTagging/>} />
            <Route path="publicpost" element={<Publicpost/>}/>
            <Route path="blocking" element={<Blocking obj={socket}/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;

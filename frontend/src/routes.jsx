import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import socket from "./socket";
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import Modal from "react-modal"
import Routerextension from "./routesExtension"


Modal.setAppElement('#root')
function Routing() {
const {friendRequest} = useSelector(state=>state.custom)
  const [ses, setses] = useState();
  const [RecievedFriendsRQ,setRecievedFriendsRQ]=useState(null)
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
              if(SesResponse.data.user){
                  console.log("this is the session ::",SesResponse.data.user._id)
                  
                  let socketUserId=SesResponse.data.user._id
                  socket.auth = { socketUserId }
                  socket.connect()
                  
                  socket.emit("joinSelf",{id:SesResponse.data.user._id})
              }
              
            // const CheckingApi = axios.get("http://localhost:5000/User/CheckingApi")

            const FrRooms = await axios.get("http://localhost:5000/User/FriendsRequestCheck")
            console.log(FrRooms.data.RevievedFriendsRQ.length,"/*/*/*/*/*/*/*/*/*/*/*/")
            dispatch({
              type:"numberofreq",
              payload:FrRooms.data.RevievedFriendsRQ.length
            })
              if(FrRooms.data.RevievedFriendsRQ){
                socket.emit("jointheseRevievedFriendsRQ",{array:FrRooms.data.RevievedFriendsRQ,
                  sessionid:SesResponse.data.user._id})
              }
              if(FrRooms.data.SentFriendsRQ){
                socket.emit("jointheseSentFriendsRQ",{
                  array:FrRooms.data.SentFriendsRQ,
                  sessionid:SesResponse.data.user._id
                })
              }
            socket.on("connect_error",(err)=>{
              if(err.message){
                console.log(err.message)
              }
            })
            socket.on("joinedforrecieved",data=>{
            //   console.log(data,"from Recieved FR rooms")
            })
            socket.on("joinedforsent",data=>{
            //   console.log(data,"from sent FR rooms")
            })
            // socket.on("online",()=>{
            //     setRecievedFriendsRQ(true)
            //     dispatch({
            //         type:"friendRequest",
            //         payload:friendRequest?false:true
            //     })
            //     console.log(friendRequest)
            //     //   alert("hello wrld")
            // })
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
        <Route path="/" element={ses ? <Navigate to={'/panes'} replace/> : <Routerextension.App />} />
        <Route path="/signup" element={<Routerextension.Signup />} />
        <Route path="*" element={< Routerextension.Error />} />
        <Route path="/panes" element={ses ? <Routerextension.Panes obj={socket} /> : <Navigate to={'/'} replace/> } />
        <Route path="/friends" element={ses?<Routerextension.Frineds />:<Routerextension.App/>} >

            <Route path="Friendsrequests" element={ <Routerextension.Friendrequest /> }/>
        </Route>
        <Route path="/settings" element={ses?< Routerextension.Settings/>:<Routerextension.App/>}>
            <Route path="" element={ses?< Routerextension.GeneralSetting/>:<Routerextension.App/>}/> 
            <Route path="securityLogin" element={ses?<Routerextension.SecurityAndLogin/>:<Routerextension.App/>}/>
            <Route path="LoginInfo" element={<Routerextension.LoginInfo LoginInfo/>}/>
            <Route path="Privacy" element={<Routerextension.Privacy />}/>
            <Route path="ProfileAndTagging" element={<Routerextension.ProfileAndTagging/>} />
            <Route path="publicpost" element={<Routerextension.Publicpost />}/>
            <Route path="blocking" element={<Routerextension.Blocking obj={socket}/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;

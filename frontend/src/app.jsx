import React, { useState ,useEffect} from "react";
import Home from "./components/Home";
import axios from "axios";



function App(){
    axios.defaults.withCredentials=true
    return  <Home/>
}
export default App;
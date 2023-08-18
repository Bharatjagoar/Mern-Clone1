import React, { useEffect, useState } from "react";
import Axios from "axios"; 
import PostCSS from "./post.module.css"
import PostHeader from "./Postheader/Header";
import PostBody from "./postbody/postBody";


function Posts({socket})  {
  const [arr, setarr] = useState([]);

  useEffect(() => {

    const getThePost = async ()=>{
      try {
        const response =await Axios.get("http://localhost:5000/Post/GetPost", {
          withCredentials: true,
        });    
        console.log(response.data)
        if(response.data){
          setarr(response.data)
        }
      } catch (error) {
        console.log(error)      
      }

    }
    getThePost()
  },[]);

  function deleteThis(id){
    console.log("lde")
    const newList = arr.filter((item)=>{
      return item._id!=id&&item
    })
    // console.log(newList,"///*/*/*/*/*/*/*")
    setarr(newList)
  }
  

  return (
    <div className={PostCSS.outerMostDiv}>
      {

          arr.map(post=>{
              // console.log(post.userId)
              return <div key={post._id} className={PostCSS.container}>
                {/* {console.log(post.userId)} */}
					<PostHeader name={post.userName} created={post.createdAt} Post={post._id} media={post.mediaId} user={post.userId} socketObject={socket} deleted={deleteThis} display={post.userId}/>
					<PostBody src={post.mediaUrl} caption={post.caption}/>
              </div>
          })
      }
    </div>
  );
};

export default Posts;

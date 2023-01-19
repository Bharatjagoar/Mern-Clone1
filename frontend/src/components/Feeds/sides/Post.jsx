import React, { useEffect, useState } from "react";
import Axios from "axios"; 
import PostCSS from "./post.module.css"
import PostHeader from "./Postheader/Header";
import PostBody from "./postbody/postBody";


function Posts({socket})  {
  const [arr, setarr] = useState([]);

  useEffect(() => {
    const response = Axios.get("http://localhost:5000/Post/GetPost", {
      withCredentials: true,
    });
    response.then((result) => {
      console.log(result.data)
      setarr(result.data);
    });
  }, []);
  return (
    <div className={PostCSS.outerMostDiv}>
      {

          arr.map(post=>{
              return <div key={post._id} className={PostCSS.container}>
                {/* {console.log(post.userId)} */}
					<PostHeader name={post.userName} created={post.createdAt} Post={post._id} media={post.mediaId} user={post.userId} socketObject={socket}/>
					<PostBody src={post.mediaUrl} caption={post.caption}/>
              </div>
          })
      }
    </div>
  );
};

export default Posts;

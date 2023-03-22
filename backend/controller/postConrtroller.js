const db = require("../schema/Postschema");
const Cloudinary= require("cloudinary").v2;
module.exports.createPost = async (req, res) => {
  console.log(req.body.mediaId,"this is id part");
  try {
    const post = await db.create({
      caption: req.body.caption,
      mediaUrl: req.body.URL,
      userName:req.body.Name,
      userId:req.body.userId,
      mediaId:req.body.mediaId
    });
    console.log(post)
    return res.send(post);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
module.exports.GetPost= async(req,res)=>{

    try {
      const ress = await db.find({}).populate("userId","fname lname displayPicture")
      res.send(ress)    
    } catch (error) {
        console.log(error,"fdsfdafdafdafdf")
    }

  
}

module.exports.Delete = async (req,res)=>{
  console.log("delete")
  db.deleteMany({},(err)=>{
    if(err){
      console.log(err)
      return res.send()
    }
    console.log("deleted the data")
    return res.send()
  })
}
module.exports.deleteThisCloudinary = async (req,res)=>{
    console.log(req.query.post)
    Cloudinary.config({ 
        cloud_name: 'dyjngm7az', 
        api_key: '173268382419118', 
        api_secret: 'AyTuhGHvBgs8xUmBmGGLHYe9cOs' 
      });
      
      Cloudinary.uploader.destroy(req.query.media,(result)=>{ console.log(result); console.log("delete"+req.query.media);});
      db.findByIdAndDelete({_id:req.query.post},(err)=>{
		if(err){
			console.log(err)
			console.log("ERROR from findByIdAndDelete Post")
			return 
		}
		console.log("delete from findByIdAndDelete Post !! ")
	  })
    res.send({
        message:"working fine !!"
    })
}

module.exports.funny=(req,res)=>{
  console.log("hello funny ")
  res.send()
}
const mongoose=require("mongoose")
const UserDB = require("../schema/UserSchema")
const devicedb=require("../schema/deivce")
module.exports.createuser=async (req,res)=>{
    try{
        const Userfound=await UserDB.findOne({UserName:req.body.username})
        console.log(Userfound,"found")
        if(!Userfound){
            console.log("fsafdsafdsa    hari bol ")
            const createduser= await UserDB.create({
                fname:req.body.fname,
                lname:req.body.lname,
                UserName:req.body.username,
                password:req.body.password,
                gender:req.body.gender,
                date:req.body.date,
                month:req.body.month,
                year:req.body.year
            })
            console.log(createduser,"createed user")
            res.send(createduser)
        }
        else{
            res.send({message:0})
        }
    }
    catch(err){
        console.log(err)
        console.log(" error on finding ! ")
    }
}
module.exports.LoginUser=async (req,res)=>{
    let FoundLoginuser = await UserDB.findOne({UserName:req.body.username,password:req.body.password})
    .select(["-createdAt","-updatedAt","-year","-month","-date","-password","-__v"])

    if(FoundLoginuser){  
        console.log(FoundLoginuser)
        // delete FoundLoginuser.password
        console.log(FoundLoginuser,"this is th user found")
        req.session.user = FoundLoginuser
        return res.send({message:true})
    }else{
        return res.send({
            message:false
        })
    }
}

module.exports.SessionCheck = (req,res)=>{
    if(req.session.user){
        res.send({message:true,user:req.session.user})
    }else{
        res.send({message:false})
    }
}

module.exports.logOut = (req,res)=>{
    req.session.destroy((err)=>{
        if( err){
        console.log("err in deleting the session ")
        console.log(err)
        }

    })
    res.end()
}
module.exports.updateName= async (req,res)=>{
    console.log(req.params,"this is params ");
    console.log(req.body,"this is body !! ");
    try {
        let id=req.params.id;
        let update = req.body;
        console.log(id);
        const updatedDoc= await UserDB.findByIdAndUpdate(id,update,{new:true});
        console.log("this is data : \n\n\n"+updatedDoc);
        req.session.user=updatedDoc;
        res.send(updatedDoc);
    } catch (error) {
        console.log(error+"this is err ");
    }
}

module.exports.userDeviceDetail= async(req,res)=>{
    // console.log("Device details ! ");
    // console.log("this is name",req.body.DeviceDetail.name )
    // console.log("this is name",req.body.DeviceDetail.version )
    // console.log(req.session.user._id,"this the session ")

    try {
        const devices= await devicedb.findOne({User:req.session.user._id})
        // console.log(devices)
        if(devices){
            const foundbyid = await devicedb.findByIdAndUpdate({_id:devices._id},{
                $push:{
                    Device:{os:req.body.DeviceDetail.os.family,
                        description:req.body.DeviceDetail.description
                    }
                    // Device:req.body.DeviceDetail.description
                }},{new:true}
            )
        }
        else{
            const created= await devicedb.create({User:req.session.user._id})
            console.log(created,"this is new uesr created for edev")
        }
    } catch (error) {
        console.log(error)
    }
    

    

}


module.exports.GettheUserDevices= async (req,res)=>{
    
        try {
            const deivceslist=await devicedb.findOne({User:req.session.user})
            console.log(deivceslist);
            res.send(deivceslist.Device)
        } catch (error) {
            console.log(error)
        }
        // console.log(founddevice)
    
    
    console.log(req.params.id)
}

module.exports.UpdateProfilePicture= async(req,res)=>{
    console.log("update")
    console.log(req.session.user)
    console.log(req.body,"paratms")



    try {
        const updatedDoc= await UserDB.findByIdAndUpdate(req.session.user,
                {displayPicture:req.body.url},
                {new:true}
            )
            console.log(updatedDoc,"this is the update doc")
    } catch (error) {
        console.log(error)
        console.log("this is the error")
    }
    res.send()
}


module.exports.UpdatePassword=async (req,res)=>{
    console.log(req.session.user._id)
    console.log(req.body)
    try {
        const DocumentFound=await UserDB.findOne(
            {   _id:req.session.user._id,
                password:req.body.old
            })
            .select("_id")
        if(DocumentFound){
            try {
                const passwordupdatedDoc= await UserDB.findByIdAndUpdate(DocumentFound,{
                    password:req.body.new
                },{new:true})
                console.log(passwordupdatedDoc)
            } catch (error) {
                console.log(error,"thi is from findbyidandupdate")
                res.send()
            }
            
            return res.send({message:true})
        }
        else{
            return res.send({message:false})
        }
    } catch (error) {
        console.log(error,"this the password updation block !! ")
        return res.send({message:false})
    }
}



module.exports.addFriend= async (req,res)=>{
    console.log("req body",req.session.user._id)
    console.log("req params ",req.params)


    try {
        const userFound = await UserDB.findById(req.session.user._id)
    } catch (error) {
        
    }
    res.send()
}
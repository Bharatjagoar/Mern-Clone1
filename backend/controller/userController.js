const mongoose=require("mongoose")
const UserDB = require("../schema/UserSchema")
const devicedb=require("../schema/deivce")
const friendsdb = require("../schema/friendRequest")
const FriendRequestSentDb =require("../schema/FreindRequestSent")
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
    // console.log(req.session.user,"thios ")
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
    // console.log(req.body,"paratms")



    try {
        const updatedDoc= await UserDB.findByIdAndUpdate(req.session.user,
                {displayPicture:req.body.url},
                {new:true}
            ).select(["-createdAt","-updatedAt","-year","-month","-date","-password","-__v"])
            console.log(updatedDoc,"this is the update doc")
            res.send(updatedDoc)
    } catch (error) {
        console.log(error)
        console.log("this is the error")
    }
    
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

module.exports.CheckFriends= async (req,res)=>{
    console.log("request :: ",req.params)
    let sentFRS=[]
    try {
        const checkSentFRs =await FriendRequestSentDb.findOne({userId:req.params.sentId})
        
        if(!checkSentFRs){
            const newlyCreatedSENTfrs= await FriendRequestSentDb.create({userId:req.params.sentId,SentFR:req.params.RecievedId})
            console.log("newly created dbs :: ",newlyCreatedSENTfrs.SentFR);
            sentFRS=newlyCreatedSENTfrs.SentFR
            console.log(sentFRS,"************************ created")
        }
        else{
            const foundsentFrs = await FriendRequestSentDb.findOneAndUpdate({userId:req.params.sentId},{$push:{
                SentFR:req.params.RecievedId
            }},
        {new:true}
        )
            console.log("the found Sent request doc created ==",foundsentFrs.SentFR.SentFR)
            sentFRS=foundsentFrs.SentFR.SentFR
            console.log(sentFRS,"************************ updated")
        }
        console.log("list of frinds ::------>> ","\n",sentFRS)
        console.log(req.params.id,"this is params id")
        const checkFrineds = await friendsdb.findOne({userid:req.params.id})
        console.log(checkFrineds,"++++++++++++++++++++++++++++++++++++")
        if(!checkFrineds){
            return res.send({message:true,sentFrsTo:sentFRS})
        }
        else{
            return res.send({message:false,sentFrsTo:sentFRS})
        }
    } catch (error) {
        console.log("err in check friends ::",error)
        res.send()
    }
}

module.exports.addFriend= async (req,res)=>{
    console.log("req body",req.body)
    console.log("req params ",req.params.id)
    
    try {
        
        const addedFriend = await friendsdb.create({userid:req.params.id})
        // console.log("add frindefdsa",addedFriend)
        const addingNewFR = await friendsdb.findByIdAndUpdate(addedFriend._id,{
            $push:{
                Friend:{
                    friendsUniqueId:req.body.friendid
                }
            }
        },{new:true})
        console.log("adding",addingNewFR)
        console.log()
    } catch (error) {
        console.log("this is the error !! ",error)
    }

    res.send()
}
module.exports.AppendFriends = async (req,res)=>{
    console.log("params :: ",req.params.id)
    
    
    try {
        const updateListFR = await friendsdb.findOneAndUpdate({userid:req.params.id},{
            $push:{
                Friend:{
                    friendsUniqueId:req.body.friendid
                }
            }},{new:true})
        console.log(updateListFR)
    } catch (error) {
        console.log("error :"+error)
    }
    res.send()
}
//pull back is just for trying pulls ::: 
module.exports.Pullback = async (req,res)=>{
    console.log("pullback !! ")

    const freindsRes = await friendsdb.updateOne({userid:"63339646d87273cf0d149e35"},{
        $pull:{
            Friend:{
                friendsUniqueId:"639ed7929343257a005573d2"
            }
        }
    })
    console.log(freindsRes,"updated array result !! ")
    res.send()
}

module.exports.RoomCheck = async (req,res)=>{
    console.log("+++++++++++++++++++",req.query.myId)
    try {
        const isFriendRequestAvailable = await friendsdb.findOne({userid:req.query.myId}).populate(["userid","Friend.friendsUniqueId"])
        
        // let propsarr= ['updatedAt','createdAt',"year",'gender',"password","date",'month']
        // propsarr.forEach(element => {
        //     console.log(element)
        //     delete isFriendRequestAvailable.userid.element
        // });

        if(isFriendRequestAvailable){            
            // console.log(isFriendRequestAvailable.userid,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            // console.log(isFriendRequestAvailable.Friend,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(isFriendRequestAvailable.Friend,"this is fre")
            console.log(isFriendRequestAvailable,"this is frieds")
            
            res.send(isFriendRequestAvailable.Friend)
        }
        else{
            res.send()
        }
        
    } catch (error) {
        console.log("err roomcheck",error)   
        res.send()
    }
    
}

module.exports.populate = async (req,res)=>{
    console.log("populate")
    
    try {
        const FriendsPopulate = await friendsdb.findOne({userid:"63339646d87273cf0d149e35"}).populate( ["userid","Friend.friendsUniqueId"] )
        // const FindThisdb =friendsdb.findOne({userid:"63339646d87273cf0d149e35"}).populate([{path:"Friend",populate:{
        //     path:"friendsUniqueId"
        // }}])
        FriendsPopulate.then((respo)=>{
            console.log("this is respo ")
            console.log(respo)
        })
        console.log(FriendsPopulate)
        console.log("hello worlds")
        // console.log(FriendsPopulate,"this is dfa")
    } catch (error) {
        console.log(error)
    }
    res.send()
}
module.exports.testthis1= async(req,res)=>{
    console.log("this is TEST 1")
    res.redirect("/User/testthis2")
}
module.exports.testthis2= async(req,res)=>{
    console.log("this is test 2")
    res.send()
}
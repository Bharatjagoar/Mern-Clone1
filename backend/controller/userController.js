const mongoose=require("mongoose")
const UserDB = require("../schema/UserSchema")
const devicedb=require("../schema/deivce")
const friendsrequestdb = require("../schema/friendRequest")
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

module.exports.SessionCheck = async (req,res)=>{
    // console.log(req.session.user,"thios
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

//pull back is just for trying pulls ::: 
module.exports.Pullback = async (req,res)=>{
    console.log("pullback !! ")

    const freindsRes = await friendsrequestdb.updateOne({userid:"63339646d87273cf0d149e35"},{
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
        const isFriendRequestAvailable = await friendsrequestdb.findOne({userid:req.query.myId}).populate(["userid","Friend.friendsUniqueId"])
        
        // let propsarr= ['updatedAt','createdAt',"year",'gender',"password","date",'month']
        // propsarr.forEach(element => {
        //     console.log(element)
        //     delete isFriendRequestAvailable.userid.element
        // });

        if(isFriendRequestAvailable){            
            console.log(isFriendRequestAvailable.userid,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            // console.log(isFriendRequestAvailable.Friend,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(isFriendRequestAvailable.Friend,"this is fre")
            console.log(isFriendRequestAvailable,"this is frieds")
            
            res.send(isFriendRequestAvailable.Friend)
        }
        else{
            console.log("no room found !!")
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
        const FriendsPopulate = await friendsrequestdb.findOne({userid:"63339646d87273cf0d149e35"}).populate( ["userid","Friend.friendsUniqueId"] )
        // const FindThisdb =friendsrequestdb.findOne({userid:"63339646d87273cf0d149e35"}).populate([{path:"Friend",populate:{
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

module.exports.checktheApi = async (req,res)=>{

    console.log("hello world from checking appi")
    const checkthefreinds = await friendsrequestdb.find({userid:"63339646d87273cf0d149e35"},"Friend")
    let frindsarr=[]
    let num=0
    console.log("this is the best intitute !! ",checkthefreinds)
    checkthefreinds.forEach(Ele=>{
        // console.log(Ele.Friend[0].friendsUniqueId,"this is err ")
        frindsarr[num] = Ele.Friend
        num++
    })
    
    
    // console.log(frindsarr,"this is arr ")
    return res.send()
}

module.exports.FriendsaddOrUpdate =async (req,res)=>{
    let message={mes:false}
    console.log(req.session.user._id)
    console.log(req.params.sentto,"fdsafdsafdsafads")

    try {
        const friendsRequests = await friendsrequestdb.find({userid:req.params.sentto})
        // console.log("*****************","\n",friendsRequests)
        if(!friendsRequests[0]) {
            const createdDoc = await friendsrequestdb.create({userid:req.params.sentto})
            
            console.log(createdDoc,"this is created doc")
            const findingandupdating = await friendsrequestdb.findByIdAndUpdate(createdDoc._id,
                {$push:{
                    Friend:{friendsUniqueId:req.session.user}
                }},
                {new:true}
            )
            // console.log("this is the updated doc:: " , findingandupdating)

        } else {

            // console.log(friendsRequests[0],"this isfdsa")
            // const foundbyid = await friendsrequestdb.findByIdAndUpdate(friendsRequests[0].id,{$push:{
            //     Friend:{friendsUniqueId:req.session.user}
            // }},
            // {new:true})
            console.log()
            // console.log(foundbyid,"this is the foundby id ")
            const fing = await friendsrequestdb.findOne({userid:req.params.sentto})
            fing.Friend
            console.log(fing.Friend.length)
            let index, flag=0;
            for(index=0;index<fing.Friend.length;index++){
                console.log(index)
                // console.log(fing.Friend[index])
                console.log(fing.Friend[index].friendsUniqueId.toString(),"this is the ud ")
                console.log(req.session.user._id,"this is the sessionid")
                if(fing.Friend[index].friendsUniqueId.toString()==req.session.user._id){
                    console.log("breaking")
                    flag=1;
                    break;
                    }
                }
            if(flag==0){
                console.log("yse")
                const addAndupdate = await friendsrequestdb.findOneAndUpdate({userid: req.params.sentto},{$push:{
                    Friend:{friendsUniqueId:req.session.user}
                }})
                console.log(addAndupdate,"this is addandupadte")
                message.mes=true
            }else{
                console.log("no")
                const pullingfrineds = await friendsrequestdb.updateOne({userid:req.params.sentto},
                    {$pull:{
                        Friend:{friendsUniqueId:req.session.user}
                    }},
                    {new:true}
                )
                console.log("friend found !! ")
            }
            // console.log("this is else block ",fing.Friend)
        }   

        const sent = await FriendRequestSentDb.find({userId:req.session.user._id})
        console.log(sent,"this is the sent")
        if(!sent[0]){
            const SentFR = await FriendRequestSentDb.create({userId:req.session.user._id})
            console.log(SentFR,"this is the sentDRF")
            console.log(SentFR.id)
            // const updatingone = await 
            const updating = await FriendRequestSentDb.findOneAndUpdate({userId:req.session.user._id},
            {$push:{
                SentFR:req.params.sentto
            }})
            console.log(updating,"this is the update ")
        }
        else{
            let flag=0;
            console.log(sent[0].SentFR.length,"********************")
            sent[0].SentFR
            for (let index = 0; index < sent[0].SentFR.length; index++) {
                // console.log(sent[0].SentFR[index].toString())
                console.log(req.session.user._id)
                if(sent[0].SentFR[index]==req.params.sentto){
                    console.log()
                    flag=1
                    break
                }
            }
            // console.log(flag,"/////////////////////////////////")
            if(flag==0){
                console.log("not found sent fr id iis :: ",req.session.user._id)
                const updatearray = await FriendRequestSentDb.findOneAndUpdate({userId:req.session.user._id},{$push:{
                    SentFR:req.params.sentto
                }},{newI:true})
                // console.log(updatearray,"this the update arry !E#! ")
            }else{
                const foundanddelete = await FriendRequestSentDb.updateOne({userId:req.session.user._id},{$pull:{
                    SentFR:req.params.sentto
                }},{new:true})
                
                console.log(foundanddelete,"found sent fr !!")
            }

        }



    } catch (error) {
        console.log("this is the error from frineds",error)
        return res.send()
    }

    res.send(message)
    
}

module.exports.FriendRequestEnquery = async(req,res)=>{
    // const date = new Date()
    // date.getDate()
    // console.log(date.getDay())
    let recievedFRs,sentF
    try {
        if(req.session.user){

            // console.log(req.session.user._id,"this it")
            const FrSchcemas = await friendsrequestdb.findOne({userid:req.session.user._id})
            .populate("Friend.friendsUniqueId","fname lname displayPicture")
            
            // console.log(FrSchcemas,"////")
            if(FrSchcemas){
                console.log("this is the result :: ", FrSchcemas.Friend)
                recievedFRs = FrSchcemas.Friend
            }

            const SentfriendsRequest = await FriendRequestSentDb.findOne({userId:req.session.user._id})
            .populate("SentFR","fname lname displayPicture")
            // console.log(SentfriendsRequest,"fdgfsd5g15fds1g5dfs ")
            if(SentfriendsRequest){
                sentF=SentfriendsRequest.SentFR
            }
            
        
        }
        // console.log(SentfriendsRequest,"this is the sent FR9")
        return res.send({
            RevievedFriendsRQ:recievedFRs?recievedFRs:null,
            SentFriendsRQ:sentF?sentF:null
        }) 
    } catch (error) {
        console.log(error,"from FrSchcemas")
        res.send()
    }
    
    // console.log("recieved :--------------------------------",recievedFRs)
    // console.log("sent :: ",sentF)
    

    console.log("ok leggo ")
    
}
module.exports.FriendsRequestPage = async (req,res)=>{
    console.log("page",req.session.user._id)
    try {
        const requestsRecieved = await friendsrequestdb.findOne({userid:req.session.user._id})
        .populate("Friend.friendsUniqueId","fname lname displayPicture gender")
        console.log(requestsRecieved.Friend)
        console.log()
        res.send(requestsRecieved.Friend)
    } catch (error) {
        console.log(error)
        res.send()
    }

    // return res.send()
}
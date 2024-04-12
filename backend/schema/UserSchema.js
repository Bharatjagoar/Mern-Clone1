const Mongoose=require("mongoose")


const userschema=Mongoose.Schema({
    fname:{
        type:"String",
        required:true
    },
    lname:{
        type:"String",
    },
    UserName:{
        type:"String"
    },
    password:{
        type:"String"
    },
    gender:{
        type:"String"
    },
    date:{
        type:"String"
    },
    month:{
        type:"String"
    },
    year:{
        type:"String"
    },
    displayPicture:{
        type:"String",
    }
},
    {timestamps:true}
)

const User= Mongoose.model("userSChema",userschema)
module.exports=User
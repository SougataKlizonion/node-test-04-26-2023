const mongoose =require("mongoose");

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        reuired:true,
        unique:true
    },
    phone:{
        type:Number,
        reuired:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    image:{
        type:String,
        required:true
        
    }
})
const User =mongoose.model("User",userSchema);
module.exports = User
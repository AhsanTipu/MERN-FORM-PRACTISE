require('dotenv').config()

const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const UserScheme=new mongoose.Schema({
    fullname:{
type:String,
required:true
    },
    Email:{
type:String,
required:true,
    },
    email:{
type:String,
required:false,
    },
    password:{
        type:String,
        required:true,
    },
    confrimpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

UserScheme.methods.generateAuthToken = async function (){
    try{
console.log(this._id)
const token=jwt.sign({_id:this._id}, process.env.SECRET_KEY)
this.token=this.tokens.concat({token:token})
await this.save()
return token;
    }
    catch (e){
console.log("Error part")
    }
}

UserScheme.pre("save", async function (next){
if(this.isModified("password")){

    console.log(`Current password is ${this.password}`);
this.password=await bcrypt.hash(this.password,10);
this.confrimpassword=await bcrypt.hash(this.password,10);

}
next()
})

const Registeruser=new mongoose.model("RegisterUser",UserScheme);

module.exports= Registeruser;
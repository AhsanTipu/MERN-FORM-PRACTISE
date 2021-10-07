require('dotenv').config;

const { hasSubscribers } = require('diagnostics_channel');
const express=require('express');
const app=express();
const path=require("path");
const port=process.env.PORT || 3000;
const hbs=require("hbs")
require('./db/conn')
const path_stat=path.join(__dirname,"/public")
const path_view=(path.join(__dirname,"/templates/views"))
const path_partials=(path.join(__dirname,"/templates/partials"))
const Alluser=require("./db/registeruser");
// const Registeruser = require('./db/registeruser');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
app.set("view engine","hbs");``
app.set("views",path_view)
hbs.registerPartials(path_partials)
console.log(process.env.SECRET_KEY)

app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register", (req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/register" , async(req,res)=>{
try{

const password=req.body.password;
const confrimpassword=req.body.confrimpassword;

if(password === confrimpassword){
    const registerUser=new Alluser({
        fullname:req.body.fullname,
        Email:req.body.Email,
        email:req.body.Email,
        password:password,
        confrimpassword:confrimpassword,
    })

const registertoken= await registerUser.generateAuthToken();
console.log(`new token is ${registertoken}`)
    const a=await registerUser.save();
    res.status(201).render("index")
}else{
    res.status(400).send("Password not matching")
}
}
catch(e){
res.status(400).send(e)
console.log(e)
}

})
app.post("/login",async(req,res)=>{
    try{

    const Email=req.body.Email;
const password=req.body.password;

const userEmail=await Alluser.findOne({Email})
const isBy=await bcrypt.compare(password,userEmail.password)
const registertoken= await userEmail.generateAuthToken();
console.log(`Token ${registertoken}`)
if(isBy){

    res.status(201).render("index")
}
else{
    res.send("Invalid Email or password")
}
}
catch(e){
    console.log(e)
}
})
app.listen(port,()=>{   
    console.log("Chalra h")
})
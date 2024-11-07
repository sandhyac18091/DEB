import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/author.js";
import mongoose from 'mongoose';

const userRoute = Router();

// const user=new Map();
// const Certificate=new Map();
const secretkey=process.env.SecretKey;

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        userName: { type: String, unique: true },
        password: String,
        userRole: String
    }
)

// Create Model
const User = mongoose.model('Userdetails', userSchema);
mongoose.connect('mongodb://localhost:27017/Certiapp')


userRoute.post('/signup', async (req, res) => {
    try {
        const { FirstName,
            LastName,
            UserName,
            Password,
            UserRole } = req.body;
        const newP = await bcrypt.hash(Password, 10);
        const existingUser = await User.findOne({ userName: UserName })

        if (existingUser) {
       
        
            console.log("User already registered!")
            res.status(403).json({ message: "User already registered!" });
        }
        else {
            
            const newUser = new User({
                firstName: FirstName,
                lastName: LastName,
                userName: UserName,
                password: newP,
                userRole: UserRole

            });
            //save user to mongo
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" })
            console.log(newUser);
            
        
            
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

adminRoute.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;


    const Result = await User.findOne({ userName: UserName })
    console.log(Result);
    if (Result) {
        const isvalid = await bcrypt.compare(Password, Result.password)
        console.log(isvalid);
        console.log(Result.userRole);
        if (isvalid) {
            const token = jwt.sign({ UserName: Result.userName, UserRole: Result.userRole }, secretkey, { expiresIn: '1h' })
            console.log("token=", token);

            res.cookie('authToken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "success" })
        }
        else {
            res.status(103).json({ message: "please check your credentials" })
        }
    }
    else {
        res.status(103).json({ message: "please register" });
        console.log("User not present please register");
    }

})


userRoute.post('/issuecertificate',authenticate,(req,res)=>{
    // console.log("hi");
    
    try{
        if(req.UserRole=='Admin'){
            // res.status(200).json({message:"Successfully issued"})
        
        const {
            CertificateId,
            Course,
            CertificateName,
            Grade,
            IssueDate
        }=req.body;
         Certificate.set(CertificateId,{Course,CertificateName,Grade,IssueDate})
         console.log(Certificate,'Certificate issued!')
    }else{
        res.status(400).json({message:"Your not Admin"})
    }

    //     if(user.has(CertificateId)){
    //         console.log("Already Issued")
    //         res.status(200).json({message:"Already issued!"});
    //     }
    //     else{
    //         user.set(CertificateId,{Course,CertificateName,Grade,IssueDate});
    //         console.log(user);
    //         res.status(201).json({message:"New Certificate!"})
    //     }
    }
    catch(error){
        res.status(500).json(error);
    }
})
userRoute.get('/viewUser',authenticate,(req,res)=>{
    try{
    const user=req.UserRole;
    res.json({user});}
    catch{
        res.status(404).json({message:'user not authorized'});
    }
})

userRoute.get('/viewCertificate/:id',(req,res)=>{
 const certid=req.params.id;
//  console.log(certid)
//  console.log(user)
 if(Certificate.has(certid)){
    const data=Certificate.get(certid);
    console.log(data)
    console.log("This is certify that Sandhya");
    console.log(`has successfully completed ${data.CertificateName}`);
    console.log(`with ${data.Grade} on ${data.IssueDate}`)

res.status(200).json({message:"Success"})
 }
});

export{userRoute};
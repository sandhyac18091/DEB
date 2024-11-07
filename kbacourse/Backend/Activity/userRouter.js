import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/author.js";

const userRoute = Router();

const user=new Map();
const Certificate=new Map();
const secretkey=process.env.SecretKey;


userRoute.post('/signup', async (req, res) => {
    try {
        const { FirstName,
            LastName,
            UserName,
            Password,
            UserRole } = req.body;
        const newP = await bcrypt.hash(Password, 10);
       
        if (user.has(UserName)) {
            console.log("User already registered!")
            res.status(403).json({ message: "User already registered!" });
        }
        else {
            user.set(UserName, { FirstName, LastName, Password: newP, UserRole });
            console.log("User successfully registered!")
            res.status(201).json({ message: "User Successfully registered!" });
            console.log(user.get(UserName));
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

userRoute.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    console.log(UserName);

    const Result = user.get(UserName);
    if (user.has(UserName)) {
        const isvalid = await bcrypt.compare(Password, Result.Password)
        console.log(isvalid);
        console.log(Result.UserRole);
        if (isvalid) {
            const token = jwt.sign({ UserName: UserName, UserRole: Result.UserRole }, secretkey, { expiresIn: '1h' })
            console.log(token);

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
        const {
            CertificateId,
            Course,
            CertificateName,
            Grade,
            IssueDate
        }=req.body;
        if(req.UserRole=='Admin'){
            if(Certificate.has(CertificateId)){
                console.log("Already Issued")
                res.status(200).json({message:"Already issued!"});
            }else{
                Certificate.set(CertificateId,{Course,CertificateName,Grade,IssueDate})
                 res.status(201).json({message:"certificate issued"})
                 console.log(Certificate.get(CertificateId))
            }
            // res.status(200).json({message:"Successfully issued"})
        
       
         
    }else{
        res.status(400).json({message:"Your not Admin"})
    }

        
        // else{
        //     user.set(CertificateId,{Course,CertificateName,Grade,IssueDate});
        //     console.log(Certificate);
        //     res.status(201).json({message:"New Certificate!"})
        // }
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
userRoute.get('/getCertificate/:CourseID',(req,res)=>{
    try{
        const search =req.params.CourseID
   console.log(search);

        if (user.has(search)) {
            console.log(user.get(search));
            const items =user.get(search)
            return res.status(200).json({
                message:search,
                course:items
            })

        }
        else {
            res.status(404).json({ message: "No course found,Check the name" })
        }
    }
    catch (error) {
        res.status(400).json({ message: "Check the input" })
    }
 })

export{userRoute};
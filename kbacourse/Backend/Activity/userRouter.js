import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/author.js";
import mongoose from 'mongoose';

const userRoute = Router();
mongoose.connect('mongodb://localhost:27017/Certiapp')





const userSchema=new mongoose.Schema(
    {
        firstname:String,
        lastname:String,
        username:{type:String,unique:true},
        password:String,
        userRole:String
    }
)
// create Model
const User=mongoose.model('userdetails',userSchema);


const secretkey=process.env.SecretKey;



userRoute.post('/signup', async (req, res) => {
    try {
        const { FirstName,
            LastName,
            UserName,
            Password,
            UserRole } = req.body;
        const newP = await bcrypt.hash(Password, 10);
        const existingUser=await User.findOne({username:UserName})

        if(existingUser){
            
        
       
        
            res.status(400).json({ message: "user already exist" })
            console.log("user already registered")
        }
        else {
            const newUser=new User({
                firstname:FirstName,
                lastname:LastName,
                username:UserName,
                password:newP,
                userRole:UserRole
            });
            // save user to mongo
            await newUser.save();
            console.log("User successfully registered!")
            res.status(201).json({ message: "User Successfully registered!" });
            console.log(newUser);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

userRoute.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    console.log(UserName);

    const existingUser = await User.findOne({ username: UserName });

    if (existingUser) {
        const isvalid = await bcrypt.compare(Password, existingUser.password);
        console.log(isvalid);
        console.log(existingUser.userRole);

        if (isvalid) {
            const token = jwt.sign({ UserName: UserName, UserRole: existingUser.userRole }, secretkey, { expiresIn: '1h' });
            console.log(token);

            res.cookie('authToken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "success" });
        } else {
            res.status(403).json({ message: "Invalid password" });
        }
    } else {
        res.status(403).json({ message: "Please check your credentials" });
    }
});



const certificateSchema = mongoose.Schema({
    certificateid: { type: String, unique: true },
    course: String,
    certificatename: String,
    grade: String,
    issuedate: String
});
const issuecert = mongoose.model('issuedetails', certificateSchema);

userRoute.post('/issuecertificate', authenticate, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.UserRole === 'Admin') {
            const {
                CertificateId,
                Course,
                CertificateName,
                Grade,
                IssueDate
            } = req.body;

           
            const existingissuecertificate = await issuecert.findOne({ certificateid: CertificateId });
            if (existingissuecertificate) {
                return res.status(400).json({ message: "Certificate already issued." });
            }

            
            const newissuecert = new issuecert({
                certificateid: CertificateId,
                course: Course,
                certificatename: CertificateName,
                grade: Grade,
                issuedate: IssueDate
            });

            newissuecert.save();
            res.status(200).json({ message: "Certificate issued successfully!" });
            console.log(newissuecert);
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



userRoute.get('/viewUser',authenticate,(req,res)=>{
    try{
    const user=req.UserRole;
    res.json({user});}
    catch{
        res.status(404).json({message:'user not authorized'});
    }
})


userRoute.get('/getcourse/:id', async (req, res) => {
    const certid = req.params.id;

    try {
        
        const search = req.params.id;
        console.log(search);

        if (!viewcert) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        
        console.log("This is to certify that Sandhya");
        console.log(`has successfully completed ${viewcert.certificatename}`);
        console.log(`with a grade of ${viewcert.grade} on ${viewcert.issuedate}`);

        
        res.status(200).json({
            message: "Success",
            certificate: {
                certificateid: viewcert.certificateid,
                course: viewcert.course,
                certificatename: viewcert.certificatename,
                grade: viewcert.grade,
                issuedate: viewcert.issuedate
            }
        });
    } catch (error) {
        console.error("Error fetching certificate:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export{userRoute};
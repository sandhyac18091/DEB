import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/author.js";
import dotenv from "dotenv";

dotenv.config();

const adminRoute = Router();//create instance


const user = new Map()
const Course = new Map()



const secretkey = process.env.SecretKey;
// adminRoute.use(json());

adminRoute.get('/', (req, res) => {
    res.send("Hello world");
})

//signup

adminRoute.post('/signup', async (req, res) => {
    try {
        // console.log('hai');
        const data = req.body;
        // console.log(data.UserName);
        const { FirstName,
            LastName,
            UserName,
            Password,
            UserRole,
        } = data;
        // console.log(FirstName);
        const newP = await bcrypt.hash(Password, 10)


        // console.log(newP);
        // console.log(user.get(UserName));
        // console.log(user)
        // res.status(201).send("data saved")
         

        if (user.has(UserName)) {
            res.status(400).json({ message: "user already registered" })
            console.log("user already registered")
        } else {
            console.log("successfully registered")
            res.status(202).send({message:"successfully registered"})
            user.set(UserName, {
                FirstName, LastName, newP, UserRole
            });
            console.log(user);

        }
    }
    catch (error) {
        res.status(500).json(error);
        console.error(error);
        
    }


})


//login


adminRoute.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    console.log(UserName);

    const Result = user.get(UserName);
    if (user.has(UserName)) {
        const isvalid = await bcrypt.compare(Password, Result.newP)
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

//addCourse


adminRoute.post('/addcourse', authenticate, (req, res) => {
    // console.log(req.UserName)
    const UserRole = req.UserRole;
    const data = req.body;
    const { CourseName,
        CourseId,
        CourseType,
        Description,
        Price,
    } = data;
    if (UserRole == "Admin") {
        Course.set(CourseId, { CourseName, CourseType, Description, Price })
        console.log(Course, 'Course Added')
    } else {
        console.log('you are not Admin')
    }

});

//update Course
adminRoute.post('/updateCourse',(req,res)=>{
    const data=req.body;
    const {CourseName,
        CourseId,
        CourseType,
        Description,
        Price,
    }=data;
    console.log(CourseId)
    const predata=Course.get(CourseId)
    if(Course.has(CourseId)){
        predata.CourseName=CourseName||predata.CourseName
        predata.CourseType=CourseType||predata.CourseType
        predata.Description=Description||predata.Description
        predata.Price=Price||predata.Price
        console.log(Course,predata)
        console.log(Course);
    }
})

//using params

adminRoute.get('/getCourse/:id', authenticate, (req, res) => {
    console.log(req.params.id);
})

//get course using query
adminRoute.get('/getCourse',(req,res)=>{
   
    const search=req.query.CourseId;
    try{
        
            if(search){
                const searchResult=[];
                for(const[CourseId,item] of Course){
                    if(CourseId.includes(search) || item.CourseName.includes(search)||item.CourseType.includes(search)){
                        searchResult.push(CourseId,item.CourseName,item.CourseType,item.Price,item.Description);
                        console.log('Course Details',searchResult);
                        res.status(200).json({message:"seach item found"})
                        break;
                    }
                    else{
                        console.log("Course not available");
                        res.status(404).json({message:"Course not availbale"})
                    }
                }
            }
        
    }
    catch(err){
        console.log(err);
    }
})
    
adminRoute.delete('/deleteCourse/:id',authenticate,(req,res)=>{
    const data=req.params.id;
    const UserRole = req.UserRole;
try{
    if(UserRole=="Admin"){
        if(Course.has(data)){
            Course.delete(data)
            console.log("Course Deleted!")
        }else{
            console.log("Id not found!")
        }
    }else{
        console.log("your not admin")
    }
        

}catch
(error){

}
})
adminRoute.get('/logout',(req,res)=>{
    res.clearCookie('authToken');
    res.status(200).json({message:'log out successfully'});
    console.log("Logout Successfully")
})

adminRoute.get('/viewUser',authenticate,(req,res)=>{
    try{
    const user=req.UserRole;
    res.json({user});}
    catch{
        res.status(404).json({message:'user not authorized'});
    }
})

adminRoute.get('/viewCourse', async(req,res)=>{
    try{
        console.log(Course.size);

        if(Course.size!=0){
           
            
        res.send(Array.from(Course.entries()))
    }
else{
    res.status(404).json({message:'Not Found'});
}}
    catch{
        res.status(404).json({message:"Internal error"})
    }
})



export { adminRoute };
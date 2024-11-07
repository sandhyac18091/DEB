import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../middleware/author.js";
import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const adminRoute = Router();//create instance



//Define User Schema
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
mongoose.connect('mongodb://localhost:27017/KBA_Courses')


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
        const existingUser = await User.findOne({ userName: UserName })

        if (existingUser) {
            // console.log(newP);
            // console.log(user.get(UserName));
            // console.log(user)
            // res.status(201).send("data saved")



            res.status(400).json({ message: "user already exist" })
            console.log("user already registered")
        } else {
            // console.log("successfully registered")
            // res.status(202).send({message:"successfully registered"})

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
    } catch (error) {
        res.status(500).json(error);
        console.error(error);

    }


})



//login


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

//addCourse


adminRoute.post('/addcourse', authenticate,async (req, res) => {
    try {
        const CourseSchema = new mongoose.Schema({ courseid: { type: String, unique: true }, coursename: String, coursetype: String, description: String, price:Number })
        // console.log(req.UserName)
        const Course = new mongoose.model('Coursedetails', CourseSchema);
        const UserRole = req.UserRole;
        const data = req.body;
        const { CourseName,
            CourseId,
            CourseType,
            Description,
            Price,
        } = data;
        if (UserRole == "Admin") {
            // Course.set(CourseId, { CourseName, CourseType, Description, Price })
            // console.log(Course, 'Course Added')
            const existingCourse = await Course.findOne({ courseid: CourseId })

            if (existingCourse) {
                res.status(400).json({message:"Course already present"})
            } else {
                // console.log('you are not Admin')
                const newCourse = new Course({
                    courseid: CourseId,
                    coursename: CourseName,
                    coursetype: CourseType,
                    description: Description,
                    price: parseInt(Price),
                });
                await newCourse.save()
                res.status(201).json({ message: "Course added successfully" })
            }
                
                
        } else{
            res.status(400).json({message:"Your not Admin"})
        }  
            
        } catch (error) {

            res.status(500).json(error);
            console.error(error);
        }
    
})

adminRoute.post('/updatecourse', authenticate, async (req, res) => {
            try {
                const body = req.body;
                const { CourseId, CourseName, CourseType, Description, Price } = body;
                const user=req.Role;
                console.log(user);
                
                
        
                if (user==="Admin") {
        
                    const result=await course.updateOne({courseId:CourseId},
                        {
                            $set:{
                                courseId:CourseId,
                                courseName:CourseName,
                                courseType:CourseType,
                                description:Description,
                                price:parseInt(Price)
                            }
                        }
                    );
                    if(result.matchedCount===0){
                        return res.status(400).json({message:"No such course"})
                    }else{
                        res.status(200).json({ message: "successfully Updated" })
                    }
           
                } else {
                    console.log('user not loggedin')
                    return res.status(401).json({ message: "User not authenticated" });
                }
        
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal Server Error" });
        
            }
         });

        //using params

        // adminRoute.get('/getCourse/:id', authenticate, (req, res) => {
        //     console.log(req.params.id);
        // })

        // //get course using query
        // adminRoute.get('/getCourse',(req,res)=>{

        //     const search=req.query.CourseId;
        //     try{

        //             if(search){
        //                 const searchResult=[];
        //                 for(const[CourseId,item] of Course){
        //                     if(CourseId.includes(search) || item.CourseName.includes(search)||item.CourseType.includes(search)){
        //                         searchResult.push(CourseId,item.CourseName,item.CourseType,item.Price,item.Description);
        //                         console.log('Course Details',searchResult);
        //                         res.status(200).json({message:"seach item found"})
        //                         break;
        //                     }
        //                     else{
        //                         console.log("Course not available");
        //                         res.status(404).json({message:"Course not availbale"})
        //                     }
        //                 }
        //             }

        //     }
        //     catch(err){
        //         console.log(err);
        //     }
        // })

        // adminRoute.delete('/deleteCourse/:id',authenticate,(req,res)=>{
        //     const data=req.params.id;
        //     const UserRole = req.UserRole;
        // try{
        //     if(UserRole=="Admin"){
        //         if(Course.has(data)){
        //             Course.delete(data)
        //             console.log("Course Deleted!")
        //         }else{
        //             console.log("Id not found!")
        //         }
        //     }else{
        //         console.log("your not admin")
        //     }


        // }catch
        // (error){

        // }
        // })
        // adminRoute.get('/logout',(req,res)=>{
        //     res.clearCookie('authToken');
        //     res.status(200).json({message:'log out successfully'});
        //     console.log("Logout Successfully")
        // })

        // adminRoute.get('/viewUser',authenticate,(req,res)=>{
        //     try{
        //     const user=req.UserRole;
        //     res.json({user});}
        //     catch{
        //         res.status(404).json({message:'user not authorized'});
        //     }
        // })

        // adminRoute.get('/viewCourse', async(req,res)=>{
        //     try{
        //         console.log(Course.size);

        //         if(Course.size!=0){


        //         res.send(Array.from(Course.entries()))
        //     }
        // else{
        //     res.status(404).json({message:'Not Found'});
        // }}
        //     catch{
        //         res.status(404).json({message:"Internal error"})
        //     }
        // })



        export { adminRoute };
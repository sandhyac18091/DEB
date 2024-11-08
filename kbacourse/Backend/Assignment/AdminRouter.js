import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "./middleware/auth.js"
import mongoose from "mongoose";

const libRoute = Router();

// const library=new Map();
mongoose.connect('mongodb://localhost:27017/Library')

const userSchema=new mongoose.Schema(
    {
        fullname:String,
        email:String,
        username:String,
        password:{type:String, unique:true},
        userrole:String,
    }
)
const user=mongoose.model('Userdetails',userSchema);

const secretkey=process.env.SecretKey;

libRoute.post('/Signup', async (req, res) => {
    try {
        const { FullName,
            Email,
            UserName,
            Password,
            UserRole } = req.body;
        const newP = await bcrypt.hash(Password, 10);
        const existingUser= await user.findOne({username:UserName})
        if(existingUser){
            console.log("User already registered!")
            res.status(403).json({ message: "User already registered!" });
        }
       
        
           
        
        else {
            const newuser=new user({
                fullname:FullName,
                email:Email,
                username:UserName,
                password:newP,
                userrole:UserRole,

            });
            await newuser.save();
            console.log("User successfully registered!")
            res.status(200).json({ message: "User Successfully registered!" });
            console.log(newuser);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})


libRoute.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    console.log(UserName);
    const existingUser = await user.findOne({ username: UserName });
    
    if (existingUser) {
        const isValid = await bcrypt.compare(Password, existingUser.password);
        
        console.log(isValid);
        console.log(existingUser.userrole);
        
        if (isValid) {
            const token = jwt.sign({ UserName: UserName, UserRole: existingUser.userrole }, secretkey, { expiresIn: '1h' });
            console.log(token);

            res.cookie('authToken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "success" });
        } else {
            res.status(401).json({ message: "please check your credentials" });
        }
    } else {
        res.status(404).json({ message: "please register" });
        console.log("User not present please register");
    }
});

const bookSchema=mongoose.Schema({
    bookid:{type:String,unique:true},
    booktitle:String,
    autor:String,
    booktype:String,
    description:String,
    price:String,
});
const book=mongoose.model('Bookdetails',bookSchema)
libRoute.post('/addBook',authenticate,async(req,res)=>{
    // try{}
    const UserRole=req.UserRole;
    
    
    if(UserRole=="Admin"){
        const{
            BookID,
            BookTitle,
            Author,
            BookType,
            Description,
            Price
        }=req.body
        // console.log(BookID);
        
        const existingBook=await book.findOne({bookid:BookID})
        if(existingBook){
            res.status(200).json({message:"Book already added"})
        console.log(library,"Book already added")
        }
        const newbook=new book({
            bookid:BookID,
            booktitle:BookTitle,
            author:Author,
            booktype:BookType,
            description:Description,
            price:Price,
        });
        newbook.save();
        res.status(200).json({message:"Book added Successfully!"})
        console.log(newbook);
        
    }else{
        res.status(404).json({message:"Your not admin"})
        console.log('You are not admin');
        
        
    }
});
libRoute.get('/getBook/:BookID', (req, res) => {
    try {
        const search = req.params.BookID;  
        console.log(search);

        
        if (library.has(search)) {
            console.log(library.get(search));  
            const book = library.get(search);  
            return res.status(200).json({
                message: "Book found",
                book: book
            });
        } else {
            
            res.status(404).json({ message: "Book not found, please check the ID" });
        }
    } catch (error) {
        
        res.status(400).json({ message: "Error retrieving book, please check the input", error: error.message });
    }
});





export{libRoute};
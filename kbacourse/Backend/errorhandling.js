import express,{json} from 'express';
import bcrypt from 'bcrypt';

const app=express();
app.use(json())
const port=8000;
const user=new Map()

app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.post('/signup',async(req,res)=>{
    try{
    console.log('hai');
    const data=req.body;
    console.log(data.UserName);
    const {FirstName,
        LastName,
        UserName,
        Password,
        Role,
    }=data;
    console.log(FirstName);
    const newP= await bcrypt.hash(Password,10)
    
    
    console.log(newP);
    console.log(user.get(UserName));
    console.log(user)
    // res.status(201).send("data saved")
    // 
    
        if(user.has(UserName)){
            res.status(400).json({message:"user already registered"})
        }else{
            console.log("please register")
            res.status(202).send("please register")
            user.set(UserName,{
                FirstName,LastName,UserName,Password:newP,Role
            });
        
        }}
        catch(error){
            res.status(500).json(error);
        }
    

})
app.listen(port,()=>{
    console.log(`Server is listening to ${port}`)
})
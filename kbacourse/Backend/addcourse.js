import {router} from 'express';



const port=7000;
const user=new Map()

addcourse.post('/',(req,res)=>{
    res.send("hello world");
    console.log("hello world");
})
addcourse.listen(port,()=>{
    console.log(`Server is listening to ${port}`)
})
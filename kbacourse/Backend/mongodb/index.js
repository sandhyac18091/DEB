import express,{json} from 'express';

import { adminRoute } from './Routes/adminroutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const app=express();
app.use(cors({
    origin:"http://127.0.0.1:5500",
   credentials:true
}))
app.use(json())
app.use(cookieParser());
app.use('/',adminRoute)

const ports=process.env.port;




    
    
       

app.listen(ports,()=>{
    console.log('Server is listening',ports)
})


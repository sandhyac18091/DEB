import express,{json} from 'express'; //import express module
import { libRoute } from './AdminRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const lib=express();
lib.use(cors({
    origin:"http://127.0.0.1:5500",
    credentials:true
}))
lib.use(json());
lib.use(cookieParser());

lib.use('/',libRoute)
const port=8006;



lib.listen(port,()=>{ 
    console.log(`Server is listening to port ${port}`);
})
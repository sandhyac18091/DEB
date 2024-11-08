import express,{json} from 'express';
import { userRoute } from './Routes/UserRouter.js'; 
import cors from 'cors';


const certiApp = express()
certiApp.use(cors({
    origin:"http://127.0.0.1:5500",
   credentials:true
}))
certiApp.use(json());

certiApp.use('/',userRoute);

const port=8002;

certiApp.listen(port,()=>{
    console.log(`Server is listening ${port}`);
})

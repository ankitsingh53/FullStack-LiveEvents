import express from 'express'
import dotenv from 'dotenv'
import { router } from './routes/router.js';
import cors from 'cors'

const app = express();
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use('/api', router)

app.get('/', (req, res)=>{
    res.send("<h1>Hello welcome to the Project</h1>")
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT} port`)
})
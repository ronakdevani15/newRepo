import express from 'express'
import dotenv from 'dotenv'
import { dbConnection } from './utils/db.js'
import userRoutes from './router/user.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config({path: './utils/config.env'})

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['POST','GET','PUT','DELETE'],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

dbConnection()

app.get('/', async (req,res) => {
    try {
        res.send({message: "hit this api!"})
    } catch (error) {
        
    }
})

app.use('/api/v1', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`server is runing on port ${process.env.PORT}`);
}
)
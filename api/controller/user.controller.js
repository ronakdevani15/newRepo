import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const currentUser = async (req,res) => {
    try {
        const user = await userModel.findOne({_id : res.userId})
        if (user) {
            res.status(200).send({success: true })
        }
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token").send({message: 'logout success fully!',success: true})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}
export const registerUser = async (req,res) => {
    try {

        const { username, email, password } = req.body 

        if (!username || !email || !password) {
            return res.status(200).send({message: "all fields are required!"})
        }

        const emailRegx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const userRegx = /^\s*$/

        const valiemail = emailRegx.test(email)
        
        if (valiemail === false) {
            return res.status(200).send({message: "please enter valid email format!"})
        }
        
        const valiUsername = userRegx.test(username)

        if (!valiUsername === false) {
            return res.status(200).send({message: "username shouldn't be empty!"})
        }
        
        const existUser = await userModel.findOne({$or : [{email}, {username}]})
        if (existUser) {
            return res.status(200).send({message: "user is already exist!"})
        }

        const hashPassword = await bcrypt.hash(password, 5)
        
        const user = await userModel.create(
            { username, email, password: hashPassword }
        )

        res.status(200).send({ success: true, message: user })
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}
export const loginUser = async (req,res) => {
    try {

        const { multFields, password } = req.body 

        if (!multFields || !password) {
            return res.status(200).send({message: "all fields are required!"})
        }

        const userDetails = await userModel.findOne({ $or : [{username: multFields},{email: multFields}] })
        if (userDetails &&(await bcrypt.compare(password, userDetails.password))) {
            const token = jwt.sign({userId : userDetails._id,email: userDetails.email, brand: "tech"},process.env.SEC_KEY)
            res.cookie('token', token,{httpOnly: true}, {Credential : true}).send({message: 'login success!',success: true})
        }else{
            return res.status(200).send({message: "wrong credentials"})
        }
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}
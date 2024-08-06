import express from 'express'
import { currentUser, loginUser, logOut, registerUser } from '../controller/user.controller.js'
import { authToken } from '../middleWare/authToken.js'

const route = express.Router()

route.post('/register',registerUser)
route.post('/login',loginUser)
route.get('/current',authToken,currentUser)
route.get('/logout',logOut)

export default route
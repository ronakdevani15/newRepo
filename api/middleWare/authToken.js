import jwt from 'jsonwebtoken'

export const authToken = async (req,res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.send({success: false, message: "wrong credentials!"})
        }
        const verifyToken = jwt.verify(token, process.env.SEC_KEY)
        res.userId = verifyToken.userId
        next()
    } catch (error) {
        console.log(error.message);
    }
}
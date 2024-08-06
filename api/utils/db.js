import { connect } from 'mongoose'

export const dbConnection = async () => {
    try {
        await connect(process.env.MONGODB_URL)
        console.log('db connected!');
    } catch (error) {
        console.log(error.message)
    }
}
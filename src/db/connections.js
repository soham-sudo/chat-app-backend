import mongoose from "mongoose"

import { dbName } from "../../constants.js"


const connectDb = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Cannot connect to DB", error)
        process.exit(1)
    }
}

export {connectDb}
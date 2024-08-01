import dotenv from "dotenv"

import { connectDb } from "./db/connections.js"

import app from "./app.js"

dotenv.config()

const port = process.env.PORT || 8000

connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
.catch((error)=>{
    console.log(`connect to db failed`, error)
})
import mongoose from "mongoose"

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    

  },
  { timestamps: true }
)

//middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
    
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,//db id
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

const User = mongoose.model("User", userSchema)

export { User } 

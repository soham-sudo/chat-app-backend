import { User } from "../models/user.model.js";

import { errorHandler } from "../utils/errorHandler.js"
import { apiResponse } from "../utils/apiResponse.js";




export const signup = async (req, res, next) => {
    const { username, email, password, confirmPassword, gender } = req.body

    if (
        [email, username, password, confirmPassword].some((field) => field?.trim() === "")
    ) {
        return next(errorHandler(400, "All fields are required"))
    }

    if (gender != "male" && gender != "female") {
        return next(errorHandler(400, "gender required to be male or female"))
    }
    if (password !== confirmPassword) {
        return next(errorHandler(400, "Password don't match"))
    }

    const validUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (validUser) {
        return next(errorHandler(400, "User already exists"))
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`


    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return next(errorHandler(500, "Something went wrong while registering the user"))
    }

    return res.status(201).json(
        apiResponse(201, createdUser, "User registered Successfully")
    )

}


export const login = async (req, res, next) => {

    const { email, username, password } = req.body

    if ((email.trim === "" || username.trim === "") && password.trim === "") {
        return next(errorHandler(400, "email or username ,password required"))
    }

    const validUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if (!validUser) {
        return next(errorHandler(404, "User not found"))
    }
    const isPasswordValid = await validUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return next(errorHandler(401, "Invalid user credentials"))
    }

    const accessToken = validUser.generateAccessToken()

    const loggedInUser = await User.findById(validUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken
                },
                "User logged In Successfully"
            )
        )
}

export const logout = async (req, res) => {


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)        .json(apiResponse(200, {}, "User logged Out"))

}

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
 export const allUsers = async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  };

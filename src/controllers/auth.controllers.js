import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js"


//generate access and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId) //find user by id
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken //store in Db
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken} //sent to client
    } catch (error) {
        throw new ApiError(
            500, 
            "Somthing went wrong while generating the access token"
        )
    }
}

const registerUser = asyncHandler(async(req, res)=> {
    const { email, username, password, role } = req.body

    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existingUser) {
        throw new ApiError(400, "User with this email or username already exists");
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const { unHashedToken, hashedToken, tokenExpiry } = 
    user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken,
    user.emailVerificationTokenExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            
        )
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -forgotPasswordTokenExpiry"
    );

    if(!createdUser) {
        throw new ApiError(500, "somthing went wrong while registring a user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user: createdUser},
                "User register successfully and verification email has been sent on your email"
            )
        )

})

export { registerUser }
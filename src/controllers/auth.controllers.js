import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

//generate access and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId); //find user by id
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //store in Db
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken }; //sent to client
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating the access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

const { unHashedToken, hashedToken, tokenExpiry } =
user.generateTemporaryToken();
    
user.emailVerificationToken = hashedToken;
user.emailVerificationTokenExpiry = tokenExpiry;

await user.save({ validateBeforeSave: false });

await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -forgotPasswordTokenExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while registring a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User register successfully and verification email has been sent on your email",
      ),
    );
});

//login user

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide email");
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
 //update refresh token in db
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -forgotPasswordTokenExpiry",
  );

  //cookie options 
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
});

//logout User

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      }
    },
    {
      new: true, 
    }
  );

  const options = {
    httpOnly: true,
    secure: true
  }
  return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(200, {},  "User logged Out")
      )
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
   .status(200)
   .json(new ApiResponse(200, req.user, "Current user fatched succesfulluy"))
});

const verifyEmail = asyncHandler(async(req, res) => {
  const { verificationToken } = req.params

  if(!verificationToken) {
    throw new ApiError(400, "Email verification token is missing")
  }

  let hashedToken = crypto
   .createHash("sha256")
   .update(verificationToken)
   .digest("hex")

   const user = User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: {$gt: Date.now()}
   })

   if(!user) {
    throw new ApiError(400, "Token is invalid or expired")
   }

   user.emailVerificationToken = undefined
   user.emailVerificationTokenExpiry = undefined

   user.isEmailVerified = true
   await user.save({validateBeforeSave: false});

   return res
   status(200),
   json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true
      },
      "Email is verified",
    )
   )
})

const resendEmailVerification = asyncHandler(async(req, res)=> {
  const user = await User.findById(req.user?._id);

  if(!user) {
    throw new ApiError(400, "User does not exist")
  }
  if(user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified")
  }

const { unHashedToken, hashedToken, tokenExpiry } =
user.generateTemporaryToken();
    
user.emailVerificationToken = hashedToken;
user.emailVerificationTokenExpiry = tokenExpiry;

await user.save({ validateBeforeSave: false });

await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });


  return res 
  .status(200)
  .json(
    new ApiResponse(200, {}, "Mail has been sent to your email Id")
  )
})

const refreshAccesToken = asyncHandler(async(req, res)=> {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken) {
    throw new ApiError(401, 'Unautorized access')
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);
    if(!user) {
      throw new ApiError(401, "Unauthorized access")
    }

    if(incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired")
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    user.refreshToken = newRefreshToken;

    await user.save()

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )

  } catch (error) {

     throw new ApiError(401, "invalid refresh token")
  }
})

export { 
  registerUser,
  login, 
  logoutUser,
  verifyEmail,
  resendEmailVerification
};

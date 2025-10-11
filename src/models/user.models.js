import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto"
const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `https://placeholder.co/200×200`,
            localPath: "",
        }
    },

    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        require: [true, "Password is required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationTokenExpiry: {
        type: Date
    }
},{ timestamps: true})


// Pre-save hook to hash password before saving to DB
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10); // corrected
    next();
});



// Instance method to compare password for login
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password || !this.password) {
    return false; // prevent bcrypt error
  }
  return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            
        _id: this._id,
        email: this.email,
        username: this.username

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            
        _id: this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
)
}



//create a hashed token


userSchema.methods.generateTemporaryToken = function() {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    //hash the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken).
        digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000) //20minutes
    return{ unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)
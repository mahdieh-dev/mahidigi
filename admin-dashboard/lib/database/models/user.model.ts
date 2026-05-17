import mongoose from "mongoose"
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    defaultPaymentMethod: {
        type: String,
        default: "",
    },
    address: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        address1: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String
        },
        country: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        }
    },
}, { timestamps: true })

// sign in admin with JWT
UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

// comparing the password for admin
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User
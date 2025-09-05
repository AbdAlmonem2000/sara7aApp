import mongoose, { Schema } from "mongoose";


export const genderEnum = {
    male: "male",
    female: "female",
}
export const provider = {
    system: "SYSTEM",
    google: "GOOGLE",
}
export const role = {
    admin: "ADMIN",
    user: "USER",
}



const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "the first must be least 3 characters"],
        maxLength: [20, "the first must be most 20 characters"],
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "the last must be least 3 characters"],
        maxLength: [20, "the last must be most 20 characters"],
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: function () {
            return this.provider === provider.system ? true : false;
        },
    },

    gender: {
        type: String,
        enum: {
            values: Object.values(genderEnum),
            message: "invalid gender"
        },
        default: genderEnum.male
    },

    phone: String,
    confirmEmail: Date,


    //local
    profileImage: String,
    coverImages: [String],

    //cloudinary
    profileCloudImage: {
        public_id: String,
        secure_url: String,
    },
    coverCloudImages: [
        {
            public_id: String,
            secure_url: String,
        }
    ],

    confirmEmailOtp: String,

    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    forgetPasswordOtp: String,

    provider: {
        type: String,
        enum: {
            values: Object.values(provider),
            message: "invalid provider must be google or system"
        },
        default: provider.system
    },
    role: {
        type: String,
        enum: {
            values: Object.values(role),
            message: "invalid role must be ADMIN or USER"
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.virtual("message", {
    localField: "_id",
    foreignField: "recieverId",
    ref: "Message"
})

export const userModel = mongoose.models.User || mongoose.model("User", userSchema)
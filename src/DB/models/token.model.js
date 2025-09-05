import mongoose, { Schema } from "mongoose";


const tokenSchema = new Schema({

    jti: {
        type: String,
        required: true,
        unique: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

}, { timestamps: true });


export const tokenModel = mongoose.models.token || mongoose.model("token", tokenSchema)
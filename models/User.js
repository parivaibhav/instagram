import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: "/images/default-avatar.png" },
        bio: { type: String, default: "" },

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        // 🔑 Reset password fields
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }, // 5 min expiry
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

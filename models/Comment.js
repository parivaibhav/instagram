import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },   // 🔹 changed from `content` to `text`
}, {
    timestamps: true,
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

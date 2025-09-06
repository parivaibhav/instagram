import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] }, // <-- fixed
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, {
    timestamps: true,
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);

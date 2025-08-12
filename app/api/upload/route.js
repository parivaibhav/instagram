import cloudinary from "../../../lib/cloudinary";
import { rateLimiter } from "../../../middleware/rateLimiter";

export async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimiter(ip)) {
            return new Response("Too many requests", { status: 429 });
        }

        const data = await request.json();
        const { imageBase64 } = data;

        if (!imageBase64)
            return new Response("No image provided", { status: 400 });

        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
            folder: "instagram-clone",
            resource_type: "image",
        });

        return new Response(
            JSON.stringify({ url: uploadResponse.secure_url }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(error.message || "Internal Server Error", { status: 500 });
    }
}

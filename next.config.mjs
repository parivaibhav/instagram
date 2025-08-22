/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "via.placeholder.com", // for placeholder.com images
            "picsum.photos",        // for Picsum placeholder images
            "res.cloudinary.com",
        ],
    },
};

export default nextConfig;

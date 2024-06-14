/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'viocclflxeizomapqxsm.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/cabin-images/**',
            },
            {
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    //For whole site SSG, but will need to implement on image loader (ex. Cloudinary)
    // output: 'export',
};

export default nextConfig;

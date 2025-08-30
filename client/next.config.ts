import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWANextConfig = withPWA({
    disable: isDev,
    dest: "public",
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWANextConfig(nextConfig);

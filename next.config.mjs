/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    domains: [
      'lh3.googleusercontent.com', // Images de profil Google
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'res.cloudinary.com'
    ],
    formats: ["image/webp", "image/avif"],
    // Configuration pour les images distantes avec patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Configuration Sass
  sassOptions: {
    includePaths: ["./src/assets/styles"],
  },

  // Configuration webpack pour les SVG
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // TEMPORAIRE : Désactiver le cache pour résoudre le problème
    // config.cache = false;

    return config;
  },

  // Configuration expérimentale
  experimental: {
    optimizePackageImports: ["iconoir-react"],
    // Désactiver le worker webpack temporairement
    // webpackBuildWorker: false,
  },

  // Optimisations de production
  poweredByHeader: false,
  compress: true,

  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
                      {
              key: "Content-Security-Policy",
              value:
                `default-src 'self' https://maps.googleapis.com https://maps.gstatic.com; ` +
                `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; ` +
                `style-src 'self' 'unsafe-inline'; ` +
                `img-src 'self' data: blob: https:; ` +
                `font-src 'self' data:; ` +
                `connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://maps.googleapis.com https://maps.gstatic.com https://dominant-skylark-civil.ngrok-free.app;`,
            },
        ],
      },
    ];
  },
};

export default nextConfig;

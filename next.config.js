/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            os: false,
        };

        // Exclude problematic binary files
        config.externals = config.externals || [];
        config.externals.push({
            'onnxruntime-node': 'commonjs onnxruntime-node',
        });

        // Ignore specific binary files that cause webpack issues
        config.module.rules.push({
            test: /\.node$/,
            loader: 'ignore-loader',
        });

        return config;
    },
}

module.exports = nextConfig

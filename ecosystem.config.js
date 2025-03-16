module.exports = {
  apps: [
    {
      name: 'mahayojana-backend',
      script: 'build/server.js', // The built entry file
      node_args: '-r dotenv/config',
      instances: 1, // Set to "max" to use all CPU cores
      autorestart: true,
      watch: false,
      env: {
        PORT: 8081, // Change this to your desired port
        NODE_ENV: 'production',
      },
    },
  ],
};

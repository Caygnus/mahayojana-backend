require('dotenv').config(); // Load .env file

module.exports = {
  apps: [
    {
      name: "mahayojana-backend",
      script: "build/server.js",
      node_args: "-r dotenv/config",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        ...process.env,  // Load all env variables from .env
        PORT: 8081,      // Override PORT (if needed)
        NODE_ENV: "production"  // Override NODE_ENV (if needed)
      },
    },
  ],
};

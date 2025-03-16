require('dotenv').config(); // Load .env file

module.exports = {
  apps: [
    {
      name: "mahayojana-backend",
      script: "npm",
      args: "run start",
      env: {
        ...process.env,
        PORT: 8081,
        NODE_ENV: "production",
      },
    },
  ],
};

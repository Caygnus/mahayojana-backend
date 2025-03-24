require('dotenv').config(); // Load .env file

module.exports = {
  apps: [
    {
      name: 'mahayojana-backend',
      script: 'build/server.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        // Port will be dynamically assigned by the deployment script
      },
    },
  ],
};

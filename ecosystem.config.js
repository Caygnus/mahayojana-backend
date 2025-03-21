require('dotenv').config(); // Load .env file

module.exports = {
  apps: [
    {
      name: 'mahayojana-backend',
      script: 'build/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        DB_NAME: 'mahayojana-dev-db'
      }
    }
  ]
};

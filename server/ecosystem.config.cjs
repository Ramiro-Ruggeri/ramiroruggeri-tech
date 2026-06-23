// =============================================================
// server/ecosystem.config.cjs
// PM2 process config. Use: pm2 start server/ecosystem.config.cjs
// =============================================================
module.exports = {
  apps: [
    {
      name: 'ramiroruggeri',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '300M',
      autorestart: true,
      watch: false,
      time: true,
    },
  ],
};

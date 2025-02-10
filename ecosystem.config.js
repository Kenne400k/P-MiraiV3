module.exports = {
  apps : [{
    script: 'src/index.js',
    watch: false, 
    attach: true,
    args: "--no-pmx",
    env: {
      NODE_ENV: "development",
      PM2_SILENT: true
    },
    env_production: {
      NODE_ENV: "production",
      PM2_SILENT: true
    },
    max_restarts: 4,
    min_uptime: "120s",
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

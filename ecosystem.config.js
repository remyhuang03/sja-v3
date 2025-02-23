module.exports = {
  apps: [{
    script: 'npm start',
  }],

  deploy: {
    production: {
      key: 'key.pem',
      user: 'root',
      host: '139.196.178.129',
      ref: 'origin/main',
      repo: 'https://github.com/remyhuang03/sja-v3',
      path: '/home/site',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options':"ForwardAgent=yes"
    }
  }
};

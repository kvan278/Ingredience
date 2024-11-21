module.exports = {
    apps: [
        {
            name: 'Node Server',
            script: 'server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'development',
                PORT: 4020
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4020
            }
        }
    ]
}

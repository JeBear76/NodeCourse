const environments = {};

environments.staging = {
    port: 3000,
    sslPort: 3001,
    envName: 'staging'
};

environments.production = {
    port: 5000,
    sslPort: 5001,
    envName: 'production'
};

var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

var currentConfig = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = currentConfig;
const http = require('http');
const debounce = require('debounce');

const Socket = require('./socket');
const RancherAPI = require('./rancherApi');
const SlackAPI = require('./slackApi');

const services = {};

const rancherApi = new RancherAPI({
    host: process.env.HOST,
    projectId: process.env.PROJECT_ID,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});

const slackApi = new SlackAPI({
    token: process.env.SLACK_TOKEN,
    chanel: process.env.SLACK_CHANNEL,
});

const onServiceUpgrade = async (serviceId) => {
    const serviceInfo = await rancherApi.fetchRancherInfo(serviceId);

    const launchConfig = serviceInfo.launchConfig;
    const toVersion = launchConfig.imageUuid.split('docker:').pop().split(':')[1];
    const labels = launchConfig.labels;

    if (labels['whistler.enable'] !== 'true') {
        // this is a service that hasn't enabled whistler.
        return;
    }

    // keep a history of previous and current version
    const history = {
        previous: (services[serviceId] && services[serviceId].version),
        version: toVersion,
    };


    if (history.previous === history.version) {
        // we only care about version changes
        console.log(`No version change detected for ${serviceId}`);
        return;
    }

    const meta = {};

    labels['whistler.meta']
        .split(',')
        .map(s => s.split('='))
        .map(keyValue => meta[keyValue[0]] = keyValue[1]);

    slackApi.postMessage({
        serviceName: serviceInfo.name,
        ...history,
        ...meta,
    });

    // finally, store information about this service for later lookup.
    services[serviceId] = history;
}

const socket = new Socket({
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
    host: process.env.HOST,
    projectId: process.env.PROJECT_ID,
    onServiceUpgrade: debounce(onServiceUpgrade, 5000),
});

socket.connect();

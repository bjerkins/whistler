const request = require('request');

class RancherAPI {
    constructor({ host, projectId, accessKey, secretKey }) {
        this.base = `https://${accessKey}:${secretKey}@${host}/v2-beta/projects/${projectId}/services`;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    fetchRancherInfo(serviceId) {
        return new Promise((resolve, reject) => {
            const url = `${this.base}/${serviceId}`;
            request(url, (err, res, body) => {
                const json = JSON.parse(body);
                resolve(json);
            });
        });
    }
}

module.exports = RancherAPI;

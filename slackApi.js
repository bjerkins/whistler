const request = require('request');

const messageTemplate = require('./message.json');

class SlackAPI {
    constructor({ token }) {
        this.url = `https://hooks.slack.com/services/${token}`
    }

    postMessage({ serviceName, version, previous, githubUrl, friendlyName }) {

        const replace = message => message
            .replace(/\${friendlyName}/, (friendlyName || serviceName))
            .replace(/\${version}/, version)
            .replace(/\${previous}/, (previous || `N/A`))
            .replace(/\${githubUrl}/, githubUrl);

        const message = {
            ...messageTemplate,
            attachments: messageTemplate.attachments.map(attachment => ({
                ...attachment,
                fallback: replace(attachment.fallback),
                title: replace(attachment.title),
                title_link: replace(attachment.title_link),
                fields: attachment.fields.map(field => ({
                    ...field,
                    value: replace(field.value),
                })),
            })),
            ts: parseInt(Date.now() / 1000),
        };

        request({ url: this.url, method: 'POST', json: message });
    }
}

module.exports = SlackAPI;

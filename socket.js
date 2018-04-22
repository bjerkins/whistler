const WebSocket = require('ws');

class Socket {
    constructor({ accessKey, secretKey, host, projectId, onServiceUpgrade }) {
        this.url = ''
            + 'wss://'
            + `${accessKey}:${secretKey}@${host}`
            + '/v2-beta/projects/'
            + `${projectId}`
            + '/subscribe?eventNames=resource.change';

        this.onMessage = this.onMessage.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);

        this.onServiceUpgrade = onServiceUpgrade;
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.on('open', this.onOpen);
        this.socket.on('message', this.onMessage);
        this.socket.on('close', this.onClose);
    }

    onMessage(messageStr) {
        const message = JSON.parse(messageStr);

        if (message.name === 'resource.change' && message.data) {
            const resource = message.data.resource;

            if (resource.eventType === 'service.finishupgrade') {
                this.onServiceUpgrade(resource.serviceId);
            }
        }
    }

    onOpen() {
        console.log('Socket opened');
    }

    onClose() {
        console.log('Socket closed');
    }
}

module.exports = Socket;

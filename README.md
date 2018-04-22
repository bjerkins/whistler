# whistler
> Pheuuud ♪ Hey cowboy! Ya service got upgraded.

`whister` is a small service that can tap into the event stream from [Rancher](https://rancher.com/)
and will notify you when your service has finished upgrading.

## Features

- Docker image.
- Rancher.
- Service labels to control notifications.
- Slack.

## Deploying

The following environment variables need to be set:

| Variable      | Description                          |
| --------------|--------------------------------------|
| `HOST`        | The hostname/IP of Rancher server.   |
| `ACCESS_KEY`  | Rancher environment access key*.     |
| `SECRET_KEY`  | Rancher environment secret key*      |
| `PROJECT_ID`  | The Rancher project (environment) ID |
| `SLACK_TOKEN` | Slack webhook token.                 |
_* https://rancher.com/docs/rancher/v1.6/en/api/v2-beta/api-keys/_

Example:

```sh
$ docker run \
    -e "HOST=rancher.locally" \
    -e "ACCESS_KEY=XXX" \
    -e "SECRET_KEY=XXX" \
    -e "PROJECT_ID=XXX" \
    -e "SLACK_TOKEN=XXX" \
    -v ./message.json:/app/message.json \
    bjerkins/whistler:latest
```

🚀 Enjoy some sweet, automated deploy notifications.

## Slack Message Customization

To customize the Slack message to your needs, you should mount `message.json` to `/app/message.json`
inside the container. This service uses a standard [Slack attachment
message](https://api.slack.com/docs/messages/builder) where the following template variables are
available:

| Variable           | Label   | Description                                                           |
| -------------------|---------|-----------------------------------------------------------------------|
| `${version}`       | No      | The upgraded version of the service.                                  |
| `${previous}`      | No      | The previous version of the upgraded service                          |
| `${friendlyName}`  | Yes     | Friendly name of the service                                          |
| `${githubUrl}`     | Yes     | Github URL of the service. Will be used to point to the release notes.|

### Example message

Example of `message.json`:
```json
{
    "channel": "#some-slack-channel",
    "attachments": [{
        "fallback": "${friendlyName}:${version} has been released!",
        "color": "#bada55",
        "pretext": "Pop the cork :champagne: My awesome service just got a little better with a new release :rocket:",
        "title": "${friendlyName} (release notes)",
        "title_link": "${githubUrl}/releases/tag/${version}",
        "fields": [
            {
                "title": "Version",
                "value": "${version}",
                "short": false
            },
            {
                "title": "Previous",
                "value": "${previous}",
                "short": false
            }
        ],
    }]
}
```

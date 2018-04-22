# whistler
> Pheuuud ♪ Hey cowboy! Ya service got upgraded.

`whister` is a small service that can tap into the event stream from [Rancher](https://rancher.com/)
and will notify you when your service has finished upgraded.

## Features

- Docker image.
- Rancher.
- Service labels to control notifications.
- Slack.

## Deploying

_Todo_

## Slack Message Customization

To customize the Slack message to your needs, you should mount `message.json` to `/app/message.json`
inside the container. This service uses a standard [Slack attachment
message](https://api.slack.com/docs/messages/builder) where the following template variables are
available:

| Variable           | Default | Description                                                                 |
| -------------------|---------|-----------------------------------------------------------------------------|
| `${version}`       |         | The upgraded version of the service.                                        |
| `${previous}`      | "N/A"   | The previous version of the upgraded service                                |
| `${friendlyName}`  |         | Friendly name of service, provided by the metadata using the service labels |
| `${githubUrl}`     |         | Github URL of the service. Will be used to point to the release notes.      |

### Example message

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

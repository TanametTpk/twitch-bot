import tmi from 'tmi.js'

const client = new tmi.Client({
    options: {
        debug: [undefined, 'development'].includes(process.env.NODE_ENV),
    },
    connection: { reconnect: true },
    identity: {
        username: process.env.tmi_username,
        password: process.env.TWITCH_OAUTH_TOKEN,
    },
    channels: [process.env.tmi_channel_name as string],
})

export default client
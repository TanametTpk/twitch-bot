import Config, { DiscordConfig, TwitchConfig } from "../../interfaces/Configs";

const readTwitchConfig = (): TwitchConfig => {
    return {
        channel_name: process.env.TWITCH_OAUTH_TOKEN || ""
    }
}

const readDiscordConfig = (): DiscordConfig => {
    return {
        token: process.env.DISCORD_OAUTH_TOKEN || ""
    }
}

export default (): Config => {

    return {
        discord: readDiscordConfig(),
        twitch: readTwitchConfig()
    }

}
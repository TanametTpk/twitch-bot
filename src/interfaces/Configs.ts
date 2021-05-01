export default interface Config {
    discord: DiscordConfig
    twitch: TwitchConfig
}

export interface DiscordConfig {
    token: string
}

export interface TwitchConfig {
    channel_name: string
}
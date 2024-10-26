import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../types/botModule";

export const gameInfoCommand: BotCommand = {
    name: "game-info",
    description: "Gets info about the game(s) of the server.",
    category: "game",
    permissions: 0n,
    aliases: [],
    data: new SlashCommandBuilder()
        .setName("game-info")
        .setDescription("Gets info about the game(s) in the server.")
        .setIntegrationTypes([ ApplicationIntegrationType.GuildInstall ])
        .setContexts([ InteractionContextType.Guild ])
        .addStringOption(o =>
            o.setName("game-id")
            .setDescription("If not null, gets info about a more specific game.")
            .setRequired(false)
        ).toJSON(),
    Execute(client, interaction) {
        var gameId = interaction.options.get("game-id")?.value as string;
    }
}
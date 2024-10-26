import { APIApplicationCommandOption, ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { GamesHandler } from "../handlers/gameHandler";
import { PlayerCreationHandler } from "../handlers/playerCreationHandler";
import { Stats } from "../models/stats";
import { BotCommand } from "../types/botModule";

export const setPlayerStats: BotCommand = {
    name: "set-stat",
    category: "game",
    description: "Sets stats of the player.",
    aliases: [],
    permissions: 0n,
    data: new SlashCommandBuilder()
        .setName("set-stat")
        .setDescription("Sets stats of the player.")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption(o =>
            o.setName("stat")
            .setDescription("Statistic to modify")
            .setChoices(statsToOptions())
            .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("value")
            .setDescription("new value of the statistic")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addUserOption(o =>
            o.setName("user")
            .setDescription("User to set stats for")
            .setRequired(false)
        )
        .toJSON(),
    async Execute(client, interaction) {
        var user = interaction.options.get("user")?.user ?? interaction.user;
        var stat = interaction.options.get("stat").value as string as keyof typeof Stats;
        var value = interaction.options.get("value").value as number;

        var gg = GamesHandler.Get(interaction.guildId);
        var game = gg.games[gg.currentGameIndex];
        if(game == null) {
            var err = new Error("This server has no ongoing game.");
            err.name = "NullException"
            throw err;
        }

        if(interaction.user.id != user.id && interaction.user.id != game.gamemasterID) {
            var err = new Error("User cannot edit someone else's stats. (Only the GameMaster can)");
            err.name = "ForbiddenException"
            throw err;
        }

        var playerHandle = PlayerCreationHandler.GetPlayerHandle(interaction.guildId, user.id);
        if(playerHandle == null && interaction.user.id != game.gamemasterID) {
            var err = new Error("Character creation step is past, or user doesn't have permission to edit stats (only GM can edit stats after creation step).");
            err.name = "ForbiddenException";
            throw err;
        } else if(playerHandle == null && interaction.user.id == game.gamemasterID) {
            var player = game.GetPlayer(user.id);
            if(player == null) {
                var err = new Error("Player not found");
                err.name = "NullException";
                throw err;
            }

            player.stats.set(Stats[stat], value);
            var embed = new EmbedBuilder()
                .setTitle(`${player.name} stats updated!`)
                .setDescription(`To update another stat, use command **</set-stat:${interaction.commandId}>**.\n\n## Current stats:`)
                .setColor("Blurple");
            player.stats.forEach(s => embed.addFields({ name: Stats[s], value: `${s}`, inline: true }));
            
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else if(playerHandle != null && (interaction.user.id == playerHandle.key.id || interaction.user.id == game.gamemasterID)) {
            playerHandle.key.stats.set(Stats[stat], value);
            
            playerHandle.val.embeds[0].fields.find(f => f.name == stat).value = `${value}`;
            
            playerHandle.val.edit({ embeds: playerHandle.val.embeds });
            interaction.reply({ content: `Stats updated! Check the character sheet to see the updated stats. (${playerHandle.val.url})`, ephemeral: true });
        }
    }
} 

function statsToOptions() {
    var options: { name: string, value: string }[] = [];
    var stats = Object.keys(Stats).filter(k => isNaN(Number(k)));
    stats.forEach(s => options.push({ name: s, value: s }))
    return options;
}
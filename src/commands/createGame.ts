import { ActionRowBuilder, APIButtonComponent, ApplicationCommandOptionType, ApplicationIntegrationType, AttachmentFlagsBitField, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType, EmbedBuilder, InteractionContextType, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../types/botModule";
import { Game } from "../models/game";
import { hash } from "crypto";
import { GamesHandler } from "../handlers/gameHandler";

export const createGameCommand: BotCommand = {
    name: "create-game",
    description: "Creates a new game of RPG.",
    category: "game",
    data: new SlashCommandBuilder()
        .setContexts([InteractionContextType.Guild])
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setName("create-game")
        .setDescription("Creates a new game of RPG.")
        .addStringOption(o =>
            o.setName("game-name")
            .setDescription("The name of the game.")
            .setRequired(true)
        )
        .addAttachmentOption(o =>
            o.setName("icon")
            .setDescription("The icon of the game.")
            .setRequired(false)
        ).toJSON(),
    permissions: 0n,
    aliases: [],
    async Execute(client, interaction) {
        var gamename: string = interaction.options.get("game-name").value as string;
        console.log("Creating game.");
        var nameHash: string = hash("sha1", gamename);
        var game: Game = GamesHandler.CreateGame(interaction.guildId, interaction.user.id, gamename, nameHash);

        var icon = interaction.options.get("icon")?.attachment;
        if(icon != null && icon != undefined && icon.contentType.startsWith("image")) {
            game.iconURL = icon.url;
        } else {
            game.iconURL = interaction.guild.iconURL();
        }

        var embed = new EmbedBuilder()
            .setTitle("New Game Created!")
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(game.iconURL)
            .setColor("Green")
            .setDescription(`A new game have been created. You, ${interaction.user}, are the game master of this RPG. You have now a bunch of commands to set up your RPG!`)
            .setFields(
                {
                    name: "Game Name",
                    value: game.name,
                    inline: true
                },
                {
                    name: "Game ID",
                    value: game.identifier,
                    inline: true
                },
                {
                    name: "Game Master",
                    value: `<@${game.gamemasterID}>`,
                }
            )
            .setFooter({ text: `${gamename} on ${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
            .setTimestamp(Date.now());
        
        var saveButton = new ButtonBuilder()
            .setLabel("Save ?")
            .setEmoji("💾")
            .setCustomId("create-game_save-button")
            .setStyle(ButtonStyle.Success);
        var cancelButton = new ButtonBuilder()
            .setLabel("Cancel")
            .setEmoji("❌")
            .setCustomId("create-game_cancel-button")
            .setStyle(ButtonStyle.Danger);

        var buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(saveButton, cancelButton);

        var r = await interaction.editReply({ embeds: [embed], components: [buttonsRow] })

        var collector = r.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, filter: i => i.user.id == game.gamemasterID })

        collector.on('collect', async buttonInteraction => {
            switch(buttonInteraction.id) {
                case "create-game_save-button":

                break;
                case "create-game_cancel-button":
                    
                break;
            }
        })
    }
}
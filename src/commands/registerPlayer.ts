import { ActionRowBuilder, APIActionRowComponent, APIApplicationCommandOptionChoice, APIModalActionRowComponent, ApplicationIntegrationType, ButtonBuilder, ButtonComponent, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, Interaction, InteractionContextType, Message, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { GamesHandler } from "../handlers/gameHandler";
import { Player } from "../models/player";
import { Race } from "../models/races";
import { Speciality } from "../models/speciality";
import { BotCommand } from "../types/botModule";
import { ErrorEmbed } from "../utils/embedUtils";
import { Stats } from "../models/stats";
import { Game } from "../models/game";
import { PlayerCreationHandler } from "../handlers/playerCreationHandler";

export const registerPlayerCommand: BotCommand = {
    name: "register-player",
    category: "game",
    description: "Allows to register a player to a game.",
    permissions: 0n,
    aliases: [],
    data: new SlashCommandBuilder()
        .setName("register-player")
        .setDescription("Allows to register a player to a game.")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption(o => 
            o.setName("gameid")
            .setDescription("ID of the game to add the player to.")
            .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("rp-name")
            .setDescription("RP name of the player.")
            .setMaxLength(64)
            .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("origins")
            .setDescription("RP origins of the player (a city, a country, etc... matching the RP context)")
            .setRequired(true)
        )
        .addIntegerOption(o => 
            o.setName("race")
            .setDescription("Race of the character")
            .addChoices(racesToChoices())
            .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("class")
            .setDescription("Class of the character")
            .addChoices(specialitiesToChoices())
            .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("age")
            .setDescription("Age of the character")
            .setRequired(true)
        )
        .addAttachmentOption(o =>
            o.setName("avatar")
            .setDescription("Avatar of the character")
            .setRequired(false)
        )
        .addUserOption(o =>
            o.setName("user")
            .setDescription("User to add to the game")
            .setRequired(false)
        )
        .toJSON(),
    async Execute(client, interaction) {
        await interaction.deferReply();

        var guildGames = GamesHandler.guilds.find(g => g.serverID == interaction.guildId);
        var game = guildGames.GetByID(interaction.options.get("gameid").value as string);
        if(game === null) {
            interaction.editReply({ embeds: [ErrorEmbed(new Error("Game not found."), interaction as Interaction)] });
            return;
        }

        var user = interaction.options.get("user")?.user ?? interaction.user;
        if(user !== interaction.user && interaction.user.id !== game.gamemasterID) {
            interaction.editReply({ embeds: [ErrorEmbed(new Error("You can only add yourself to a game. Only the game master can register other users."), interaction as Interaction)] });
            return;
        }

        var player = new Player(interaction.user);
        player.age = interaction.options.get("age").value as number;
        player.name = interaction.options.get("rp-name").value as string;
        player.class = interaction.options.get("class").value as number;
        player.race = interaction.options.get("race").value as number;
        player.origins = interaction.options.get("origins").value as string;

        var avatarAttachment = interaction.options.get("avatar")?.attachment;
        if((avatarAttachment != null || avatarAttachment != undefined) && avatarAttachment.contentType.startsWith("image")) {
            player.avatarURL = avatarAttachment.url;
        } else {
            player.avatarURL = user.displayAvatarURL();
        }

        var embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.displayName} • ${player.name} (${player.age} years)`, iconURL: user.displayAvatarURL({ size:16, extension:"webp" }) })
            .setTitle(`Creating character sheet...`)
            .setThumbnail(player.avatarURL)
            .setDescription(`Born in **${player.origins}**\n> Race: **${Race[player.race]}**\n> Class: **${Speciality[player.class]}**\n\n## Stats`)
            .setFooter({ text: game.name, iconURL: game.iconURL })
            .setTimestamp(Date.now());

        var statsStrings = Object.keys(Stats).filter(k => isNaN(parseInt(k)));
        statsStrings.forEach(s => embed.addFields({ name: s, value: `${player.stats.get(Stats[s as keyof typeof Stats]) ?? 0}`, inline: true }))

        var confirmButton = new ButtonBuilder()
            .setLabel("Confirm")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success)
            .setCustomId("register-player_confirm-button");
        var cancelButton = new ButtonBuilder()
            .setLabel("Cancel")
            .setEmoji("❎")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("register-player_cancel-button");
        var setStatsButton = new ButtonBuilder()
            .setLabel("Set stats")
            .setEmoji("📊")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("register-player_set-stats-button");
            
        var buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirmButton, cancelButton, setStatsButton)


        var msg = await interaction.editReply({ embeds: [embed], components: [buttonsRow] })

        var handle = PlayerCreationHandler.HandlePlayerCreation(interaction.guildId, player, msg);

        var collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600_000, filter: i => i.user.id == user.id });

        collector.on('collect', async buttonInteraction => {

            switch(buttonInteraction.customId) {
                case "register-player_confirm-button":
                    // Disable buttons on collect
                    buttonsRow.components.forEach(c => c.setDisabled(true))

                    game.AddPlayer(PlayerCreationHandler.GetPlayerHandle(interaction.guildId, user.id).key)
                    guildGames.Save();

                    var message = await interaction.channel.messages.fetch(handle.val.id);
                    var embed = EmbedBuilder.from(message.embeds[0]);
                    embed.setTitle("Character created.").setColor("Green");
                    buttonInteraction.update({ embeds: [embed], components: [buttonsRow] })
                break;
                case "register-player_cancel-button":
                    // Disable buttons on collect
                    buttonsRow.components.forEach(c => c.setDisabled(true))

                    PlayerCreationHandler.UnhandlePlayer(interaction.guildId, user.id);

                    var message = await interaction.channel.messages.fetch(handle.val.id);
                    var embed = EmbedBuilder.from(message.embeds[0]);
                    embed.setTitle("Character creation aborted.").setColor("DarkGrey");
                    buttonInteraction.update({ embeds: [embed], components: [buttonsRow] })
                break;
                case "register-player_set-stats-button":
                    buttonInteraction.reply({ content: "To edit the stats of the character, use the command </set-stat:1299183170117435463>", ephemeral: true });
                break;
            }
        });
    }
}

function racesToChoices() {
    var choices: APIApplicationCommandOptionChoice<number>[] = [];
    var races = Object.keys(Race).filter(key => !isNaN(Number(key)))
    for(var race in races) {
        choices.push({ name: Race[race], value: parseInt(race) });
    };
    return choices
}

function specialitiesToChoices() {
    var choices: APIApplicationCommandOptionChoice<number>[] = [];
    var specialities = Object.keys(Speciality).filter(key => !isNaN(Number(key)))
    for(var speciality in specialities) {
        choices.push({ name: Speciality[speciality], value: parseInt(speciality) });
    };
    return choices
}
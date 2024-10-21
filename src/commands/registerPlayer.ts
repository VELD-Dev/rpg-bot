import { APIApplicationCommandOptionChoice, ApplicationIntegrationType, EmbedBuilder, Interaction, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { GamesHandler } from "handlers/gameHandler";
import { Player } from "models/player";
import { Race } from "models/races";
import { Speciality } from "models/speciality";
import { BotCommand } from "types/botModule";
import { ErrorEmbed } from "utils/embedUtils";

export const registerPlayerCommand: BotCommand = {
    name: "register-player",
    category: "game",
    description: "Allows to register a player to a game.",
    permissions: 0n,
    aliases: [],
    data: new SlashCommandBuilder()
        .setName("register-player")
        .setDescription("Allows to register a player to a game.")
        .setContexts([InteractionContextType.Guild])
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption(o => 
            o.setName("gameid")
            .setDescription("ID of the game to add the player to.")
            .setRequired(true)
        )
        .addUserOption(o =>
            o.setName("user")
            .setDescription("User to add to the game")
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
            .addChoices(function() {var choices: APIApplicationCommandOptionChoice<number>[] = []; for(var race in Race) {choices.push({ name: race, value: parseInt(Race[race]) })}; return choices}())
            .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("class")
            .setDescription("Class of the character")
            .addChoices(function() {var choices: APIApplicationCommandOptionChoice<number>[] = []; for(var speciality in Speciality) {choices.push({ name: speciality, value: parseInt(Speciality[speciality]) })}; return choices}())
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
        .toJSON(),
    async Execute(client, interaction) {
        var guildGames = GamesHandler.guilds.find(g => g.serverID == interaction.guildId);
        var game = guildGames.GetByID(interaction.options.get("gameid").value as string);
        if(game === null) {
            interaction.editReply({ embeds: [ErrorEmbed(new Error("Game not found."), interaction as Interaction)] });
            return;
        }

        var user = interaction.options.get("user").user ?? interaction.user;
        if(user !== interaction.user && interaction.user.id !== game.gamemasterID) {
            interaction.editReply({ embeds: [ErrorEmbed(new Error("You can only add yourself to a game. Only the game master can register other users."), interaction as Interaction)] });
            return;
        }

        var playerObj = new Player(interaction.user);
        playerObj.age = interaction.options.get("age").value as number;
        playerObj.name = interaction.options.get("rp-name").value as string;
        playerObj.class = interaction.options.get("class").value as number;
        playerObj.race = interaction.options.get("race").value as number;
        playerObj.origins = interaction.options.get("origins").value as string;

        game.AddPlayer(playerObj);

        var embed = new EmbedBuilder()
            .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL({ size:16, extension:"webp" }) })
            .setTitle(`${playerObj.name} (${playerObj.age} years)`)
            .setDescription(`Born in ${playerObj.origins}\n> Race: ${Race[playerObj.race]}\n> Class: ${Speciality[playerObj.class]}\n\n## Stats`)
            .setFooter({ text: game.name, iconURL: game.iconURL })
            .setTimestamp(Date.now());
        interaction.editReply({ embeds: [embed] })
    }
}
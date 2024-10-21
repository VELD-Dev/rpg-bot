import { Embed, EmbedBuilder, Interaction } from "discord.js";

export function ErrorEmbed(error: Error, interaction: Interaction): EmbedBuilder {
    return new EmbedBuilder()
        .setThumbnail("https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_warning-caution-exclamation-alert-attention-error-02-512.png")
        .setColor("Red")
        .setTitle("An error occurred!")
        .setDescription(error.message + "\n\nStack:```" + (error.stack ?? "Empty") + "```")
        .setTimestamp(Date.now())
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
}
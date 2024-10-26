import { CommandInteraction, Events, Interaction } from "discord.js";
import { BotModule } from "../types/botModule";
import { Bot } from "../main";
import { ErrorEmbed } from "../utils/embedUtils";

export const interactionModule: BotModule = {
    name: Events.InteractionCreate,
    description: "",
    category: "core",
    async Execute(client, i) {
        console.log("Interaction received.")

        if(i instanceof(CommandInteraction)) {
            try {
                await Bot.commands.find(c => c.name === i.commandName)?.Execute(client, i as CommandInteraction);
            } catch(e) {
                console.log(e);
                if(i.deferred || i.replied) await i.editReply({ embeds: [ErrorEmbed(new Error(e as string), i as Interaction)] });
                else await i.reply({ embeds: [ErrorEmbed(new Error(e as string), i as Interaction)] });
            }
        }
    }
}
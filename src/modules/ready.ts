import { ActivityType } from "discord.js";
import { BotModule } from "../types/botModule";

export const readyModule: BotModule = {
    name: "ready",
    description: "",
    category: "core",
    async Execute(client) {
        console.log("RPG Bot is connected.");

        client.user?.setStatus("online");
        client.user?.setActivity({
            name: "Wandering through wonderful worlds...",
            type: ActivityType.Custom,
            state: ""
        })
    }
}
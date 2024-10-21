import { Client, Collection, Events, IntentsBitField, REST, Routes } from "discord.js"
import { BotCommand, BotModule } from "./types/botModule"
import { cwd } from "process"
import { readyModule } from "./modules/ready"
import { existsSync, mkdirSync } from "fs"
import path from "path"
import { interactionModule } from "./modules/interaction"
import { createGameCommand } from "./commands/createGame"
import { configDotenv } from "dotenv"
import { GamesHandler } from "./handlers/gameHandler"

export const mdir = path.join(cwd(), "build")

if(!existsSync(path.join(mdir, "games"))) {
    mkdirSync(path.join(mdir, "games"))
}

configDotenv({ path: path.join(mdir, ".env") })

export class App {
    client: Client<boolean>
    commands: Collection<string, BotCommand>
    modules: Collection<string, BotModule>

    public constructor(token: string) {
        this.client = new Client({intents: [
            /* DM Intents */
            IntentsBitField.Flags.DirectMessages,
            IntentsBitField.Flags.DirectMessageReactions,
            IntentsBitField.Flags.DirectMessageTyping,
            /* Guild Intents */
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildEmojisAndStickers,
            IntentsBitField.Flags.GuildIntegrations,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.GuildMessageTyping,
            IntentsBitField.Flags.GuildMessagePolls,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildWebhooks,
            /* Misc */
            IntentsBitField.Flags.MessageContent,
        ]})

        this.commands = new Collection<string, BotCommand>();
        this.commands.set(createGameCommand.name, createGameCommand);

        this.modules = new Collection<Events, BotModule>();
        this.modules.set(Events.ClientReady, readyModule);
        this.modules.set(Events.InteractionCreate, interactionModule)

        this.modules.forEach((module, name) => {
            this.client.once(name, module.Execute.bind(null, this.client))
        });

        this.client.login(token).then(async () => {
            const rest = new REST({version: "10"}).setToken(token);
            var sc = this.commands.map(c => c.data);
            try {
                console.log("Refreshing slash commands...");
                await rest.put(
                    Routes.applicationCommands(this.client.user?.id ?? ""),
                    { body: sc }
                );
                console.log("Successfully reloaded slash commands.");
            } catch (e) {
                console.log(e);
            }
        });
    }
}

console.log(mdir)
export var Bot = new App(process.env.TOKEN ?? "")
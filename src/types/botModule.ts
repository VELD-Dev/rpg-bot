import { AnySelectMenuInteraction, APIButtonComponent, APIModalComponent, APISelectMenuComponent, ButtonBuilder, ButtonInteraction, Client, CommandInteraction,  ModalBuilder,  ModalSubmitInteraction,  PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

export interface BotModule {
    name: string;
    description: string;
    category: string;
    Execute(client: Client, interaction?: any): Promise<void> | void;
}

export interface BotCommand extends BotModule {
    data: RESTPostAPIApplicationCommandsJSONBody;
    permissions: bigint;
    aliases: Array<string>;
    Execute(client: Client, interaction?: CommandInteraction): Promise<void> | void;
}

export interface BotButton extends BotModule {
    data: APIButtonComponent;
    Execute(client: Client, interaction?: ButtonInteraction): Promise<void> | void;
}

export interface BotModal extends BotModule {
    data: ModalBuilder;
    Execute(client: Client, interaction?: ModalSubmitInteraction): Promise<void> | void;
}

export interface BotSelectMenu extends BotModule {
    data: APISelectMenuComponent;
    Execute(client: Client, interaction?: AnySelectMenuInteraction): Promise<void> | void;
}
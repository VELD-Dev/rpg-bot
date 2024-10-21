import { Collection } from "discord.js";
import { Game } from "../models/game";
import { GuildGames } from "../handlers/guildGames";

export class GamesHandler {
    public static guilds: Array<GuildGames> = [];

    public static AddGame(guildID: string, game: Game): void {
        if(this.guilds.find(guild => guild.serverID === guildID) !== undefined) {
            this.guilds.find(g => g.serverID)?.games.push(game)
            return;
        }
        var gg = new GuildGames(guildID);
        gg.games.push(game);
        this.guilds.push(gg);
    }

    public static CreateGame(serverID: string, gameMasterID: string, gameName: string, gameIdentifier: string): Game {
        var game = new Game(gameMasterID, gameName, gameIdentifier);
        if(this.guilds.find(g => g.serverID == serverID)) {
            this.guilds.find(g => g.serverID == serverID)?.games.push(game)
            return game;
        }
        var gg = new GuildGames(serverID);
        gg.games.push(game);
        this.guilds.push(gg);
        return game;
    }

    public Save(guildID?: string): void {
        if(guildID != undefined || guildID != null) {
            
        }
    }
}
import { Collection } from "discord.js";
import { Game } from "../models/game";
import { GuildGames } from "../handlers/guildGames";
import { readdirSync, readFileSync } from "fs";
import { mdir } from "../main";
import path from "path";

export class GamesHandler {
    public static guilds: Array<GuildGames> = [];

    public static LoadGames() {
        var files = readdirSync(path.join(mdir, "games"))
        files.forEach(file => {
            var json = readFileSync(path.join(mdir, "games", path.basename(file)), "utf8");
            var gg: GuildGames = JSON.parse(json) as GuildGames;
            this.guilds.push(gg);
        })
    }

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

    public static Save(guildID?: string): void {
        if(guildID != undefined || guildID != null) {
            
        }
    }
}
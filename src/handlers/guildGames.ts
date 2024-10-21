import path from "path";
import { Game } from "../models/game";
import { mdir } from "../main";
import { hash } from "crypto";
import { readdirSync, readFileSync, writeFileSync } from "fs";

export class GuildGames {
    serverID: string;
    games: Game[] = [];
    currentGameIndex: number = -1; // -1 for none
    filename: string;

    public constructor(gid: string) {
        this.serverID = gid;
        this.filename = path.join(mdir, "games", `games-${this.serverID}.json`);
    }

    public static LoadGames(gid: string): GuildGames {
        var files = readdirSync(path.join(mdir, "games"));
        for(var i = 0; i < files.length; i++) {
            var file = files[i];
            var filename = path.basename(file, "json");
            if(filename.split("-")[1] == gid) {
                var json: string = readFileSync(file, "utf8");
                var gg = JSON.parse(json);
                return gg;
            }
        }
    }

    public GetByID(identifier: string): Game {
        return this.games.find(g => g.identifier === identifier);
    }
    
    public GetByName(name: string): Game {
        return this.games.find(g => g.name === name);
    }

    public CreateGame(gamemasterID: string, gameName: string) {
        var namehash = hash("sha1", gameName);
        var game = new Game(gamemasterID, gameName, namehash);
        this.games.push(game);
        return game;
    }

    public Save() {
        writeFileSync(this.filename, JSON.stringify(this));
    }
}
import { Fight } from "./fights";
import { Player } from "./player";

export class Game {
    gamemasterID: string;
    identifier: string;
    name: string;
    iconURL?: string;
    description: string;
    players: Player[];
    currentFightIndex?: Fight;
    fightsHistory: Fight[] = [];
    diceFacesAmount: number = 19;  // 19 means it can go from 1 to 20, etc...

    public constructor(gamemasterId: string, name: string, identifier: string) {
        this.gamemasterID = gamemasterId;
        this.identifier = identifier;
        this.name = name;
        this.players = [];
    }

    public AddPlayer(player: Player) {
        if(this.players.find(p => p.id === player.id) == undefined) {
            this.players.push(player);
        }
    }

    public GetPlayer(id: string): Player {
        return this.players.find(p => p.id === id);
    }
}
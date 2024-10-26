import { Collection, CommandInteraction, Message } from "discord.js";
import { Player } from "../models/player";
import { KVP } from "../types/kvp";

export class PlayerCreationHandler {
    static playersInCreation: Collection<string, Collection<Player, Message>> = new Collection<string, Collection<Player, Message>>();
    public static HandlePlayerCreation(guildID: string, player: Player, message: Message): KVP<Player, Message> {
        if(this.playersInCreation.has(guildID)) {
            if(this.playersInCreation.get(guildID).has(player)) return new KVP(player, this.playersInCreation.get(guildID).get(player));

            this.playersInCreation.get(guildID).set(player, message);
            return new KVP(player, message);
        } else {
            var playersCollection = new Collection<Player, Message>();
            playersCollection.set(player, message);
            this.playersInCreation.set(guildID, playersCollection);
            return new KVP(player, message);
        }
    }

    public static GetGuild(guildID: string): Collection<Player, Message> {
        return this.playersInCreation.get(guildID);
    }

    public static GetPlayerHandle(guildID: string, userID: string): KVP<Player, Message> {
        if(this.GetGuild(guildID) == null) return null;
        var key = this.GetGuild(guildID).findKey((_, k) => k.id == userID);
        var msg = this.GetGuild(guildID).find((_, k) => k.id == userID);
        if(key == null) return null;
        return new KVP(key, msg);
    }

    public static UnhandlePlayer(guildID: string, userID: string): Player {
        if(this.GetGuild(guildID) == null) return null;

        var player = this.GetGuild(guildID).findKey((_, k) => k.id == userID);
        this.GetGuild(guildID).delete(player);
        return player;
    }
}
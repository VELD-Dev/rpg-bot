import "node:util/types"
import { Effect } from "./effect";
import { Passive } from "./passives";
import { User } from "discord.js";
import { KVP } from "../types/kvp";
import { Race } from "./races";
import { Speciality } from "./speciality";
import { Stats } from "./stats";

export class Player {
    id: string;
    name: string;
    avatarURL: string;
    age: number;
    origins: string;
    race: Race;
    class: Speciality;
    stats: Map<Stats, number>;
    effects: Array<Effect>;
    passives: Array<Passive>;
    level: number;
    xp: number;
    nextLvlXp: number;

    public constructor(user: User) {
        this.id = user.id;
        this.avatarURL = user.displayAvatarURL();
        this.stats = new Map<Stats, number>();
        this.effects = [];
        this.passives = [];
        this.level = 1;
        this.xp = 0;
        this.nextLvlXp = 100;
    }

    public DefineStats(...args: KVP<Stats, number>[]) {
        args.forEach(arg => {
            this.stats.set(arg.key, arg.val);
        });
    }

    public AddEffect(effect: Effect) {
        this.effects.push(effect);
    }

    public AddPassive(passive: Passive) {
        this.passives.push(passive);
    }
}

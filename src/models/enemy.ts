import { Speciality } from "./speciality";
import { Race } from "./races";
import { Stats } from "./stats";
import { Collection } from "discord.js";

export class Enemy {
    id: number;
    name: string;
    description: string;
    race: Race;
    class: Speciality;
    stats: Collection<Stats, number>;
    level: number;
    levelModifier: Collection<Stats, number>;
    
}
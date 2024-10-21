import { Enemy } from "./enemy";
import { Player } from "./player";

export type Fight = {
    id: number;
    name: string;
    description: string;
    currentRound: number;
    finalRound: number; // Will be defined once the fight ends
    engagedPlayers: Array<Player>;
    engagedEnemies: Array<Enemy>;
}
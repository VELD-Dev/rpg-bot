export type Passive = {
    type: Malus | Bonus;
    value: number;  // [IF DICE] average threshold | [IF ITEM] linked item ID | []
    criticalMin: number;  // [IF DICE] critical failure threshold
    criticalMax: number;  // [IF DICE] critical success threshold
}

export enum Malus {
    Absenteism, // Prevents entity from playing one round depending on dice result
    Betrayal, // Casts an offensive spell or an attack on an ally, or casts a buff/healing spell on an enemy depending on dice result
    LactoreIntolerant, // While resting, won't heal if the dice result is exactly equal to x.
    Baller, // -1 Dexterity
    Addict, // Every 2 fights, entity must consume the defined consumable
}

export enum Bonus {
    Immune, // Prevents stun, bleeding and blind
    Tank, // Reduce income damages by 25%
    Wealthy, // 10 more golds at the end of each fight
    Hyperactive, // Plays one more round depending on dice result
    Sage, // +1 Wiseness
    Religious, // More influence with the Church
}
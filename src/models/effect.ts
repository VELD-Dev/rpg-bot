export type Effect = {
    name: string;
    description: string;
    durationLeft: number;
    type: EffectType;
}

export enum EffectType {
    Heal,
    Damage, // Provokes x damages
    Stun, // Prevents from playing x amount of rounds
    Blind, // Prevents from aiming a specific entity
    Bleeding, // Provokes x damages for y rounds
    Buff, // Buffs a statistic
    Blessing, // Gives a specific effect to a specific attack of the entity
}

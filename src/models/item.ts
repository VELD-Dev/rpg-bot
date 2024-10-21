export type Item = {
    id: number;
    name: number;
    description: string;
    rarity: Rarity;
    buyValue: number;
    sellValue: number;
}

export enum Rarity {
    Common,
    Rare,
    Legendary,
    Unique
}
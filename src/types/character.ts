export type CharacterSheet = {
  look: {
    Eyes: string;
    Hair: string;
    Clothes: string;
  };
  name: string;
  race: string;
  level: number;
  maxHp: number;
  stats: {
    Wisdom: number;
    Charisma: number;
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
  };
  alignment: string;
  className: string;
  damage_die: string;
};

export const ABILITY_TYPE = {
  NO_ABILITY: 0,
  HERO: 1,
  MEDIC: 2,
  MORALE_BOOST: 4,
  MASTER: 8,
  SPY: 16,
  TIGHT_BOND: 32,
};

export const EFFECT_TYPE = {
  NO_EFFECT: 0,
  SCORCH: 1,
  DECOY: 2,
  COMMANDERS_HORN: 4,
  SUMMON_AVENGER: 8,
  MARDROEME: 16,
  BERSERKER: 32,
};

export const FACTION_TYPE = {
  NEUTRAL: 0,
  MONSTERS: 1,
  NILFGAARDIAN_EMPIRE: 2,
  NORTHERN_REALMS: 4,
  SCOIATAEL: 8,
  SKELLIGE: 16,
};

export const ROW_TYPE = {
  MELEE: 1,
  RANGE: 2,
  SIEGE: 4,
  WEATHER: 8,
  LEADER: 16,
};

export type CardAttributes = {
  strength: number;
  strengthBoosted: number;
  abilities: number;
  effects: number;
  rows: number;
  faction: number;
};

export type TIP4_2JSON = {
  type: string;
  name: string;
  description: string;
  preview: { source: string; mimetype: string };
  files: { source: string; mimetype: string }[];
  attributes?: CardAttributes;
  external_url: string;
};

export const EXTERNAL_URL = 'https://fairyfromalfeya.com';

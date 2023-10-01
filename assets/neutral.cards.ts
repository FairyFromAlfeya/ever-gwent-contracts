import {
  ABILITY_TYPE,
  EFFECT_TYPE,
  EXTERNAL_URL,
  ROW_TYPE,
  FACTION_TYPE,
  TIP4_2JSON,
} from './models';

const CIRI_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmPT9ptJ7m2nc6bxBi8mZesT9pQDscLZS2pDdhyj4zWMCX';
const DANDELION_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmVBs21RfR91V4Hc4nwq5its41QFAHvdvfW1vLvDsQaToQ';
const GERALT_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmYcY2kJYbjhVrj2KqKmPd9WPHbcJHvqi8zYfPcDmUnTAN';
const OLGIERD_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmbbuiAvGJTvGf8YrEpikdJXMp15DYeuKPPquFWfStMZzh';
const TRISS_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmQjTPeY29fHeNy5fLcBKwXPjELxZ5QD4j57KemtembPVi';
const VESEMIR_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmNk7FWFEk8a6uyeZWe1KrksTxvyfueu3HgSKBTQvLowYG';
const YENNEFER_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmPFXoweaWtGVcwXYQfvHJMJkBMA4BtyKhVAdTyta3VMia';
const ZOLTAN_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmTZXpFhmXaZT4AFsJJRjt5DtHFkKkjXD3kCmziruY294a';

export const NeutralCards: Record<string, TIP4_2JSON> = {
  ciri: {
    type: 'Basic NFT',
    name: 'Cirilla Fiona Elen Riannon',
    description: '',
    preview: {
      source: CIRI_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: CIRI_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 15,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.HERO,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  dandelion: {
    type: 'Basic NFT',
    name: 'Dandelion',
    description: '',
    preview: {
      source: DANDELION_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: DANDELION_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 2,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.NO_ABILITY,
      effects: EFFECT_TYPE.COMMANDERS_HORN,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  geralt: {
    type: 'Basic NFT',
    name: 'Geralt of Rivia',
    description: '',
    preview: {
      source: GERALT_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: GERALT_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 15,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.HERO,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  olgierd: {
    type: 'Basic NFT',
    name: 'Olgierd von Everec',
    description: '',
    preview: {
      source: OLGIERD_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: OLGIERD_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 6,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.MORALE_BOOST,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE + ROW_TYPE.RANGE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  triss: {
    type: 'Basic NFT',
    name: 'Triss Merigold',
    description: '',
    preview: {
      source: TRISS_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: TRISS_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 7,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.HERO,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  vesemir: {
    type: 'Basic NFT',
    name: 'Vesemir',
    description: '',
    preview: {
      source: VESEMIR_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: VESEMIR_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 6,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.NO_ABILITY,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  yennefer: {
    type: 'Basic NFT',
    name: 'Yennefer of Vengerberg',
    description: '',
    preview: {
      source: YENNEFER_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: YENNEFER_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 7,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.HERO + ABILITY_TYPE.MEDIC,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.RANGE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
  zoltan: {
    type: 'Basic NFT',
    name: 'Zoltan Chivay',
    description: '',
    preview: {
      source: ZOLTAN_LOGO,
      mimetype: 'image/png',
    },
    files: [
      {
        source: ZOLTAN_LOGO,
        mimetype: 'image/png',
      },
    ],
    attributes: {
      strength: 5,
      strengthBoosted: 0,
      abilities: ABILITY_TYPE.NO_ABILITY,
      effects: EFFECT_TYPE.NO_EFFECT,
      rows: ROW_TYPE.MELEE,
      faction: FACTION_TYPE.NEUTRAL,
    },
    external_url: EXTERNAL_URL,
  },
};

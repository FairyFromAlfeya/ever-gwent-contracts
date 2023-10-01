import { EXTERNAL_URL, TIP4_2JSON } from './models';

const COLLECTION_LOGO =
  'https://gateway.pinata.cloud/ipfs/QmbKHVDyUyrktYRv3z4e7XEdbWF8QLei1zbVR6KRFbdac9';

export const Collection: TIP4_2JSON = {
  type: 'Basic NFT Collection',
  name: 'Gwent',
  description:
    'Invented by dwarves and perfected over centuries of tavern table play, Gwent is a game of initial simplicity and ultimate depth, something beloved by both road-weary travellers during long nights around the campfire and elegant nobles looking to liven up dragging dinner parties.',
  preview: {
    source: COLLECTION_LOGO,
    mimetype: 'image/jpeg',
  },
  files: [
    {
      source: COLLECTION_LOGO,
      mimetype: 'image/jpeg',
    },
  ],
  external_url: EXTERNAL_URL,
};

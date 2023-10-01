import { Address, toNano } from 'locklift';
import prompts from 'prompts';

import { GwentCollectionAbi } from '../build/factorySource';
import { NeutralCards } from '../assets/neutral.cards';

const main = async (cardId: string, recipient: string): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');
  const gwent =
    locklift.deployments.getContract<GwentCollectionAbi>('GwentCollection');
  const card = NeutralCards[cardId];

  if (card) {
    const { traceTree } = await locklift.tracing.trace(
      gwent.methods
        .mintCard({
          _recipient: new Address(recipient),
          _cardJson: JSON.stringify(NeutralCards[cardId]),
          _cardParams: card.attributes!,
          _remainingGasTo: owner.account.address,
        })
        .send({ from: owner.account.address, amount: toNano(3) }),
    );

    const event = traceTree?.findEventsForContract({
      contract: gwent,
      name: 'NftCreated' as const,
    })[0];

    if (event) {
      console.log(`NFT minted: ${event.nft} (${event.id})`);
    }
  }
};

prompts([
  {
    type: 'autocomplete',
    name: 'cardId',
    message: 'Card id',
    choices: Object.keys(NeutralCards).map((key) => ({ title: key })),
  },
  { type: 'text', name: 'recipient', message: 'Recipient address' },
])
  .then((response) => main(response.cardId, response.recipient))
  .catch((e) => console.trace(e))
  .finally(() => process.exit());

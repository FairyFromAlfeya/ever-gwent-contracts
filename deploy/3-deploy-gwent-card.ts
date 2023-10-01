import { toNano } from 'locklift';

import { GwentCollectionAbi } from '../build/factorySource';
import { NeutralCards } from '../assets/neutral.cards';

export default async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet').account.address;
  const user = locklift.deployments.getAccount('UserWallet').account.address;

  const collection =
    locklift.deployments.getContract<GwentCollectionAbi>('GwentCollection');

  const { traceTree } = await locklift.tracing.trace(
    collection.methods
      .mintCard({
        _recipient: user,
        _cardJson: JSON.stringify(NeutralCards.ciri),
        _cardParams: NeutralCards.ciri.attributes!,
        _remainingGasTo: owner,
      })
      .send({ from: owner, amount: toNano(3) }),
  );

  if (traceTree) {
    const event = traceTree.findEventsForContract({
      contract: collection,
      name: 'NftCreated' as const,
    })[0];

    await locklift.deployments.saveContract({
      deploymentName: 'GwentCard',
      address: event.nft,
      contractName: 'GwentCard',
    });

    console.log(
      `Contract GwentCard deployed, address: ${event.nft}, deploymentName: GwentCard`,
    );
  }
};

export const tag = 'gwent-card';

export const dependencies = ['gwent-collection'];

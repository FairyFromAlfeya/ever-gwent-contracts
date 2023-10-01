import { toNano } from 'locklift';

import { GwentCollectionAbi } from '../build/factorySource';

const main = async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');
  const gwent = locklift.deployments.getContract<GwentCollectionAbi>('Gwent');

  const GwentCardCode = locklift.factory.getContractArtifacts('GwentCard').code;

  await locklift.transactions.waitFinalized(
    gwent.methods
      .setCardCode({
        _newCardCode: GwentCardCode,
        _remainingGasTo: owner.account.address,
      })
      .send({ from: owner.account.address, amount: toNano(0.5) }),
  );
};

main()
  .catch((e) => console.trace(e))
  .finally(() => process.exit());

import { toNano, getRandomNonce } from 'locklift';

import { Collection } from '../assets/collection';

export default async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');

  const IndexCode = locklift.factory.getContractArtifacts('Index').code;
  const IndexBasisCode =
    locklift.factory.getContractArtifacts('IndexBasis').code;
  const GwentCardCode = locklift.factory.getContractArtifacts('GwentCard').code;
  const GwentPlatformCode =
    locklift.factory.getContractArtifacts('GwentPlatform').code;

  await locklift.deployments.deploy({
    deployConfig: {
      contract: 'GwentCollection',
      publicKey: owner.signer.publicKey,
      initParams: { nonce: getRandomNonce() },
      constructorParams: {
        _initialCardCode: GwentCardCode,
        _initialPlatformCode: GwentPlatformCode,
        _initialOwner: owner.account.address,
        _initialJson: JSON.stringify(Collection),
        _initialIndexCode: IndexCode,
        _initialIndexBasisCode: IndexBasisCode,
        _remainingGasTo: owner.account.address,
      },
      value: toNano(2),
    },
    deploymentName: 'GwentCollection',
    enableLogs: true,
  });
};

export const tag = 'gwent-collection';

export const dependencies = ['owner-wallet'];

import { toNano, getRandomNonce } from 'locklift';

export default async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');

  await locklift.deployments.deploy({
    deployConfig: {
      contract: 'Gwent',
      publicKey: owner.signer.publicKey,
      initParams: { nonce: getRandomNonce() },
      constructorParams: {
        _initialOwner: owner.account.address,
        _remainingGasTo: owner.account.address,
      },
      value: toNano(2),
    },
    deploymentName: 'Gwent',
    enableLogs: true,
  });
};

export const tag = 'gwent';

export const dependencies = ['owner-wallet'];

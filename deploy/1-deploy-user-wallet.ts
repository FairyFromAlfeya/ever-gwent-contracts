import { WalletTypes, toNano } from 'locklift';

export default async (): Promise<void> => {
  await locklift.deployments.deployAccounts(
    [
      {
        deploymentName: 'UserWallet',
        signerId: '1',
        accountSettings: {
          type: WalletTypes.WalletV3,
          value: toNano(5),
        },
      },
    ],
    true,
  );
};

export const tag = 'user-wallet';

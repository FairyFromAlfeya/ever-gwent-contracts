import '@broxus/locklift-deploy';
import '@broxus/locklift-verifier';

import { lockliftChai, LockliftConfig } from 'locklift';
import { Deployments } from '@broxus/locklift-deploy';
import { BigNumber } from 'bignumber.js';
import * as dotenv from 'dotenv';
import * as chai from 'chai';

import { FactorySource } from './build/factorySource';

dotenv.config();
chai.use(lockliftChai);
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

declare global {
  const locklift: import('locklift').Locklift<FactorySource>;
}

declare module 'locklift' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  export interface Locklift {
    deployments: Deployments<FactorySource>;
  }
}

const config: LockliftConfig = {
  compiler: {
    version: '0.62.0',
    externalContractsArtifacts: {
      'node_modules/@broxus/tip4/build': ['Index', 'IndexBasis'],
    },
  },
  linker: { version: '0.15.48' },
  verifier: {
    verifierVersion: 'latest',
    apiKey: process.env.EVERSCAN_API_KEY!,
    secretKey: process.env.EVERSCAN_SECRET_KEY!,
  },
  networks: {
    local: {
      connection: {
        id: 1,
        group: 'local',
        type: 'graphql',
        data: {
          endpoints: [process.env.LOCAL_NETWORK_ENDPOINT!],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      giver: {
        address: process.env.LOCAL_GIVER_ADDRESS!,
        key: process.env.LOCAL_GIVER_KEY!,
      },
      keys: {
        phrase: process.env.LOCAL_PHRASE,
        amount: 20,
      },
    },
    locklift: {
      connection: {
        id: 2,
        group: 'local',
        type: 'proxy',
        data: {} as never,
      },
      giver: {
        address: process.env.LOCAL_GIVER_ADDRESS!,
        key: process.env.LOCAL_GIVER_KEY!,
      },
      keys: {
        phrase: process.env.LOCAL_PHRASE,
        amount: 20,
      },
    },
    mainnet: {
      connection: {
        id: 3,
        group: 'main',
        type: 'graphql',
        data: {
          endpoints: [process.env.MAINNET_NETWORK_ENDPOINT!],
        },
      },
      giver: {
        address: process.env.MAINNET_GIVER_ADDRESS!,
        key: process.env.MAINNET_GIVER_KEY!,
      },
      keys: {
        phrase: process.env.MAINNET_PHRASE,
        amount: 20,
      },
    },
  },
  mocha: { timeout: 200000, bail: true },
};

export default config;

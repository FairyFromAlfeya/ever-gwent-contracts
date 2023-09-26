import '@broxus/locklift-deploy';

import { lockliftChai, LockliftConfig } from 'locklift';
import { Deployments } from '@broxus/locklift-deploy';
import * as dotenv from 'dotenv';
import * as chai from 'chai';

import { FactorySource } from './build/factorySource';

dotenv.config();
chai.use(lockliftChai);

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
  compiler: { version: '0.71.0' },
  linker: { version: '0.20.6' },
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
  },
  mocha: { timeout: 200000, bail: true },
};

export default config;

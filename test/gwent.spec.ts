import { Contract, Address, toNano } from 'locklift';
import { expect } from 'chai';

import { GwentAbi } from '../build/factorySource';

describe('Gwent', () => {
  let owner: Address;
  let gwent: Contract<GwentAbi>;

  before('deploy contracts', async () => {
    await locklift.deployments.fixture();

    owner = locklift.deployments.getAccount('OwnerWallet').account.address;
    gwent = locklift.deployments.getContract<GwentAbi>('Gwent');
  });

  describe('basic tests', () => {
    it('should return valid owner', async () => {
      const gwentOwner = await gwent.methods
        .getOwner({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(gwentOwner.toString()).to.be.equal(owner.toString());
    });

    it('should return 1 ever target balance', async () => {
      const targetBalance = await gwent.methods
        .getTargetBalance({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(targetBalance).to.be.equal(toNano(1));
    });
  });
});

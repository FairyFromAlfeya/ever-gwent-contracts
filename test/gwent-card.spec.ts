import { Contract, Address, toNano } from 'locklift';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';

import { GwentCollectionAbi, GwentCardAbi } from '../build/factorySource';
import { NeutralCards } from '../assets/neutral.cards';

describe('Gwent Card', () => {
  let user: Address;
  let owner: Address;

  let collection: Contract<GwentCollectionAbi>;
  let card: Contract<GwentCardAbi>;

  before('deploy contracts', async () => {
    await locklift.deployments.fixture();

    user = locklift.deployments.getAccount('UserWallet').account.address;
    owner = locklift.deployments.getAccount('OwnerWallet').account.address;

    card = locklift.deployments.getContract('GwentCard');
    collection = locklift.deployments.getContract('GwentCollection');
  });

  describe('setCardCode()', () => {
    it('should set card code with version 2', async () => {
      const NewCardCode =
        locklift.factory.getContractArtifacts('GwentCard').code;

      await locklift.transactions.waitFinalized(
        collection.methods
          .setCardCode({ _newCardCode: NewCardCode, _remainingGasTo: owner })
          .send({ from: owner, amount: toNano(0.5) }),
      );

      const codeVersion = await collection.methods
        .nftCodeVersion({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(+codeVersion).to.be.equal(2);
    });
  });

  describe('changeOwner()', () => {
    it('should revert change by collection owner', async () => {
      const { traceTree } = await locklift.tracing.trace(
        card.methods
          .changeOwner({ newOwner: owner, callbacks: [], sendGasTo: owner })
          .send({ from: owner, amount: toNano(0.5) }),
        { allowedCodes: { compute: [1001] } },
      );

      return expect(traceTree).to.have.error(1001);
    });
  });

  describe('changeManager()', () => {
    it('should revert change by collection owner', async () => {
      const { traceTree } = await locklift.tracing.trace(
        card.methods
          .changeManager({ newManager: owner, callbacks: [], sendGasTo: owner })
          .send({ from: owner, amount: toNano(0.5) }),
        { allowedCodes: { compute: [1001] } },
      );

      return expect(traceTree).to.have.error(1001);
    });
  });

  describe('transfer()', () => {
    it('should revert transfer by collection owner', async () => {
      const { traceTree } = await locklift.tracing.trace(
        card.methods
          .transfer({ to: owner, callbacks: [], sendGasTo: owner })
          .send({ from: owner, amount: toNano(0.5) }),
        { allowedCodes: { compute: [1001] } },
      );

      return expect(traceTree)
        .to.have.error(1001)
        .and.not.to.emit('OwnerChanged');
    });

    it('should transfer card to collection owner by user', async () => {
      await locklift.transactions.waitFinalized(
        card.methods
          .transfer({ to: owner, callbacks: [], sendGasTo: user })
          .send({ from: user, amount: toNano(1) }),
      );

      const info = await card.methods.getInfo({ answerId: 0 }).call();

      expect(info.owner.toString()).to.be.equal(owner.toString());
      return expect(info.manager.toString()).to.be.equal(owner.toString());
    });

    it('should return changed Index contract', async () => {
      const info = await card.methods
        .resolveIndex({
          answerId: 0,
          collection: collection.address,
          owner: owner,
        })
        .call()
        .then((r) =>
          locklift.factory
            .getDeployedContract('Index', r.index)
            .methods.getInfo({ answerId: 0 })
            .call(),
        );

      return expect(info.owner.toString()).to.be.equal(owner.toString());
    });

    it('should transfer back card to user', async () => {
      await locklift.transactions.waitFinalized(
        card.methods
          .transfer({ to: user, callbacks: [], sendGasTo: owner })
          .send({ from: owner, amount: toNano(1) }),
      );

      const info = await card.methods.getInfo({ answerId: 0 }).call();

      expect(info.owner.toString()).to.be.equal(user.toString());
      return expect(info.manager.toString()).to.be.equal(user.toString());
    });
  });

  describe('upgrade()', () => {
    it('should upgrade card contract', async () => {
      await locklift.transactions.waitFinalized(
        card.methods
          .requestUpgrade({ _remainingGasTo: user })
          .send({ from: user, amount: toNano(2) }),
      );

      const version = await card.methods
        .getVersion({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(+version).to.be.equal(2);
    });
  });

  describe('check card data after update', async () => {
    const cardState = await card.getFullState().then((r) => r.state);

    it('should return valid info', async () => {
      const info = await card.methods
        .getInfo({ answerId: 0 })
        .call({ cachedState: cardState });

      expect(info.owner.toString()).to.be.equal(user.toString());
      expect(info.manager.toString()).to.be.equal(user.toString());
      expect(info.collection.toString()).to.be.equal(
        collection.address.toString(),
      );
      return expect(+info.id).to.be.equal(0);
    });

    it('should return valid JSON', async () => {
      const json = await card.methods
        .getJson({ answerId: 0 })
        .call({ cachedState: cardState })
        .then((r) => r.json);

      return expect(json).to.be.equal(JSON.stringify(NeutralCards.ciri));
    });

    it('should return valid index code', async () => {
      const IndexArtifacts = locklift.factory.getContractArtifacts('Index');

      const code = await card.methods
        .indexCode({ answerId: 0 })
        .call({ cachedState: cardState })
        .then((r) => r.code);
      const codeHash = await card.methods
        .indexCodeHash({ answerId: 0 })
        .call({ cachedState: cardState })
        .then((r) => r.hash);

      expect(code).to.be.equal(IndexArtifacts.code);
      return expect(codeHash).to.be.equal(
        new BigNumber(`0x${IndexArtifacts.codeHash}`).toString(),
      );
    });

    it('should return valid Index contract', async () => {
      const info = await card.methods
        .resolveIndex({
          answerId: 0,
          collection: collection.address,
          owner: user,
        })
        .call({ cachedState: cardState })
        .then((r) =>
          locklift.factory
            .getDeployedContract('Index', r.index)
            .methods.getInfo({ answerId: 0 })
            .call(),
        );

      expect(info.owner.toString()).to.be.equal(user.toString());
      expect(info.collection.toString()).to.be.equal(
        collection.address.toString(),
      );
      return expect(info.nft.toString()).to.be.equal(card.address.toString());
    });

    it('should return valid upgrader', async () => {
      const upgrader = await card.methods
        .getUpgrader({ answerId: 0 })
        .call({ cachedState: cardState })
        .then((r) => r.value0);

      return expect(upgrader.toString()).to.be.equal(
        collection.address.toString(),
      );
    });

    it('should return valid characteristics', async () => {
      const params = await card.methods
        .getRawParams({ answerId: 0 })
        .call({ cachedState: cardState })
        .then((r) => r.value0);

      return expect({
        strength: +params.strength,
        strengthBoosted: +params.strengthBoosted,
        abilities: +params.abilities,
        effects: +params.effects,
        rows: +params.rows,
        faction: +params.faction,
      }).to.be.deep.equal(NeutralCards.ciri.attributes);
    });
  });
});

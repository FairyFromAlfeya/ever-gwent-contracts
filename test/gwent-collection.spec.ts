import { Contract, Address, toNano } from 'locklift';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';

import { GwentCollectionAbi, GwentCardAbi } from '../build/factorySource';
import { NeutralCards } from '../assets/neutral.cards';
import { Collection } from '../assets/collection';

describe('Gwent Collection', () => {
  let owner: Address;
  let user: Address;

  let collection: Contract<GwentCollectionAbi>;
  let card: Contract<GwentCardAbi>;

  before('deploy contracts', async () => {
    await locklift.deployments.fixture();

    owner = locklift.deployments.getAccount('OwnerWallet').account.address;
    user = locklift.deployments.getAccount('UserWallet').account.address;

    collection =
      locklift.deployments.getContract<GwentCollectionAbi>('GwentCollection');
  });

  describe('basic tests', () => {
    it('should return contract balance 1 ever', async () => {
      const balance = await locklift.provider.getBalance(collection.address);

      return expect(balance).to.be.equal(toNano(1));
    });

    it('should return valid owner', async () => {
      const gwentOwner = await collection.methods
        .getOwner({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(gwentOwner.toString()).to.be.equal(owner.toString());
    });

    it('should return 1 ever target balance', async () => {
      const targetBalance = await collection.methods
        .getTargetBalance({ answerId: 0 })
        .call()
        .then((r) => r.value0);

      return expect(targetBalance).to.be.equal(toNano(1));
    });

    it('should transfer ownership to user', async () => {
      const { traceTree } = await locklift.tracing.trace(
        collection.methods
          .setOwner({ _newOwner: user, _remainingGasTo: owner })
          .send({ from: owner, amount: toNano(0.5) }),
      );

      return expect(traceTree)
        .to.call('setOwner')
        .count(1)
        .and.to.emit('OwnerChanged')
        .count(1)
        .withNamedArgs({ current: user, previous: owner });
    });

    it('should transfer ownership back to owner', async () => {
      const { traceTree } = await locklift.tracing.trace(
        collection.methods
          .setOwner({ _newOwner: owner, _remainingGasTo: user })
          .send({ from: user, amount: toNano(0.5) }),
      );

      return expect(traceTree)
        .to.call('setOwner')
        .count(1)
        .and.to.emit('OwnerChanged')
        .count(1)
        .withNamedArgs({ current: owner, previous: user });
    });
  });

  describe('mintCard()', () => {
    it('should mint gwent card for user', async () => {
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

      card = await collection.methods
        .nftAddress({ id: 1, answerId: 0 })
        .call()
        .then((r) =>
          locklift.factory.getDeployedContract('GwentCard', r.value0),
        );

      const isCardDeployed = await card
        .getFullState()
        .then((s) => s.state?.isDeployed);

      expect(isCardDeployed).to.be.true;
      return expect(traceTree)
        .to.call('mintCard')
        .count(1)
        .and.to.emit('NftCreated')
        .count(1)
        .withNamedArgs({
          id: '1',
          nft: card.address,
          owner: user,
          manager: user,
          creator: owner,
        });
    });
  });

  describe('upgrade()', () => {
    it('should upgrade collection to version 2', async () => {
      const NewCollectionCode =
        locklift.factory.getContractArtifacts('GwentCollection').code;

      const { traceTree } = await locklift.tracing.trace(
        collection.methods
          .upgrade({
            _code: NewCollectionCode,
            _version: 2,
            _remainingGasTo: owner,
          })
          .send({ from: owner, amount: toNano(2) }),
      );

      const event = traceTree!.findEventsForContract({
        contract: collection,
        name: 'VersionChanged' as const,
      })[0];

      return expect(event).to.be.deep.equal({ current: '2', previous: '1' });
    });
  });

  describe('check collection data after upgrade', async () => {
    const collectionState = await collection
      .getFullState()
      .then((r) => r.state);

    it('should return valid JSON', async () => {
      const json = await collection.methods
        .getJson({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.json);

      return expect(json).to.be.equal(JSON.stringify(Collection));
    });

    it('should return valid total supply', async () => {
      const totalSupply = await collection.methods
        .totalSupply({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.count);

      return expect(+totalSupply).to.be.equal(2);
    });

    it('should return card code with salt', async () => {
      const CardArtifacts = locklift.factory.getContractArtifacts('GwentCard');

      const code = await collection.methods
        .nftCode({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.code);
      const codeHash = await collection.methods
        .nftCodeHash({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.codeHash);

      const saltedCode = await locklift.provider.setCodeSalt({
        code: CardArtifacts.code,
        salt: {
          structure: [{ name: 'collection', type: 'address' }] as const,
          data: { collection: collection.address },
        },
      });

      expect(code).to.be.equal(saltedCode.code);
      return expect(codeHash).to.be.equal(
        new BigNumber(`0x${saltedCode.hash}`).toString(),
      );
    });

    it('should return index basis code with salt', async () => {
      const IndexBasisArtifacts =
        locklift.factory.getContractArtifacts('IndexBasis');

      const code = await collection.methods
        .indexBasisCode({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.code);
      const hash = await collection.methods
        .indexBasisCodeHash({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.hash);

      const saltedCode = await locklift.provider.setCodeSalt({
        code: IndexBasisArtifacts.code,
        salt: {
          structure: [{ name: 'stamp', type: 'string' }] as const,
          data: { stamp: 'nft' },
        },
      });

      expect(code).to.be.equal(saltedCode.code);
      return expect(hash).to.be.equal(
        new BigNumber(`0x${saltedCode.hash}`).toString(),
      );
    });

    it('should return index code', async () => {
      const IndexArtifacts = locklift.factory.getContractArtifacts('Index');

      const code = await collection.methods
        .indexCode({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.code);
      const hash = await collection.methods
        .indexCodeHash({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.hash);

      expect(code).to.be.equal(IndexArtifacts.code);
      return expect(hash).to.be.equal(
        new BigNumber(`0x${IndexArtifacts.codeHash}`).toString(),
      );
    });

    it('should return platform code with salt', async () => {
      const PlatformArtifacts =
        locklift.factory.getContractArtifacts('GwentPlatform');

      const code = await collection.methods
        .platformCode({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.value0);
      const hash = await collection.methods
        .platformCodeHash({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.value0);

      const saltedCode = await locklift.provider.setCodeSalt({
        code: PlatformArtifacts.code,
        salt: {
          structure: [{ name: 'collection', type: 'address' }] as const,
          data: { collection: collection.address },
        },
      });

      expect(code).to.be.equal(saltedCode.code);
      return expect(hash).to.be.equal(
        new BigNumber(`0x${saltedCode.hash}`).toString(),
      );
    });

    it('should return card code version 1', async () => {
      const version = await collection.methods
        .nftCodeVersion({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) => r.value0);

      return expect(+version).to.be.equal(1);
    });

    it('should return valid IndexBasis contract', async () => {
      const info = await collection.methods
        .resolveIndexBasis({ answerId: 0 })
        .call({ cachedState: collectionState })
        .then((r) =>
          locklift.factory
            .getDeployedContract('IndexBasis', r.indexBasis)
            .methods.getInfo({ answerId: 0 })
            .call(),
        );

      return expect(info.collection.toString()).to.be.equal(
        collection.address.toString(),
      );
    });

    it('should resolve card address', async () => {
      const cardAddress = await collection.methods
        .nftAddress({ answerId: 0, id: 1 })
        .call({ cachedState: collectionState })
        .then((r) => r.value0);

      return expect(cardAddress.toString()).to.be.equal(
        card.address.toString(),
      );
    });
  });
});

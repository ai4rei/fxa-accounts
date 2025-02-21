/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

'use strict';

const { assert } = require('chai');
const AccessToken = require('../../lib/oauth/db/accessToken');
const RefreshTokenMetadata = require('../../lib/oauth/db/refreshTokenMetadata');
const config = require('../../config').getProperties();
const mocks = require('../mocks');

const recordLimit = 20;
const prefix = 'test:';
const maxttl = 1337;
const redis = require('../../lib/redis')(
  {
    ...config.redis.accessTokens,
    ...config.redis.sessionTokens,
    prefix,
    recordLimit,
    maxttl,
  },
  mocks.mockLog()
);

const downRedis = require('../../lib/redis')(
  { enabled: true, port: 1, timeoutMs: 10, lazyConnect: true },
  mocks.mockLog()
);
downRedis.redis.on('error', () => {});

const uid = 'uid1';
const sessionToken = {
  lastAccessTime: 1573067619720,
  location: {
    city: 'a',
    state: 'b',
    stateCode: 'c',
    country: 'd',
    countryCode: 'e',
  },
  uaBrowser: 'Firefox',
  uaBrowserVersion: '70.0',
  uaDeviceType: 'f',
  uaOS: 'Mac OS X',
  uaOSVersion: '10.14',
  id: 'token1',
};

describe('Redis', () => {
  after(async () => {
    await redis.del(uid);
    await redis.close();
  });

  describe('touchSessionToken', () => {
    beforeEach(async () => {
      await redis.del(uid);
    });

    it('creates an entry for uid when none exists', async () => {
      const x = await redis.get(uid);
      assert.isNull(x);
      await redis.touchSessionToken(uid, sessionToken);
      const rawData = await redis.get(uid);
      assert.ok(rawData);
    });

    it('appends a new token to an existing uid record', async () => {
      await redis.touchSessionToken(uid, sessionToken);
      await redis.touchSessionToken(uid, { ...sessionToken, id: 'token2' });
      const tokens = await redis.getSessionTokens(uid);
      assert.deepEqual(Object.keys(tokens), [sessionToken.id, 'token2']);
    });

    it('updates existing tokens with new data', async () => {
      await redis.touchSessionToken(uid, { ...sessionToken, uaOS: 'Windows' });
      const tokens = await redis.getSessionTokens(uid);
      assert.equal(tokens[sessionToken.id].uaOS, 'Windows');
    });

    it('trims trailing null fields from the stored value', async () => {
      await redis.touchSessionToken(uid, {
        id: 'token1',
        lastAccessTime: 1,
        location: null,
        uaBrowser: 'x',
        uaFormFactor: null,
      });
      const rawData = await redis.get(uid);
      assert.equal(rawData, `{"token1":[1,null,"x"]}`);
    });

    it('only updates changed values', async () => {
      await redis.touchSessionToken(uid, {
        id: 'token1',
        lastAccessTime: 1,
        uaBrowser: 'x',
      });
      let rawData = await redis.get(uid);
      assert.equal(rawData, `{"token1":[1,null,"x"]}`);

      await redis.touchSessionToken(uid, {
        id: 'token1',
        lastAccessTime: 2,
      });
      rawData = await redis.get(uid);
      assert.equal(rawData, `{"token1":[2,null,"x"]}`);
    });
  });

  describe('getSessionTokens', () => {
    beforeEach(async () => {
      await redis.del(uid);
      await redis.touchSessionToken(uid, sessionToken);
    });

    it('returns an empty object for unknown uids', async () => {
      const tokens = await redis.getSessionTokens('x');
      assert.isEmpty(tokens);
    });

    it('returns tokens indexed by id', async () => {
      const tokens = await redis.getSessionTokens(uid);
      assert.deepEqual(Object.keys(tokens), [sessionToken.id]);
      // token 'id' not included
      const s = { ...sessionToken };
      delete s.id;
      assert.deepEqual(tokens[sessionToken.id], s);
    });

    it('returns empty for malformed entries', async () => {
      await redis.set(uid, 'YOLO!');
      const tokens = await redis.getSessionTokens(uid);
      assert.isEmpty(tokens);
    });

    it('deletes malformed entries', async () => {
      await redis.set(uid, 'YOLO!');
      await redis.getSessionTokens(uid);
      const nothing = await redis.get(uid);
      assert.isNull(nothing);
    });

    it('handles old (json) format entries', async () => {
      const oldFormat = {
        lastAccessTime: 42,
        uaBrowser: 'Firefox',
        uaBrowserVersion: '59',
        uaOS: 'Mac OS X',
        uaOSVersion: '10.11',
        uaDeviceType: null,
        uaFormFactor: null,
        location: {
          city: 'Bournemouth',
          state: 'England',
          stateCode: 'EN',
          country: 'United Kingdom',
          countryCode: 'GB',
        },
      };
      await redis.set(uid, JSON.stringify({ [uid]: oldFormat }));
      const tokens = await redis.getSessionTokens(uid);
      assert.deepEqual(tokens[uid], oldFormat);
    });
  });

  describe('pruneSessionTokens', () => {
    beforeEach(async () => {
      await redis.del(uid);
      await redis.touchSessionToken(uid, sessionToken);
      await redis.touchSessionToken(uid, { ...sessionToken, id: 'token2' });
    });

    it('does nothing for unknown uids', async () => {
      await redis.pruneSessionTokens('x');
      const tokens = await redis.getSessionTokens('x');
      assert.isEmpty(tokens);
    });

    it('does nothing for unkown token ids', async () => {
      await redis.pruneSessionTokens(uid, ['x', 'y']);
      const tokens = await redis.getSessionTokens(uid);
      assert.deepEqual(Object.keys(tokens), [sessionToken.id, 'token2']);
    });

    it('deletes a given token id', async () => {
      await redis.pruneSessionTokens(uid, ['token2']);
      const tokens = await redis.getSessionTokens(uid);
      assert.deepEqual(Object.keys(tokens), [sessionToken.id]);
    });

    it('deleted the uid record when no tokens remain', async () => {
      await redis.pruneSessionTokens(uid, [sessionToken.id, 'token2']);
      const rawData = await redis.get(uid);
      assert.isNull(rawData);
    });
  });

  describe('Access Tokens', () => {
    const timestamp = new Date('2020-02-19T22:20:58.271Z').getTime();
    let accessToken1;
    let accessToken2;

    beforeEach(async () => {
      await redis.redis.flushall();
      accessToken2 = AccessToken.parse(
        JSON.stringify({
          clientId: '5678',
          name: 'client2',
          canGrant: false,
          publicClient: false,
          userId: '1234',
          email: 'hello@world.local',
          scope: 'profile',
          token: 'eeee',
          createdAt: timestamp - 1000,
          profileChangedAt: timestamp,
          expiresAt: Date.now() + 1000,
        })
      );
      accessToken1 = AccessToken.parse(
        JSON.stringify({
          clientId: 'abcd',
          name: 'client1',
          canGrant: false,
          publicClient: false,
          userId: '1234',
          email: 'hello@world.local',
          scope: 'profile',
          token: 'ffff',
          createdAt: timestamp - 1000,
          profileChangedAt: timestamp,
          expiresAt: Date.now() + 1000,
        })
      );
    });

    describe('setAccessToken', () => {
      it('creates an index set for the user', async () => {
        await redis.setAccessToken(accessToken1);
        const index = await redis.redis.smembers(
          accessToken1.userId.toString('hex')
        );
        assert.deepEqual(index, [
          prefix + accessToken1.tokenId.toString('hex'),
        ]);
      });

      it('appends to the index', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        const index = await redis.redis.smembers(
          accessToken2.userId.toString('hex')
        );
        assert.deepEqual(
          index.sort(),
          [
            prefix + accessToken1.tokenId.toString('hex'),
            prefix + accessToken2.tokenId.toString('hex'),
          ].sort()
        );
      });

      it('sets the expiry on the token', async () => {
        await redis.setAccessToken(accessToken1);
        const ttl = await redis.redis.pttl(
          accessToken1.tokenId.toString('hex')
        );
        assert.isAtLeast(ttl, 1);
        assert.isAtMost(ttl, 1000);
      });

      it('prunes the index by half of the limit when over', async () => {
        const tokenIds = new Array(recordLimit + 1)
          .fill(1)
          .map((_, i) => `token-${i}`);
        await redis.redis.sadd(
          accessToken1.userId.toString('hex'),
          ...tokenIds
        );
        await redis.setAccessToken(accessToken1);
        const count = await redis.redis.scard(
          accessToken1.userId.toString('hex')
        );
        assert.equal(count, recordLimit / 2 + 2);
        const token = await redis.getAccessToken(accessToken1.tokenId);
        assert.deepEqual(token, accessToken1);
      });

      it('prunes expired tokens when count % 5 == 0', async () => {
        // 1 real + 4 "expired"
        await redis.setAccessToken(accessToken1);
        const expiredIds = new Array(4).fill(1).map((_, i) => `token-${i}`);
        await redis.redis.sadd(
          accessToken1.userId.toString('hex'),
          ...expiredIds
        );
        await redis.setAccessToken(accessToken2);
        const count = await redis.redis.scard(
          accessToken1.userId.toString('hex')
        );
        assert.equal(count, 2);
        const token = await redis.getAccessToken(accessToken1.tokenId);
        assert.deepEqual(token, accessToken1);
        const token2 = await redis.getAccessToken(accessToken2.tokenId);
        assert.deepEqual(token2, accessToken2);
      });

      it('sets expiry on the index', async () => {
        await redis.setAccessToken(accessToken1);
        const ttl = await redis.redis.pttl(accessToken1.userId.toString('hex'));
        assert.isAtMost(ttl, maxttl);
        assert.isAtLeast(ttl, maxttl - 10);
      });
    });

    describe('getAccessToken', () => {
      it('returns an AccessToken', async () => {
        await redis.setAccessToken(accessToken1);
        const token = await redis.getAccessToken(accessToken1.tokenId);
        assert.instanceOf(token, AccessToken);
        assert.deepEqual(token, accessToken1);
      });

      it('returns null when not found', async () => {
        const token = await redis.getAccessToken(accessToken1.tokenId);
        assert.equal(token, null);
      });
    });

    describe('getAccessTokens', () => {
      it('returns an array of AccessTokens', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        const tokens = await redis.getAccessTokens(accessToken2.userId);
        assert.equal(tokens.length, 2);
        for (const token of tokens) {
          assert.instanceOf(token, AccessToken);
        }
      });

      it('returns an empty array when not found', async () => {
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.isEmpty(tokens);
      });

      it('prunes missing tokens from the index', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        await redis.redis.del(accessToken1.tokenId.toString('hex'));
        const tokens = await redis.getAccessTokens(accessToken2.userId);
        assert.deepEqual(tokens, [accessToken2]);
        const index = await redis.redis.smembers(
          accessToken2.userId.toString('hex')
        );
        assert.deepEqual(index, [
          prefix + accessToken2.tokenId.toString('hex'),
        ]);
      });
    });

    describe('removeAccessToken', () => {
      it('deletes the token', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.removeAccessToken(accessToken1.tokenId);
        const rawValue = await redis.get(accessToken1.tokenId.toString('hex'));
        assert.equal(rawValue, null);
      });

      it('returns true when the token was deleted', async () => {
        await redis.setAccessToken(accessToken1);
        const done = await redis.removeAccessToken(accessToken1.tokenId);
        assert.equal(done, true);
      });

      it('returns false for nonexistent tokens', async () => {
        const done = await redis.removeAccessToken(accessToken1.tokenId);
        assert.equal(done, false);
      });
    });

    describe('removeAccessTokensForPublicClients', () => {
      it('does not remove non-public or non-grant tokens', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.removeAccessTokensForPublicClients(accessToken1.userId);
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.deepEqual(tokens, [accessToken1]);
      });

      it('removes public tokens', async () => {
        accessToken1.publicClient = true;
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        await redis.removeAccessTokensForPublicClients(accessToken1.userId);
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.deepEqual(tokens, [accessToken2]);
      });

      it('removes grant tokens', async () => {
        accessToken1.canGrant = true;
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        await redis.removeAccessTokensForPublicClients(accessToken1.userId);
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.deepEqual(tokens, [accessToken2]);
      });

      it('does nothing for nonexistent tokens', async () => {
        await redis.removeAccessTokensForPublicClients(accessToken1.userId);
      });
    });

    describe('removeAccessTokensForUser', () => {
      it('removes all tokens for the user', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        await redis.removeAccessTokensForUser(accessToken1.userId);
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.isEmpty(tokens);
      });

      it('does nothing for nonexistent users', async () => {
        await redis.removeAccessTokensForUser(accessToken1.userId);
      });
    });

    describe('removeAccessTokensForUserAndClient', () => {
      it('removes all tokens for the user', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.setAccessToken(accessToken2);
        await redis.removeAccessTokensForUserAndClient(
          accessToken1.userId,
          accessToken1.clientId
        );
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.deepEqual(tokens, [accessToken2]);
      });

      it('does nothing for nonexistent users', async () => {
        await redis.removeAccessTokensForUserAndClient(
          accessToken1.userId,
          accessToken1.clientId
        );
      });

      it('does nothing for nonexistent clients', async () => {
        await redis.setAccessToken(accessToken1);
        await redis.removeAccessTokensForUserAndClient(
          accessToken2.userId,
          accessToken2.clientId
        );
        const tokens = await redis.getAccessTokens(accessToken1.userId);
        assert.deepEqual(tokens, [accessToken1]);
      });
    });
  });

  describe('Refresh Token Metadata', () => {
    const uid = '1234';
    const tokenId1 = '1111';
    const tokenId2 = '2222';
    const tokenId3 = '3333';
    let metadata;
    let oldMeta;

    beforeEach(async () => {
      await redis.redis.flushall();
      oldMeta = new RefreshTokenMetadata(
        new Date(Date.now() - (maxttl + 1000))
      );
      metadata = new RefreshTokenMetadata(new Date());
    });

    describe('setRefreshToken', () => {
      it('sets expiry', async () => {
        await redis.setRefreshToken(uid, tokenId1, metadata);
        const ttl = await redis.redis.pttl(uid);
        assert.isAtMost(ttl, maxttl);
        assert.isAtLeast(ttl, maxttl - 1000);
      });

      it('prunes old tokens', async () => {
        await redis.setRefreshToken(uid, tokenId1, oldMeta);
        await redis.setRefreshToken(uid, tokenId2, oldMeta);

        await redis.setRefreshToken(uid, tokenId3, metadata);

        const tokens = await redis.getRefreshTokens(uid);
        assert.deepEqual(tokens, {
          [tokenId3]: metadata,
        });
      });

      it(`maxes out at ${recordLimit} recent tokens`, async () => {
        const tokenIds = new Array(recordLimit)
          .fill(1)
          .map((_, i) => `token-${i}`);
        for (const tokenId of tokenIds) {
          await redis.setRefreshToken(uid, tokenId, metadata);
        }
        const len = await redis.redis.hlen(uid);
        assert.equal(len, recordLimit);
        await redis.setRefreshToken(uid, tokenId1, metadata);
        const tokens = await redis.getRefreshTokens(uid);
        assert.deepEqual(tokens, {
          [tokenId1]: metadata,
        });
      });
    });
  });
});

describe('Redis down', () => {
  before(async () => {
    try {
      await downRedis.redis.connect();
    } catch (e) {
      // this is expected
    }
  });

  after(() => {
    downRedis.redis.disconnect();
  });

  describe('touchSessionToken', () => {
    it('returns without error', async () => {
      try {
        await downRedis.touchSessionToken(uid, {});
      } catch (err) {
        assert.fail();
      }
    });
  });

  describe('getSessionTokens', () => {
    it('returns an empty object without error', async () => {
      const tokens = await downRedis.getSessionTokens(uid);
      assert.isEmpty(tokens);
    });
  });

  describe('pruneSessionTokens', () => {
    it('throws a timeout error', async () => {
      try {
        await downRedis.pruneSessionTokens(uid);
      } catch (e) {
        assert.typeOf(e, 'Error');
        assert.equal(e.message, 'redis timeout');
        return;
      }
      assert.fail();
    });
  });
});

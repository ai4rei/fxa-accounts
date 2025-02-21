# Change history

## 1.229.2

### Other changes

- all: Change default sentry trace sample rate to 0 ([34cc815199](https://github.com/mozilla/fxa/commit/34cc815199))

## 1.229.1

No changes.

## 1.229.0

### New features

- coupons: resub confirmation discount amount (#12237) ([028ad3dfe](https://github.com/mozilla/fxa/commit/028ad3dfe))
- auth: Add third party auth metrics (#12221) ([f4d13cf32](https://github.com/mozilla/fxa/commit/f4d13cf32))
- coupon: update info box for coupon type (#12187) ([2a4054cde](https://github.com/mozilla/fxa/commit/2a4054cde))

### Bug fixes

- email: Use uppercase provider name in email (#12286) ([c8f5998b0](https://github.com/mozilla/fxa/commit/c8f5998b0))

### Other changes

- all: d584a10bc maintenance(all) - Prepare for new sentry ([d584a10bc](https://github.com/mozilla/fxa/commit/d584a10bc))
- auth: Remove confusing / unneded config from OauthRedis constructor ([fdbe83fd8](https://github.com/mozilla/fxa/commit/fdbe83fd8))

## 1.228.4

No changes.

## 1.228.3

No changes.

## 1.228.2

### Other changes

- 12ea05171 Cherry pick squash for experimental dot releases v1.226.5 to v1.226.9 on train-226. These changes address issues with connection pool spiking and high latency on the attached clients route. ([12ea05171](https://github.com/mozilla/fxa/commit/12ea05171))

## 1.228.1

### Bug fixes

- subscriptions: create customer for iap sub (#12164) ([7c54513ac](https://github.com/mozilla/fxa/commit/7c54513ac))

## 1.228.0

### New features

- apple: Add Sign-in with Apple support (#12148) ([fa817cb37](https://github.com/mozilla/fxa/commit/fa817cb37))
- subscriptions: add config for cancel survey (#12114) ([49598b251](https://github.com/mozilla/fxa/commit/49598b251))

### Other changes

- deps: bump @sentry/browser from 6.17.9 to 6.18.2 (#12139) ([4359d2bd8](https://github.com/mozilla/fxa/commit/4359d2bd8))
- deps: bump @nestjs/config from 1.1.6 to 1.2.0 (#12132) ([5383d1bda](https://github.com/mozilla/fxa/commit/5383d1bda))
- deps-dev: bump chai from 4.3.4 to 4.3.6 (#12091) ([df319de11](https://github.com/mozilla/fxa/commit/df319de11))
- deps-dev: bump tsconfig-paths from 3.12.0 to 3.13.0 (#12119) ([749e554a6](https://github.com/mozilla/fxa/commit/749e554a6))
- deps: bump aws-sdk from 2.1082.0 to 2.1089.0 (#12117) ([014363918](https://github.com/mozilla/fxa/commit/014363918))

## 1.227.1

No changes.

## 1.227.0

### New features

- coupon: support coupon on sub manage page (#11890) ([3c23dde9f](https://github.com/mozilla/fxa/commit/3c23dde9f))

### Other changes

- #12061: 85c20f658 Train 226.3 (#12061) ([85c20f658](https://github.com/mozilla/fxa/commit/85c20f658))
- deps: bump aws-sdk from 2.1068.0 to 2.1081.0 (#12026) ([7b305a3cd](https://github.com/mozilla/fxa/commit/7b305a3cd))
- deps: bump @sentry/browser from 6.17.2 to 6.17.9 (#11994) ([f32ae3f1a](https://github.com/mozilla/fxa/commit/f32ae3f1a))
- deps: bump @nestjs/core from 8.2.6 to 8.3.1 (#11989) ([11ad2b6ee](https://github.com/mozilla/fxa/commit/11ad2b6ee))
- deps: bump stripe from 8.202.0 to 8.203.0 (#11988) ([5df09116f](https://github.com/mozilla/fxa/commit/5df09116f))
- deps: bump @nestjs/common from 8.3.0 to 8.3.1 (#11975) ([bbd474450](https://github.com/mozilla/fxa/commit/bbd474450))
- deps-dev: bump jest from 27.4.7 to 27.5.1 (#11974) ([8ba05a381](https://github.com/mozilla/fxa/commit/8ba05a381))
- deps: bump @nestjs/common from 8.2.4 to 8.3.0 (#11949) ([116f4310e](https://github.com/mozilla/fxa/commit/116f4310e))

## 1.226.4

No changes.

## 1.226.3

No changes.

## 1.226.2

### Other changes

- shared,auth,admin: Refactor attached-clients so routines can be shared with admin panel (#11817)" ([4cbc3bce3](https://github.com/mozilla/fxa/commit/4cbc3bce3))
- #11915: 9f29305b3 Revert "Issues/11091 (#11915)" ([9f29305b3](https://github.com/mozilla/fxa/commit/9f29305b3))
- google: Add support for linked accounts in admin panel (#11937)" ([580cc2fcc](https://github.com/mozilla/fxa/commit/580cc2fcc))

## 1.226.1

No changes.

## 1.226.0

### New features

- google: Add support for linked accounts in admin panel (#11937) ([7c93a6b9d](https://github.com/mozilla/fxa/commit/7c93a6b9d))
- google: Add backend support to disconnect goolge linked account ([97686e415](https://github.com/mozilla/fxa/commit/97686e415))
- coupons: detailed error for coupon fail (#11626) ([cb35c713e](https://github.com/mozilla/fxa/commit/cb35c713e))

### Bug fixes

- google: Delete linked accounts when user deletes FxA account ([920fc8eb8](https://github.com/mozilla/fxa/commit/920fc8eb8))
- subscriptions: allow zero dollar invoices (#11719) ([058a7fd07](https://github.com/mozilla/fxa/commit/058a7fd07))

### Refactorings

- auth: Remove MJML feature flags, remove verifySecondary ## 1.225.3 logic, remove old templates (#11862) ([31061b071](https://github.com/mozilla/fxa/commit/31061b071))

### Other changes

- #11915: e6531d51c Issues/11091 (#11915) ([e6531d51c](https://github.com/mozilla/fxa/commit/e6531d51c))
- deps: bump knex from 1.0.2 to 1.0.3 ([977321030](https://github.com/mozilla/fxa/commit/977321030))
- deps: bump stripe from 8.200.0 to 8.202.0 ([6c2767c02](https://github.com/mozilla/fxa/commit/6c2767c02))
- shared,auth,admin: Refactor attached-clients so routines can be shared with admin panel (#11817) ([6b89206ff](https://github.com/mozilla/fxa/commit/6b89206ff))
- deps: bump knex from 1.0.1 to 1.0.2 (#11892) ([b955eb809](https://github.com/mozilla/fxa/commit/b955eb809))
- deps: bump aws-sdk from 2.1063.0 to 2.1068.0 (#11853) ([99e20de89](https://github.com/mozilla/fxa/commit/99e20de89))
- deps: bump @nestjs/core from 8.2.4 to 8.2.6 ([bd863179b](https://github.com/mozilla/fxa/commit/bd863179b))

## 1.225.3

No changes.

## 1.225.2

No changes.

## 1.225.1

No changes.

## 1.225.0

### New features

- auth: update API to Return Coupon Details (#11654) ([f667ebbbf](https://github.com/mozilla/fxa/commit/f667ebbbf))
- goog: Add google auth frontend login screens (#11743) ([9fd866c8c](https://github.com/mozilla/fxa/commit/9fd866c8c))

### Other changes

- deps: bump @sentry/browser from 6.16.1 to 6.17.2 (#11764) ([1b249659d](https://github.com/mozilla/fxa/commit/1b249659d))
- deps: bump aws-sdk from 2.1057.0 to 2.1063.0 (#11755) ([3df6d7ac1](https://github.com/mozilla/fxa/commit/3df6d7ac1))
- deps: bump stripe from 8.199.0 to 8.200.0 (#11754) ([7cbfa1981](https://github.com/mozilla/fxa/commit/7cbfa1981))
- deps-dev: bump @nestjs/testing from 8.2.5 to 8.2.6 (#11736) ([8ab5a1536](https://github.com/mozilla/fxa/commit/8ab5a1536))
- deps: bump knex from 0.95.15 to 1.0.1 (#11710) ([38870b60e](https://github.com/mozilla/fxa/commit/38870b60e))
- deps: bump stripe from 8.198.0 to 8.199.0 (#11711) ([cec185e52](https://github.com/mozilla/fxa/commit/cec185e52))
- deps: bump superagent from 6.1.0 to 7.1.1 (#11692) ([d4ad6314c](https://github.com/mozilla/fxa/commit/d4ad6314c))
- deps-dev: bump ts-jest from 27.1.2 to 27.1.3 (#11675) ([8e8ffb6b2](https://github.com/mozilla/fxa/commit/8e8ffb6b2))
- deps: bump stripe from 8.195.0 to 8.198.0 (#11662) ([6d1184041](https://github.com/mozilla/fxa/commit/6d1184041))

## 1.224.4

No changes.

## 1.224.3

No changes.

## 1.224.2

### Bug fixes

- auth: Copy 'public' to dist, don't load non-existent Fluent bundles, Fluent strategy tweak (#11753) ([de74d2a65](https://github.com/mozilla/fxa/commit/de74d2a65))

## 1.224.1

No changes.

## 1.224.0

### New features

- services: remove fxa-auth-db-mysql, fxa-email-event-proxy, and fxa-email-service ([50e124b51](https://github.com/mozilla/fxa/commit/50e124b51))
- google: Add backend support for google auth (#11499) ([643c12606](https://github.com/mozilla/fxa/commit/643c12606))

### Other changes

- deps-dev: bump @nestjs/testing from 8.2.4 to 8.2.5 (#11639) ([22d0bc002](https://github.com/mozilla/fxa/commit/22d0bc002))
- deps: bump ajv from 6.12.6 to 8.9.0 (#11640)" ([1417149bd](https://github.com/mozilla/fxa/commit/1417149bd))
- deps: bump ajv from 6.12.6 to 8.9.0 (#11640) ([3b043eb56](https://github.com/mozilla/fxa/commit/3b043eb56))
- deps: bump aws-sdk from 2.1048.0 to 2.1057.0 (#11634) ([dbc9376b2](https://github.com/mozilla/fxa/commit/dbc9376b2))
- deps: bump @nestjs/config from 1.1.5 to 1.1.6 (#11583) ([f44aee4f6](https://github.com/mozilla/fxa/commit/f44aee4f6))
- deps: switch from git to https for deps (#11587) ([c1f0a3682](https://github.com/mozilla/fxa/commit/c1f0a3682))
- deps-dev: bump jest from 27.4.3 to 27.4.7 (#11551) ([43c4bdebd](https://github.com/mozilla/fxa/commit/43c4bdebd))
- deps: bump apollo-server from 2.25.2 to 2.25.3 (#11515) ([a66139d08](https://github.com/mozilla/fxa/commit/a66139d08))

## 1.223.2

### Other changes

- deps: switch from git to https for deps (#11587) ([2611a980d](https://github.com/mozilla/fxa/commit/2611a980d))

## 1.223.1

No changes.

## 1.223.0

### New features

- coupons: add coupon metrics (#11362) ([2f507cb19](https://github.com/mozilla/fxa/commit/2f507cb19))
- subscriptions: create subs with promo codes (#11474) ([614061b20](https://github.com/mozilla/fxa/commit/614061b20))

### Other changes

- deps: bump aws-sdk from 2.1046.0 to 2.1048.0 (#11456) ([336f4de77](https://github.com/mozilla/fxa/commit/336f4de77))
- deps: bump stripe from 8.194.0 to 8.195.0 (#11451) ([b13aa1326](https://github.com/mozilla/fxa/commit/b13aa1326))
- deps: bump ioredis from 4.28.0 to 4.28.2 (#11449) ([5577e08e4](https://github.com/mozilla/fxa/commit/5577e08e4))
- deps-dev: bump @nestjs/testing from 8.2.3 to 8.2.4 (#11448) ([052f06ba0](https://github.com/mozilla/fxa/commit/052f06ba0))
- deps: bump knex from 0.95.14 to 0.95.15 (#11435) ([113cad186](https://github.com/mozilla/fxa/commit/113cad186))

## 1.222.0

### New features

- fxa-shared: Allows sentry events for critical endpoints to be 'tagged' as such. Because: ([6abd9bd3e](https://github.com/mozilla/fxa/commit/6abd9bd3e))
- db: add emailTypeId column to emailBounces, start recording templates on bounces, display in admin panel ([12affe682](https://github.com/mozilla/fxa/commit/12affe682))
- auth: add invoice preview route ([883668335](https://github.com/mozilla/fxa/commit/883668335))

### Other changes

- deps: bump @nestjs/common from 8.2.3 to 8.2.4 (#11420) ([3dba1b300](https://github.com/mozilla/fxa/commit/3dba1b300))
- deps: bump @nestjs/core from 8.2.3 to 8.2.4 (#11398) ([cc54604bf](https://github.com/mozilla/fxa/commit/cc54604bf))
- deps: bump @sentry/integrations from 6.15.0 to 6.16.1 ([032efbdbe](https://github.com/mozilla/fxa/commit/032efbdbe))
- deps-dev: bump ts-jest from 27.0.7 to 27.1.2 (#11386) ([fd027535e](https://github.com/mozilla/fxa/commit/fd027535e))
- deps: bump stripe from 8.193.0 to 8.194.0 (#11388) ([cc21f4e3c](https://github.com/mozilla/fxa/commit/cc21f4e3c))
- auth: destroying attached client would fail (#11302) ([76703f48d](https://github.com/mozilla/fxa/commit/76703f48d))
- deps: bump @sentry/node from 6.15.0 to 6.16.1 ([d6e82ae9c](https://github.com/mozilla/fxa/commit/d6e82ae9c))
- 2d519d084 Feedback ([2d519d084](https://github.com/mozilla/fxa/commit/2d519d084))
- deps: bump @sentry/browser from 6.15.0 to 6.16.1 (#11308) ([5da6dfc65](https://github.com/mozilla/fxa/commit/5da6dfc65))
- deps: bump stripe from 8.191.0 to 8.193.0 (#11303) ([d59c19d29](https://github.com/mozilla/fxa/commit/d59c19d29))
- deps: bump aws-sdk from 2.1045.0 to 2.1046.0 (#11295) ([9fc001e7b](https://github.com/mozilla/fxa/commit/9fc001e7b))
- deps: bump aws-sdk from 2.1044.0 to 2.1045.0 ([515af6847](https://github.com/mozilla/fxa/commit/515af6847))
- deps: bump jsdom from 18.1.1 to 19.0.0 ([19cd329d9](https://github.com/mozilla/fxa/commit/19cd329d9))

## 1.221.3

No changes.

## 1.221.2

### Other changes

- dependabot: a4dfb2efe Cherry-pick cc21f4e (dependabot) ([a4dfb2efe](https://github.com/mozilla/fxa/commit/a4dfb2efe))

## 1.221.1

### New features

- auth: add invoice preview route ([1165f6a5d](https://github.com/mozilla/fxa/commit/1165f6a5d))

## 1.221.0

### New features

- profile: add metricsEnabled to profile. closes #9081 (#10882) ([e2d10147c](https://github.com/mozilla/fxa/commit/e2d10147c))

### Bug fixes

- reverse dep rollback from conflict resolution ([5527014cb](https://github.com/mozilla/fxa/commit/5527014cb))

### Other changes

- deps: bump aws-sdk from 2.1022.0 to 2.1044.0 (#11271) ([6eeb2eb74](https://github.com/mozilla/fxa/commit/6eeb2eb74))
- deps: bump @nestjs/mapped-types from 1.0.0 to 1.0.1 (#11257) ([31a01cc4d](https://github.com/mozilla/fxa/commit/31a01cc4d))
- deps-dev: bump esbuild from 0.14.1 to 0.14.2 ([b02bdf11f](https://github.com/mozilla/fxa/commit/b02bdf11f))
- deps-dev: bump jest from 27.3.1 to 27.4.3 ([5bc98e34d](https://github.com/mozilla/fxa/commit/5bc98e34d))
- #11211: 2fedcbc4a Train 220 (#11211) ([2fedcbc4a](https://github.com/mozilla/fxa/commit/2fedcbc4a))
- deps-dev: bump esbuild-register from 3.1.2 to 3.2.0 (#11218) ([a66e94841](https://github.com/mozilla/fxa/commit/a66e94841))
- deps: bump jsdom from 18.1.0 to 18.1.1 ([2a20d0588](https://github.com/mozilla/fxa/commit/2a20d0588))
- deps-dev: bump esbuild from 0.13.14 to 0.14.0 (#11186) ([fd2d059eb](https://github.com/mozilla/fxa/commit/fd2d059eb))
- deps: bump @nestjs/config from 1.1.0 to 1.1.5 (#11174) ([6bffbbae0](https://github.com/mozilla/fxa/commit/6bffbbae0))
- deps: bump @nestjs/common from 8.1.2 to 8.2.3 (#11168) ([9cda83496](https://github.com/mozilla/fxa/commit/9cda83496))
- deps-dev: bump @nestjs/testing from 8.2.0 to 8.2.3 (#11166) ([6cb640160](https://github.com/mozilla/fxa/commit/6cb640160))
- deps-dev: bump tsconfig-paths from 3.11.0 to 3.12.0 (#11167) ([de19f3591](https://github.com/mozilla/fxa/commit/de19f3591))
- deps: bump @nestjs/core from 8.2.0 to 8.2.3 (#11155) ([f7c73fbd4](https://github.com/mozilla/fxa/commit/f7c73fbd4))
- deps: bump class-transformer from 0.4.0 to 0.5.1 (#11141) ([dcaaa2128](https://github.com/mozilla/fxa/commit/dcaaa2128))
- deps: bump stripe from 8.188.0 to 8.191.0 (#11143) ([2bbea7715](https://github.com/mozilla/fxa/commit/2bbea7715))

## 1.220.5

No changes.

## 1.220.4

No changes.

## 1.220.3

No changes.

## 1.220.2

No changes.

## 1.220.1

No changes.

## 1.220.0

### New features

- auth: return IAP and web subscriptions in /account route (#10964) ([6fd78e313](https://github.com/mozilla/fxa/commit/6fd78e313))

### Bug fixes

- metrics: Re-enable toggling metrics for user (#10990) ([f7b0e7d7c](https://github.com/mozilla/fxa/commit/f7b0e7d7c))
- sentry depth filtering ([a14088c62](https://github.com/mozilla/fxa/commit/a14088c62))

### Refactorings

- admin: use shared db models (#11113) ([684c406b1](https://github.com/mozilla/fxa/commit/684c406b1))

### Other changes

- deps: bump class-validator from 0.13.1 to 0.13.2 (#11107) ([6bf558a23](https://github.com/mozilla/fxa/commit/6bf558a23))
- deps: bump @sentry/integrations from 6.14.2 to 6.15.0 (#11108) ([b567728cf](https://github.com/mozilla/fxa/commit/b567728cf))
- subscriptions: allow IAP subscribers to use Support Form (#11073) ([4645cd7ce](https://github.com/mozilla/fxa/commit/4645cd7ce))
- ci: slow down pm2 startup (#11084) ([a62532cc5](https://github.com/mozilla/fxa/commit/a62532cc5))
- deps: bump ioredis from 4.27.11 to 4.28.0 (#11076) ([d74962e1b](https://github.com/mozilla/fxa/commit/d74962e1b))
- deps: update typescript to 4.5.2 ([60ca05cb8](https://github.com/mozilla/fxa/commit/60ca05cb8))
- deps-dev: bump esbuild from 0.13.4 to 0.13.14 (#11053) ([46b813268](https://github.com/mozilla/fxa/commit/46b813268))
- deps: bump @sentry/node from 6.14.3 to 6.15.0 (#11036) ([cb0f09d41](https://github.com/mozilla/fxa/commit/cb0f09d41))
- deps: bump @sentry/browser from 6.14.3 to 6.15.0 (#11038) ([8344a2332](https://github.com/mozilla/fxa/commit/8344a2332))
- deps: bump @sentry/node from 6.14.1 to 6.14.3 (#11020) ([507aef4b4](https://github.com/mozilla/fxa/commit/507aef4b4))
- deps: bump hot-shots from 8.5.2 to 9.0.0 (#11018) ([10dfa5e1a](https://github.com/mozilla/fxa/commit/10dfa5e1a))
- deps: bump stripe from 8.187.0 to 8.188.0 (#11019) ([f30ab7208](https://github.com/mozilla/fxa/commit/f30ab7208))
- deps: bump @nestjs/core from 8.1.1 to 8.2.0 (#11003) ([85750f0ee](https://github.com/mozilla/fxa/commit/85750f0ee))
- deps: bump @sentry/browser from 6.14.0 to 6.14.3 (#11004) ([d67ce665a](https://github.com/mozilla/fxa/commit/d67ce665a))
- deps: bump jsdom from 18.0.1 to 18.1.0 (#11001) ([0e98720cb](https://github.com/mozilla/fxa/commit/0e98720cb))
- deps: bump knex from 0.95.13 to 0.95.14 (#11002) ([b12fbbb7c](https://github.com/mozilla/fxa/commit/b12fbbb7c))
- deps: bump stripe from 8.186.1 to 8.187.0 ([62a2ea827](https://github.com/mozilla/fxa/commit/62a2ea827))
- deps-dev: bump @nestjs/testing from 8.1.2 to 8.2.0 (#10976) ([47ee4042b](https://github.com/mozilla/fxa/commit/47ee4042b))

## 1.219.5

No changes.

## 1.219.4

No changes.

## 1.219.3

No changes.

## 1.219.2

No changes.

## 1.219.1

No changes.

## 1.219.0

### Other changes

- deps: bump @sentry/node from 6.13.3 to 6.14.1 (#10943) ([bff4cedc9](https://github.com/mozilla/fxa/commit/bff4cedc9))
- deps: bump stripe from 8.186.0 to 8.186.1 (#10941) ([eb1bf62a3](https://github.com/mozilla/fxa/commit/eb1bf62a3))
- deps: bump @sentry/integrations from 6.13.3 to 6.14.1 (#10940) ([e49710a8b](https://github.com/mozilla/fxa/commit/e49710a8b))
- deps: bump aws-sdk from 2.1020.0 to 2.1022.0 (#10931) ([0c85e4d2c](https://github.com/mozilla/fxa/commit/0c85e4d2c))
- deps: bump @sentry/browser from 6.13.3 to 6.14.0 (#10933) ([b4fa20dba](https://github.com/mozilla/fxa/commit/b4fa20dba))
- deps: bump @nestjs/config from 1.0.2 to 1.1.0 (#10932) ([be9feb3c1](https://github.com/mozilla/fxa/commit/be9feb3c1))
- deps: bump jsdom from 18.0.0 to 18.0.1 (#10917) ([9b18fba9e](https://github.com/mozilla/fxa/commit/9b18fba9e))

## 1.218.9

No changes.

## 1.218.8

### Bug fixes

- metrics: temporarily disable the metrics opt out check (#10969) ([deaff14b1](https://github.com/mozilla/fxa/commit/deaff14b1))

## 1.218.7

No changes.

## 1.218.6

No changes.

## 1.218.5

### Other changes

- deps: bump aws-sdk from 2.1016.0 to 2.1020.0 (#10902) ([22f932063](https://github.com/mozilla/fxa/commit/22f932063))
- deps: bump knex from 0.95.11 to 0.95.13 (#10903) ([c6b854f99](https://github.com/mozilla/fxa/commit/c6b854f99))
- deps-dev: bump @nestjs/testing from 8.1.1 to 8.1.2 (#10888) ([9838b2df6](https://github.com/mozilla/fxa/commit/9838b2df6))
- deps: bump stripe from 8.185.0 to 8.186.0 (#10883) ([569e3721f](https://github.com/mozilla/fxa/commit/569e3721f))
- deps: bump stripe from 8.181.0 to 8.185.0 (#10881) ([3809e5188](https://github.com/mozilla/fxa/commit/3809e5188))

## 1.218.4

No changes.

## 1.218.3

No changes.

## 1.218.2

No changes.

## 1.218.1

No changes.

## 1.218.0

### New features

- auth/payments: show Google IAP subscription on subscription management page (#10833) ([1e300b916](https://github.com/mozilla/fxa/commit/1e300b916))
- subscriptions: block web subscription when IAP subscribed ([eff687f39](https://github.com/mozilla/fxa/commit/eff687f39))
- auth: do not emit metrics for opted-out users (#10817) ([c34058a21](https://github.com/mozilla/fxa/commit/c34058a21))
- subscriptions: block web subscription when IAP subscribed ([0f2ad3d3a](https://github.com/mozilla/fxa/commit/0f2ad3d3a))
- auth: added metricsOptOut db column to fxa (#10736) ([773a2fab0](https://github.com/mozilla/fxa/commit/773a2fab0))
- subscriptions: add endpoint for billing details and IAP ## 1.217.2 Stripe subscriptions ([8d229a51a](https://github.com/mozilla/fxa/commit/8d229a51a))
- auth: use getUidAndEmailByStripeCustomerId helper in Stripe webhook handlers (#10662) ([84770cc3e](https://github.com/mozilla/fxa/commit/84770cc3e))

### Bug fixes

- project: update other deps so we can update to jest 27.3.1 ([a3716198c](https://github.com/mozilla/fxa/commit/a3716198c))

### Other changes

- deps: bump aws-sdk from 2.1013.0 to 2.1016.0 (#10841) ([ab4c9eb7a](https://github.com/mozilla/fxa/commit/ab4c9eb7a))
- deps: bump @nestjs/common from 8.1.1 to 8.1.2 (#10840) ([ece968d91](https://github.com/mozilla/fxa/commit/ece968d91))
- subscriptions: block web subscription when IAP subscribed" ([7acb514c4](https://github.com/mozilla/fxa/commit/7acb514c4))
- deps: bump aws-sdk from 2.1011.0 to 2.1013.0 (#10812) ([a78c2b17f](https://github.com/mozilla/fxa/commit/a78c2b17f))
- node: upgrade to node 16 (#10799) ([17e06a38d](https://github.com/mozilla/fxa/commit/17e06a38d))
- deps: bump @nestjs/core from 8.0.10 to 8.1.1 ([aec2faeb7](https://github.com/mozilla/fxa/commit/aec2faeb7))
- deps-dev: bump @nestjs/testing from 8.0.5 to 8.1.1 ([35fe06c74](https://github.com/mozilla/fxa/commit/35fe06c74))
- deps-dev: bump jest from 26.6.0 to 27.3.1 ([6b6a68853](https://github.com/mozilla/fxa/commit/6b6a68853))
- deps: bump aws-sdk from 2.1010.0 to 2.1011.0 ([7d03b5d3e](https://github.com/mozilla/fxa/commit/7d03b5d3e))
- deps: bump aws-sdk from 2.1002.0 to 2.1010.0 ([b9f41d79d](https://github.com/mozilla/fxa/commit/b9f41d79d))
- deps: bump @nestjs/common from 8.0.8 to 8.1.1 ([023a66764](https://github.com/mozilla/fxa/commit/023a66764))

## 1.217.2

No changes.

## 1.217.1

No changes.

## 1.217.0

### New features

- db: update db and lookup method to locate FxA user by Stripe customer id (#10599) ([1ebc814ae](https://github.com/mozilla/fxa/commit/1ebc814ae))

### Bug fixes

- tests: fixed auth-server/scripts tests ([570e5a334](https://github.com/mozilla/fxa/commit/570e5a334))

### Refactorings

- build: use esbuild instead of ts-node (#10639) ([a95f1270a](https://github.com/mozilla/fxa/commit/a95f1270a))

### Other changes

- deps: bump @nestjs/config from 1.0.1 to 1.0.2 (#10685) ([ac5d3f3dd](https://github.com/mozilla/fxa/commit/ac5d3f3dd))
- deps: bump stripe from 8.178.0 to 8.181.0 ([c163bd9af](https://github.com/mozilla/fxa/commit/c163bd9af))
- deps: bump ioredis from 4.27.10 to 4.27.11 ([8d01acb19](https://github.com/mozilla/fxa/commit/8d01acb19))
- deps: bump jsdom from 17.0.0 to 18.0.0 (#10657) ([4ae63295a](https://github.com/mozilla/fxa/commit/4ae63295a))
- deps: bump aws-sdk from 2.996.0 to 2.1002.0 ([97e82c61b](https://github.com/mozilla/fxa/commit/97e82c61b))
- deps: updated dependencies (#10638) ([f57031d15](https://github.com/mozilla/fxa/commit/f57031d15))
- deps: bump ioredis from 4.27.9 to 4.27.10 ([c39396ae0](https://github.com/mozilla/fxa/commit/c39396ae0))
- deps: bump @nestjs/core from 8.0.9 to 8.0.10 ([239bd66d9](https://github.com/mozilla/fxa/commit/239bd66d9))
- deps: bump graphql from 15.5.2 to 15.6.1 ([c6a80d028](https://github.com/mozilla/fxa/commit/c6a80d028))
- deps: bump @nestjs/core from 8.0.6 to 8.0.9 (#10597) ([e71cd2a03](https://github.com/mozilla/fxa/commit/e71cd2a03))
- deps: bump @sentry/node from 6.12.0 to 6.13.2 (#10583) ([cb19efb3c](https://github.com/mozilla/fxa/commit/cb19efb3c))
- deps: bump @sentry/integrations from 6.12.0 to 6.13.2 (#10569) ([ab0b3ab6d](https://github.com/mozilla/fxa/commit/ab0b3ab6d))
- deps: bump @nestjs/common from 8.0.5 to 8.0.8 (#10565) ([c97c922a4](https://github.com/mozilla/fxa/commit/c97c922a4))
- deps: bump stripe from 8.176.0 to 8.178.0 ([91bab740e](https://github.com/mozilla/fxa/commit/91bab740e))

## 1.216.3

No changes.

## 1.216.2

No changes.

## 1.216.1

No changes.

## 1.216.0

### New features

- auth: enable nodemailer SES transport (#10532) ([6ab822f7a](https://github.com/mozilla/fxa/commit/6ab822f7a))
- shared: handle more query object types ([44fba7188](https://github.com/mozilla/fxa/commit/44fba7188))

### Bug fixes

- metrics: Add remaining metrics and `fxa_reg - complete` for pwordless accounts (#10516) ([22b7fd5d7](https://github.com/mozilla/fxa/commit/22b7fd5d7))

### Other changes

- deps: update pm2; dedupe (#10557) ([89e549a74](https://github.com/mozilla/fxa/commit/89e549a74))
- deps: bump aws-sdk from 2.992.0 to 2.996.0 (#10550) ([449eebbb1](https://github.com/mozilla/fxa/commit/449eebbb1))
- deps: bump hot-shots from 8.5.0 to 8.5.1 (#10511) ([cc05a2780](https://github.com/mozilla/fxa/commit/cc05a2780))
- deps: bump @sentry/browser from 6.13.1 to 6.13.2 ([09cdd2a07](https://github.com/mozilla/fxa/commit/09cdd2a07))
- deps: bump aws-sdk from 2.987.0 to 2.992.0 ([630d8d4f6](https://github.com/mozilla/fxa/commit/630d8d4f6))
- deps: bump @sentry/browser from 6.12.0 to 6.13.1 ([8c7809b15](https://github.com/mozilla/fxa/commit/8c7809b15))
- deps: bump stripe from 8.175.0 to 8.176.0 ([662ad7405](https://github.com/mozilla/fxa/commit/662ad7405))
- deps: bump stripe from 8.174.0 to 8.175.0 ([8f00ce7cc](https://github.com/mozilla/fxa/commit/8f00ce7cc))
- deps: bump objection from 2.2.15 to 2.2.16 ([2cc072fdd](https://github.com/mozilla/fxa/commit/2cc072fdd))

## 1.215.2

No changes.

## 1.215.1

No changes.

## 1.215.0

### Other changes

- deps: bump ajv from 6.12.6 to 8.6.3" ([28452e81f](https://github.com/mozilla/fxa/commit/28452e81f))
- deps: bump ajv from 6.12.6 to 8.6.3 ([21ec92aa6](https://github.com/mozilla/fxa/commit/21ec92aa6))
- deps: bump aws-sdk from 2.985.0 to 2.987.0 ([addcd4257](https://github.com/mozilla/fxa/commit/addcd4257))
- deps: bump aws-sdk from 2.983.0 to 2.985.0 ([b2736bcfd](https://github.com/mozilla/fxa/commit/b2736bcfd))
- deps: bump stripe from 8.170.0 to 8.174.0 ([4ded5554e](https://github.com/mozilla/fxa/commit/4ded5554e))
- deps: bump knex from 0.95.10 to 0.95.11 ([ee58efbbc](https://github.com/mozilla/fxa/commit/ee58efbbc))
- deps: bump aws-sdk from 2.982.0 to 2.983.0 ([9db2dc21a](https://github.com/mozilla/fxa/commit/9db2dc21a))
- deps: bump @sentry/integrations from 6.10.0 to 6.12.0 ([edd5b0243](https://github.com/mozilla/fxa/commit/edd5b0243))
- deps: bump aws-sdk from 2.981.0 to 2.982.0 ([60a512492](https://github.com/mozilla/fxa/commit/60a512492))
- deps: bump @sentry/node from 6.11.0 to 6.12.0 ([4809fc2cc](https://github.com/mozilla/fxa/commit/4809fc2cc))
- deps-dev: bump chance from 1.1.7 to 1.1.8 ([93c025b02](https://github.com/mozilla/fxa/commit/93c025b02))
- deps: bump aws-sdk from 2.979.0 to 2.981.0 ([e61ec1daa](https://github.com/mozilla/fxa/commit/e61ec1daa))

## 1.214.1

No changes.

## 1.214.0

### Bug fixes

- allow patch version > 9 ([0c572f53d](https://github.com/mozilla/fxa/commit/0c572f53d))
- auth: use IAP scope for token register ([18694cca4](https://github.com/mozilla/fxa/commit/18694cca4))

### Other changes

- deps: bump ioredis from 4.27.8 to 4.27.9 ([bcc59065a](https://github.com/mozilla/fxa/commit/bcc59065a))
- deps: bump @sentry/browser from 6.11.0 to 6.12.0 ([4eb6a0c52](https://github.com/mozilla/fxa/commit/4eb6a0c52))
- deps: bump graphql from 15.5.1 to 15.5.2 ([6800d12fd](https://github.com/mozilla/fxa/commit/6800d12fd))
- deps: bump aws-sdk from 2.978.0 to 2.979.0 ([baf49c964](https://github.com/mozilla/fxa/commit/baf49c964))
- deps: bump aws-sdk from 2.977.0 to 2.978.0 ([3d5e14d67](https://github.com/mozilla/fxa/commit/3d5e14d67))
- deps: bump aws-sdk from 2.972.0 to 2.977.0 ([9b90d6e26](https://github.com/mozilla/fxa/commit/9b90d6e26))
- deps-dev: bump tsconfig-paths from 3.10.1 to 3.11.0 ([3c7a79225](https://github.com/mozilla/fxa/commit/3c7a79225))
- deps: bump stripe from 8.169.0 to 8.170.0 ([4aaa748bc](https://github.com/mozilla/fxa/commit/4aaa748bc))
- deps: bump knex from 0.95.8 to 0.95.10 ([8f63b924e](https://github.com/mozilla/fxa/commit/8f63b924e))
- deps: bump aws-sdk from 2.971.0 to 2.972.0 ([4706923b4](https://github.com/mozilla/fxa/commit/4706923b4))
- deps: bump ioredis from 4.27.7 to 4.27.8 ([f05fca9a3](https://github.com/mozilla/fxa/commit/f05fca9a3))
- deps: bump aws-sdk from 2.969.0 to 2.971.0 ([d53a82aed](https://github.com/mozilla/fxa/commit/d53a82aed))
- deps: bump jsdom from 16.6.0 to 17.0.0 ([6152d0956](https://github.com/mozilla/fxa/commit/6152d0956))

## 1.213.11

### Bug fixes

- allow patch version > 9 ([4c8da1474](https://github.com/mozilla/fxa/commit/4c8da1474))

## 1.213.10

No changes.

## 1.213.9

No changes.

## 1.213.8

No changes.

## 1.213.7

No changes.

## 1.213.6

No changes.

## 1.213.5

No changes.

## 1.213.4

### Bug fixes

- auth: use IAP scope for token register ([f36196371](https://github.com/mozilla/fxa/commit/f36196371))

## 1.213.3

No changes.

## 1.213.2

No changes.

## 1.213.1

No changes.

## 1.213.0

### New features

- auth: add play RTDN handling ([f84f142ea](https://github.com/mozilla/fxa/commit/f84f142ea))
- metrics: Emit metric when viewing account create form in payments ([b9c210361](https://github.com/mozilla/fxa/commit/b9c210361))
- subscriptions: create acct and subscribe with Stripe ([3ced8935b](https://github.com/mozilla/fxa/commit/3ced8935b))

### Other changes

- fxa-payments-server: add legal links to checkout form ([b12a2de98](https://github.com/mozilla/fxa/commit/b12a2de98))
- deps: bump aws-sdk from 2.965.0 to 2.969.0 ([9f277451f](https://github.com/mozilla/fxa/commit/9f277451f))
- deps: bump stripe from 8.168.0 to 8.169.0 ([0bc6ab329](https://github.com/mozilla/fxa/commit/0bc6ab329))
- deps: bump @sentry/browser from 6.10.0 to 6.11.0 ([679f3e049](https://github.com/mozilla/fxa/commit/679f3e049))
- deps: bump @nestjs/core from 8.0.5 to 8.0.6 ([fde6cb4a3](https://github.com/mozilla/fxa/commit/fde6cb4a3))
- deps: bump @sentry/node from 6.10.0 to 6.11.0 ([25f24a897](https://github.com/mozilla/fxa/commit/25f24a897))
- deps: bump aws-sdk from 2.963.0 to 2.965.0 ([3842bb268](https://github.com/mozilla/fxa/commit/3842bb268))
- deps: bump stripe from 8.167.0 to 8.168.0 ([0afc8393c](https://github.com/mozilla/fxa/commit/0afc8393c))
- deps: bump aws-sdk from 2.958.0 to 2.963.0 ([1d3993916](https://github.com/mozilla/fxa/commit/1d3993916))

## 1.212.2

No changes.

## 1.212.1

No changes.

## 1.212.0

### New features

- auth: query play store for products purchased ([e65867b70](https://github.com/mozilla/fxa/commit/e65867b70))
- auth: allow /newsletters access with access token ([e8ca248ba](https://github.com/mozilla/fxa/commit/e8ca248ba))

### Other changes

- deps: updated base deps for train-212 ([8a391693f](https://github.com/mozilla/fxa/commit/8a391693f))
- deps: bump stripe from 8.157.0 to 8.167.0 ([b13f89266](https://github.com/mozilla/fxa/commit/b13f89266))
- deps: bump ioredis from 4.27.6 to 4.27.7 ([17f1ff4e7](https://github.com/mozilla/fxa/commit/17f1ff4e7))
- deps: bump aws-sdk from 2.957.0 to 2.958.0 ([6053691b0](https://github.com/mozilla/fxa/commit/6053691b0))
- deps: bump aws-sdk from 2.952.0 to 2.957.0 ([7c363c1c9](https://github.com/mozilla/fxa/commit/7c363c1c9))
- deps: bump knex from 0.95.7 to 0.95.8 ([9993b6a59](https://github.com/mozilla/fxa/commit/9993b6a59))
- deps-dev: bump @nestjs/testing from 8.0.4 to 8.0.5 ([880e63e0c](https://github.com/mozilla/fxa/commit/880e63e0c))
- deps: bump @nestjs/common from 8.0.4 to 8.0.5 ([9ed11db51](https://github.com/mozilla/fxa/commit/9ed11db51))
- deps: updated yarn to 3.0 and typescript to 4.3.5 ([b8a6bd51c](https://github.com/mozilla/fxa/commit/b8a6bd51c))
- deps: bump @nestjs/core from 8.0.4 to 8.0.5 ([4819abcad](https://github.com/mozilla/fxa/commit/4819abcad))
- deps: bump @sentry/browser from 6.9.0 to 6.10.0 ([360263e06](https://github.com/mozilla/fxa/commit/360263e06))
- deps: bump aws-sdk from 2.948.0 to 2.952.0 ([6963baa8c](https://github.com/mozilla/fxa/commit/6963baa8c))

## 1.211.2

No changes.

## 1.211.1

No changes.

## 1.211.0

### Other changes

- deps: bump hot-shots from 8.3.2 to 8.5.0 ([f5cc3f7db](https://github.com/mozilla/fxa/commit/f5cc3f7db))
- deps: bump generic-pool from 3.7.8 to 3.8.2 ([3c10dfb61](https://github.com/mozilla/fxa/commit/3c10dfb61))
- deps: bump @sentry/node from 6.7.2 to 6.9.0 ([10020fb87](https://github.com/mozilla/fxa/commit/10020fb87))
- deps: bump aws-sdk from 2.947.0 to 2.948.0 ([649cb36c6](https://github.com/mozilla/fxa/commit/649cb36c6))
- deps: bump @sentry/browser from 6.8.0 to 6.9.0 ([49207d72d](https://github.com/mozilla/fxa/commit/49207d72d))
- deps: bump aws-sdk from 2.935.0 to 2.947.0 ([aaa4a41ea](https://github.com/mozilla/fxa/commit/aaa4a41ea))
- deps: bump @nestjs/config from 0.6.3 to 1.0.0 ([267bcf120](https://github.com/mozilla/fxa/commit/267bcf120))
- deps: bump knex from 0.95.6 to 0.95.7 ([bac054b4d](https://github.com/mozilla/fxa/commit/bac054b4d))
- deps: bump @sentry/browser from 6.7.2 to 6.8.0 ([f4c750bb7](https://github.com/mozilla/fxa/commit/f4c750bb7))

## 1.210.3

No changes.

## 1.210.2

No changes.

## 1.210.1

No changes.

## 1.210.0

### Other changes

- deps: bump @sentry/integrations from 6.7.2 to 6.8.0 ([7dff8d306](https://github.com/mozilla/fxa/commit/7dff8d306))
- deps: bump stripe from 8.156.0 to 8.157.0 ([1182ae881](https://github.com/mozilla/fxa/commit/1182ae881))
- deps: bump aws-sdk from 2.934.0 to 2.935.0 ([76ad1ed67](https://github.com/mozilla/fxa/commit/76ad1ed67))
- fxa-shared: removed exported redis from fxa-shared ([70d329c44](https://github.com/mozilla/fxa/commit/70d329c44))
- deps: bump aws-sdk from 2.933.0 to 2.934.0 ([1b083a782](https://github.com/mozilla/fxa/commit/1b083a782))
- deps: bump accept-language from 2.0.17 to 3.0.18 ([971db14a5](https://github.com/mozilla/fxa/commit/971db14a5))

## 1.209.1

No changes.

## 1.209.0

### New features

- admin: disable account ([4c995b603](https://github.com/mozilla/fxa/commit/4c995b603))
- subscriptions: update sub plan upgrade eligibility logic ([5bb3f9bc4](https://github.com/mozilla/fxa/commit/5bb3f9bc4))
- auth: convert remaining auth-server db use to direct db access ([a561ae1f3](https://github.com/mozilla/fxa/commit/a561ae1f3))

### Other changes

- deps: update some deps ([b89dc6079](https://github.com/mozilla/fxa/commit/b89dc6079))
- deps: update deps and start ignoring @types/\* in dependabot ([694ff5f6a](https://github.com/mozilla/fxa/commit/694ff5f6a))
- deps: bump aws-sdk from 2.930.0 to 2.932.0 ([af63d7a2b](https://github.com/mozilla/fxa/commit/af63d7a2b))
- deps: bump graphql from 15.5.0 to 15.5.1 ([990030034](https://github.com/mozilla/fxa/commit/990030034))
- deps: bump stripe from 8.154.0 to 8.156.0 ([80db58c93](https://github.com/mozilla/fxa/commit/80db58c93))
- deps: bump @nestjs/core from 7.6.17 to 7.6.18 ([135d90fda](https://github.com/mozilla/fxa/commit/135d90fda))
- deps: bump aws-sdk from 2.928.0 to 2.930.0 ([b6ec6ce5b](https://github.com/mozilla/fxa/commit/b6ec6ce5b))
- deps: bump @sentry/node from 6.7.0 to 6.7.1 ([b78095131](https://github.com/mozilla/fxa/commit/b78095131))
- deps: bump aws-sdk from 2.926.0 to 2.928.0 ([94684a588](https://github.com/mozilla/fxa/commit/94684a588))
- deps: bump @sentry/integrations from 6.6.0 to 6.7.1 ([68e04e8a1](https://github.com/mozilla/fxa/commit/68e04e8a1))
- deps: bump @sentry/node from 6.5.1 to 6.7.0 ([b6119a2c7](https://github.com/mozilla/fxa/commit/b6119a2c7))
- deps: update pm2 / dedupe ([5d7653fa6](https://github.com/mozilla/fxa/commit/5d7653fa6))
- deps: bump apollo-server from 2.25.0 to 2.25.1 ([7a55f6ab1](https://github.com/mozilla/fxa/commit/7a55f6ab1))
- deps: bump aws-sdk from 2.923.0 to 2.926.0 ([22c59811a](https://github.com/mozilla/fxa/commit/22c59811a))
- deps: bump @sentry/integrations from 6.5.1 to 6.6.0 ([4a123dddf](https://github.com/mozilla/fxa/commit/4a123dddf))

## 1.208.4

No changes.

## 1.208.3

No changes.

## 1.208.2

No changes.

## 1.208.1

No changes.

## 1.208.0

### New features

- payments: Use custom action button label if specified in PaymentConfirmation ([617be5182](https://github.com/mozilla/fxa/commit/617be5182))

### Refactorings

- db: move more auth-db functions into fxa-shared ([d5b587472](https://github.com/mozilla/fxa/commit/d5b587472))

### Other changes

- deps: bump stripe from 8.153.0 to 8.154.0 ([e1292ff7c](https://github.com/mozilla/fxa/commit/e1292ff7c))
- deps: updated some deps ([fa895572c](https://github.com/mozilla/fxa/commit/fa895572c))
- deps: updated pm2 ([34704ba14](https://github.com/mozilla/fxa/commit/34704ba14))
- deps: updated sentry/\* packages ([9095a1c13](https://github.com/mozilla/fxa/commit/9095a1c13))
- deps: bump apollo-server from 2.24.1 to 2.25.0 ([00b502af8](https://github.com/mozilla/fxa/commit/00b502af8))
- deps: bump aws-sdk from 2.920.0 to 2.923.0 ([3cb5b950c](https://github.com/mozilla/fxa/commit/3cb5b950c))
- deps-dev: bump @types/node from 14.14.5 to 15.12.2 ([1fd38c54d](https://github.com/mozilla/fxa/commit/1fd38c54d))
- deps: bump stripe from 8.149.0 to 8.153.0 ([d80d64d43](https://github.com/mozilla/fxa/commit/d80d64d43))
- deps: bump hot-shots from 8.3.1 to 8.3.2 ([0cb43b6aa](https://github.com/mozilla/fxa/commit/0cb43b6aa))
- deps: bump aws-sdk from 2.919.0 to 2.920.0 ([434cb0a53](https://github.com/mozilla/fxa/commit/434cb0a53))
- deps: bump aws-sdk from 2.913.0 to 2.919.0 ([a616dc89a](https://github.com/mozilla/fxa/commit/a616dc89a))
- deps-dev: bump @types/redis from 2.8.28 to 2.8.29 ([7a3df7c82](https://github.com/mozilla/fxa/commit/7a3df7c82))
- deps-dev: bump jsdom from 16.5.3 to 16.6.0 ([15c547814](https://github.com/mozilla/fxa/commit/15c547814))
- deps: updated knex ([e02c6720e](https://github.com/mozilla/fxa/commit/e02c6720e))

## 1.207.1

No changes.

## 1.207.0

### New features

- auth: create script to send subscription renewal reminder emails ([178cec80a](https://github.com/mozilla/fxa/commit/178cec80a))

### Other changes

- deps: bump mocha from 7.2.0 to 8.4.0 ([4b11eab5f](https://github.com/mozilla/fxa/commit/4b11eab5f))
- deps: bump @types/sinon from 10.0.0 to 10.0.1 ([5381ac95f](https://github.com/mozilla/fxa/commit/5381ac95f))
- deps: bump stripe from 8.148.0 to 8.149.0 ([07559e710](https://github.com/mozilla/fxa/commit/07559e710))
- deps: update some deps ([6fce48032](https://github.com/mozilla/fxa/commit/6fce48032))
- deps: added "yarn outdated" plugin + updated some deps ([952e4f388](https://github.com/mozilla/fxa/commit/952e4f388))
- auth: clean up subscription-reminders script ([05229412d](https://github.com/mozilla/fxa/commit/05229412d))
- deps: bump apollo-server from 2.23.0 to 2.24.1 ([5ee603c3c](https://github.com/mozilla/fxa/commit/5ee603c3c))

## 1.206.1

No changes.

## 1.206.0

### Other changes

- deps-dev: bump @types/jest from 26.0.22 to 26.0.23 ([8b9c2f364](https://github.com/mozilla/fxa/commit/8b9c2f364))
- deps: bump stripe from 8.147.0 to 8.148.0 ([af1b4fdfa](https://github.com/mozilla/fxa/commit/af1b4fdfa))
- deps: bump mozlog from 3.0.1 to 3.0.2 ([f46bd3472](https://github.com/mozilla/fxa/commit/f46bd3472))
- deps-dev: bump ts-jest from 26.5.5 to 26.5.6 ([2680b5840](https://github.com/mozilla/fxa/commit/2680b5840))
- auth-server: update stripe ([b283b768e](https://github.com/mozilla/fxa/commit/b283b768e))
- deps-dev: bump @types/superagent from 4.1.10 to 4.1.11 ([fce865e63](https://github.com/mozilla/fxa/commit/fce865e63))
- deps: update typescript to v4 ([2e9ff2e14](https://github.com/mozilla/fxa/commit/2e9ff2e14))
- deps: bump redis from 3.1.0 to 3.1.1 ([27c0f6c60](https://github.com/mozilla/fxa/commit/27c0f6c60))
- deps: update react-scripts to v4 ([477eddca4](https://github.com/mozilla/fxa/commit/477eddca4))
- deps: updated pm2 ([0847e2545](https://github.com/mozilla/fxa/commit/0847e2545))
- deps: bump aws-sdk from 2.883.0 to 2.896.0 ([a45963d14](https://github.com/mozilla/fxa/commit/a45963d14))
- settings: remove settings_version from metrics ([367b8eea0](https://github.com/mozilla/fxa/commit/367b8eea0))
- deps: update @nestjs/\* ([ffa22162f](https://github.com/mozilla/fxa/commit/ffa22162f))
- deps: bump apollo-server from 2.19.2 to 2.23.0 ([e257f75ac](https://github.com/mozilla/fxa/commit/e257f75ac))

## 1.205.0

### New features

- emails: add tables and models for email history ([16212769d](https://github.com/mozilla/fxa/commit/16212769d))

### Other changes

- l10n: add eu to supported languages ([72d77ba2e](https://github.com/mozilla/fxa/commit/72d77ba2e))
- deps-dev: bump jsdom from 16.4.0 to 16.5.3 ([8f3c2219c](https://github.com/mozilla/fxa/commit/8f3c2219c))
- deps-dev: bump @types/mocha from 8.2.1 to 8.2.2 ([0723fa7f7](https://github.com/mozilla/fxa/commit/0723fa7f7))
- deps-dev: bump ts-loader from 8.0.12 to 9.0.0 ([5fcc9cffe](https://github.com/mozilla/fxa/commit/5fcc9cffe))
- deps: bump @types/sinon from 9.0.8 to 10.0.0 ([26debdc2d](https://github.com/mozilla/fxa/commit/26debdc2d))
- deps-dev: bump ts-jest from 26.5.4 to 26.5.5 ([66ab577c0](https://github.com/mozilla/fxa/commit/66ab577c0))

## 1.204.7

No changes.

## 1.204.6

No changes.

## 1.204.5

No changes.

## 1.204.4

No changes.

## 1.204.3

No changes.

## 1.204.2

No changes.

## 1.204.1

### Bug fixes

- release: Add changelog notes and bump version for 204 ([5b8356e11](https://github.com/mozilla/fxa/commit/5b8356e11))

## 1.204.0

### Bug fixes

- stop reporting apollo errors ([acb735aa9](https://github.com/mozilla/fxa/commit/acb735aa9))
- l10n: use en-CA not en-GB for settings and payments ([ef404738d](https://github.com/mozilla/fxa/commit/ef404738d))
- auth-server: handle empty responses ([be6e22c81](https://github.com/mozilla/fxa/commit/be6e22c81))

### Other changes

- deps: bump generic-pool from 3.7.2 to 3.7.8 ([30b800739](https://github.com/mozilla/fxa/commit/30b800739))
- deps-dev: bump ts-jest from 26.4.3 to 26.5.4 ([dc136b213](https://github.com/mozilla/fxa/commit/dc136b213))
- deps: bump aws-sdk from 2.879.0 to 2.883.0 ([47ddfc9bb](https://github.com/mozilla/fxa/commit/47ddfc9bb))

## 1.203.5

No changes.

## 1.203.4

No changes.

## 1.203.3

No changes.

## 1.203.2

No changes.

## 1.203.1

No changes.

## 1.203.0

### Other changes

- deps: bump @nestjs/core from 7.6.14 to 7.6.15 ([adfbdd3b3](https://github.com/mozilla/fxa/commit/adfbdd3b3))
- deps: bump objection from 2.2.7 to 2.2.15 ([626f62e58](https://github.com/mozilla/fxa/commit/626f62e58))
- deps: bump @nestjs/core from 7.6.13 to 7.6.14 ([a335f90c7](https://github.com/mozilla/fxa/commit/a335f90c7))
- deps: bump class-transformer from 0.3.1 to 0.4.0 ([66bec644c](https://github.com/mozilla/fxa/commit/66bec644c))
- deps: bump @nestjs/mapped-types from 0.3.0 to 0.4.0 ([aedb056a1](https://github.com/mozilla/fxa/commit/aedb056a1))
- deps-dev: bump @types/redis from 2.8.27 to 2.8.28 ([e6d19228f](https://github.com/mozilla/fxa/commit/e6d19228f))

## 1.202.3

### Bug fixes

- settings: fix session ttl in settings ([b9abd02da](https://github.com/mozilla/fxa/commit/b9abd02da))

## 1.202.2

No changes.

## 1.202.1

No changes.

## 1.202.0

### New features

- auth-server: handle IPN for billing agreement cancelled Because: ([381b00471](https://github.com/mozilla/fxa/commit/381b00471))
- l10n: Add support for new locales ([23f26e217](https://github.com/mozilla/fxa/commit/23f26e217))

### Bug fixes

- l10n: Add 'hi' locale support ([213ac944a](https://github.com/mozilla/fxa/commit/213ac944a))

### Other changes

- Add a new event property to Checkout related Amplitude events ([045a6544d](https://github.com/mozilla/fxa/commit/045a6544d))
- deps: bump @nestjs/core from 7.6.12 to 7.6.13 ([e0611af3b](https://github.com/mozilla/fxa/commit/e0611af3b))
- deps: bump generic-pool from 3.7.1 to 3.7.2 ([52648911e](https://github.com/mozilla/fxa/commit/52648911e))
- deps-dev: bump @types/mocha from 7.0.2 to 8.2.1 ([1ccd661a1](https://github.com/mozilla/fxa/commit/1ccd661a1))
- deps: bump rxjs from 6.6.3 to 6.6.6 ([62c3c2447](https://github.com/mozilla/fxa/commit/62c3c2447))
- deps: bump @nestjs/graphql from 7.9.9 to 7.9.10 ([a6b3030cc](https://github.com/mozilla/fxa/commit/a6b3030cc))
- deps: bump aws-sdk from 2.849.0 to 2.851.0 ([ba6f4b37e](https://github.com/mozilla/fxa/commit/ba6f4b37e))
- deps: bump @nestjs/common from 7.6.4 to 7.6.13 ([386ccc471](https://github.com/mozilla/fxa/commit/386ccc471))

## 1.201.1

No changes.

## 1.201.0

### New features

- settings: finish implementing delete avatar ([77aa4fd8d](https://github.com/mozilla/fxa/commit/77aa4fd8d))

### Other changes

- deps: bump @nestjs/graphql from 7.9.8 to 7.9.9 ([e6b62e0e0](https://github.com/mozilla/fxa/commit/e6b62e0e0))
- deps: bump @nestjs/config from 0.6.1 to 0.6.3 ([41b3ea4af](https://github.com/mozilla/fxa/commit/41b3ea4af))
- deps: bump aws-sdk from 2.841.0 to 2.849.0 ([1e3e08e4b](https://github.com/mozilla/fxa/commit/1e3e08e4b))
- fxa-settings: add avatar delete mutation ([510c2faef](https://github.com/mozilla/fxa/commit/510c2faef))
- deps: bump @nestjs/core from 7.5.5 to 7.6.12 ([11b786463](https://github.com/mozilla/fxa/commit/11b786463))
- deps: bump aws-sdk from 2.822.0 to 2.841.0 ([69f41b166](https://github.com/mozilla/fxa/commit/69f41b166))

## 1.200.0

### New features

- fxa-settings: avatar uploads ([edaf607ead](https://github.com/mozilla/fxa/commit/edaf607ead))

### Bug fixes

- settings: when gql-api switched to nestjs the auth error changed ([7817de9390](https://github.com/mozilla/fxa/commit/7817de9390))

### Other changes

- deps: bump @nestjs/graphql from 7.9.1 to 7.9.8 ([2e1c276997](https://github.com/mozilla/fxa/commit/2e1c276997))
- deps: bump @nestjs/mapped-types from 0.1.1 to 0.3.0 ([50b07cab0a](https://github.com/mozilla/fxa/commit/50b07cab0a))
- deps: bump graphql from 15.4.0 to 15.5.0 ([eae1a35dd0](https://github.com/mozilla/fxa/commit/eae1a35dd0))

## 1.199.0

### New features

- auth-server: add paypal IPN handler ([8d5c253fe](https://github.com/mozilla/fxa/commit/8d5c253fe))
- shared: add paypal BA model commands ([3aae010a7](https://github.com/mozilla/fxa/commit/3aae010a7))

### Bug fixes

- metrics: fixed 'fxa - activity' metric ([a28ceeb74](https://github.com/mozilla/fxa/commit/a28ceeb74))

### Other changes

- deps: bump knex from 0.21.12 to 0.21.16 ([8ff4bb2b5](https://github.com/mozilla/fxa/commit/8ff4bb2b5))
- deps: bump @sentry/node from 6.0.0 to 6.0.1 ([3b6838b18](https://github.com/mozilla/fxa/commit/3b6838b18))
- deps: bump objection from 2.2.3 to 2.2.7 ([875a1ffbb](https://github.com/mozilla/fxa/commit/875a1ffbb))
- deps-dev: bump @nestjs/testing from 7.5.5 to 7.6.5 ([ed20e1585](https://github.com/mozilla/fxa/commit/ed20e1585))
- deps: bump @sentry/node from 5.29.1 to 6.0.0 ([147825a5b](https://github.com/mozilla/fxa/commit/147825a5b))
- deps: bump apollo-server from 2.19.0 to 2.19.2 ([48896ad58](https://github.com/mozilla/fxa/commit/48896ad58))

## 1.198.2

### Bug fixes

- metrics: fixed 'fxa - activity' metric ([bdd645c48](https://github.com/mozilla/fxa/commit/bdd645c48))

## 1.198.1

### Other changes

- 4e70b3f04 merge main->train-198 ([4e70b3f04](https://github.com/mozilla/fxa/commit/4e70b3f04))

## 1.198.0

### Other changes

- deps: update eslint to v7 ([7cf502be2](https://github.com/mozilla/fxa/commit/7cf502be2))
- deps: bump graphql from 14.6.0 to 15.4.0 ([d28e79655](https://github.com/mozilla/fxa/commit/d28e79655))
- deps: removed fxa-notifier-aws dep ([71c8bc171](https://github.com/mozilla/fxa/commit/71c8bc171))

## 1.197.3

No changes.

## 1.197.2

No changes.

## 1.197.1

No changes.

## 1.197.0

### New features

- metrics: add nav timing metrics for new settings ([b1f2650a4](https://github.com/mozilla/fxa/commit/b1f2650a4))

### Refactorings

- auth: use native promises in all production / non-test code ([ea2ab78c1](https://github.com/mozilla/fxa/commit/ea2ab78c1))

### Other changes

- deps: bump @nestjs/common from 7.5.5 to 7.6.4 ([afc29280a](https://github.com/mozilla/fxa/commit/afc29280a))
- deps: bump moment from 2.25.3 to 2.29.1 ([76acfdd63](https://github.com/mozilla/fxa/commit/76acfdd63))

## 1.196.0

### New features

- gql-api: add customs check on query/mutations ([80fc6da3b](https://github.com/mozilla/fxa/commit/80fc6da3b))

### Bug fixes

- shared: don't report NestJS HttpExceptions ([e187a25f7](https://github.com/mozilla/fxa/commit/e187a25f7))
- settings: Moved client email validation to fxa-shared ([db96a7c50](https://github.com/mozilla/fxa/commit/db96a7c50))
- capture GraphQL errors in field resolvers ([007c47833](https://github.com/mozilla/fxa/commit/007c47833))

### Other changes

- deps: updated @sentry/integrations ([9efc0c5bf](https://github.com/mozilla/fxa/commit/9efc0c5bf))
- deps: bump @sentry/node from 5.23.0 to 5.29.1 ([0bc414ad2](https://github.com/mozilla/fxa/commit/0bc414ad2))
- deps: bump redis from 2.8.0 to 3.0.2 ([3edfabfab](https://github.com/mozilla/fxa/commit/3edfabfab))
- deps-dev: bump ts-loader from 8.0.9 to 8.0.12 ([5f342dbca](https://github.com/mozilla/fxa/commit/5f342dbca))
- deps: updated @nestjs/\* deps ([4496c9649](https://github.com/mozilla/fxa/commit/4496c9649))
- deps: bump @nestjs/graphql from 7.7.0 to 7.9.1 ([48c46cbb6](https://github.com/mozilla/fxa/commit/48c46cbb6))

## 1.195.4

No changes.

## 1.195.3

No changes.

## 1.195.2

No changes.

## 1.195.1

### New features

- gql-api: add customs check on query/mutations ([10e0af619](https://github.com/mozilla/fxa/commit/10e0af619))

## 1.195.0

### Other changes

- deps: bump @sentry/browser from 5.27.1 to 5.27.6 ([461dee802](https://github.com/mozilla/fxa/commit/461dee802))

## 1.194.0

### New features

- event-broker: capture error context ([59a6d1530](https://github.com/mozilla/fxa/commit/59a6d1530))

### Other changes

- deps: bump knex from 0.21.4 to 0.21.12 ([7b7222ca1](https://github.com/mozilla/fxa/commit/7b7222ca1))
- deps: bump hot-shots from 7.8.0 to 8.2.0 ([b5c99456d](https://github.com/mozilla/fxa/commit/b5c99456d))
- deps-dev: bump jest from 26.6.1 to 26.6.3 ([239c3e824](https://github.com/mozilla/fxa/commit/239c3e824))
- deps: bump @nestjs/mapped-types from 0.1.0 to 0.1.1 ([e2b3767ef](https://github.com/mozilla/fxa/commit/e2b3767ef))
- deps-dev: bump ts-loader from 8.0.4 to 8.0.9 ([69e5f91f2](https://github.com/mozilla/fxa/commit/69e5f91f2))

## 1.193.1

No changes.

## 1.193.0

### Other changes

- deps-dev: bump ts-jest from 26.1.0 to 26.4.3 ([b6974132f](https://github.com/mozilla/fxa/commit/b6974132f))
- deps: bump @sentry/browser from 5.17.0 to 5.27.1 ([fcc11be76](https://github.com/mozilla/fxa/commit/fcc11be76))
- deps: update node version to 14 ([6c2b253c1](https://github.com/mozilla/fxa/commit/6c2b253c1))
- deps-dev: bump jest from 26.4.2 to 26.6.1 ([f2546787b](https://github.com/mozilla/fxa/commit/f2546787b))
- deps-dev: bump jsdom from 16.2.2 to 16.4.0 ([d892ab883](https://github.com/mozilla/fxa/commit/d892ab883))

## 1.192.0

### New features

- subscriptions: handle 'customer.created' Stripe event ([4134ba197](https://github.com/mozilla/fxa/commit/4134ba197))

### Other changes

- deps: bump @nestjs/graphql from 7.6.0 to 7.7.0 ([69e938f06](https://github.com/mozilla/fxa/commit/69e938f06))
- deps: bump @types/sinon from 9.0.7 to 9.0.8 ([f74dce522](https://github.com/mozilla/fxa/commit/f74dce522))

## 1.191.1

No changes.

## 1.191.0

### Other changes

- deps-dev: bump @types/redis from 2.8.20 to 2.8.27 ([f5e9d0451](https://github.com/mozilla/fxa/commit/f5e9d0451))
- deps: bump @types/sinon from 9.0.5 to 9.0.7 ([253383773](https://github.com/mozilla/fxa/commit/253383773))

## 1.190.1

No changes.

## 1.190.0

### New features

- auth: Add Create/Delete for Account-Customer Relationship ([147bbe3f6](https://github.com/mozilla/fxa/commit/147bbe3f6))
- auth: create script to populate accountCustomers table ([b1dfccf6b](https://github.com/mozilla/fxa/commit/b1dfccf6b))
- settings: emit settings view Amplitude event ([c34a98bd8](https://github.com/mozilla/fxa/commit/c34a98bd8))
- shared: add CRUD methods for maintaining fxa user and customer relationship ([01122d032](https://github.com/mozilla/fxa/commit/01122d032))

## 1.189.1

No changes.

## 1.189.0

### New features

- admin-server: convert to NestJS ([69f44d78e](https://github.com/mozilla/fxa/commit/69f44d78e))

### Refactorings

- db access: 76536e5fe refactor(db access) - Extract direct db access from fxa-graphql-api to fxa-shared ([76536e5fe](https://github.com/mozilla/fxa/commit/76536e5fe))

### Other changes

- fxa-shared: add nestjs module docs ([dd9faea0a](https://github.com/mozilla/fxa/commit/dd9faea0a))
- deps-dev: bump ts-loader from 6.2.2 to 8.0.4 ([c8aff3f11](https://github.com/mozilla/fxa/commit/c8aff3f11))
- deps: fixed yarn dependency warnings ([b32addf86](https://github.com/mozilla/fxa/commit/b32addf86))
- monorepo: move deps to correct sub-packages ([a8cc232b9](https://github.com/mozilla/fxa/commit/a8cc232b9))

## 1.188.1

No changes.

## 1.188.0

### New features

- subscriptions: add product specific app/service support field ([e5c6d77e8](https://github.com/mozilla/fxa/commit/e5c6d77e8))
- fxa-shared: refactor nestjs shared modules ([a9cf3836b](https://github.com/mozilla/fxa/commit/a9cf3836b))

### Refactorings

- fxa-shared: cleanup sentry and add exc route ([4561064c9](https://github.com/mozilla/fxa/commit/4561064c9))

### Other changes

- deps-dev: bump jest from 24.9.0 to 26.4.2 ([fad65917c](https://github.com/mozilla/fxa/commit/fad65917c))

## 1.187.3

No changes.

## 1.187.2

No changes.

## 1.187.1

No changes.

## 1.187.0

No changes.

## 1.186.2

No changes.

## 1.186.1

No changes.

## 1.186.0

### Other changes

- deps: update yarn version and root level deps ([da2e99729](https://github.com/mozilla/fxa/commit/da2e99729))

## 1.185.1

No changes.

## 1.185.0

### Other changes

- update typescript ([245568d56](https://github.com/mozilla/fxa/commit/245568d56))
- dependency updates ([aaa549ed6](https://github.com/mozilla/fxa/commit/aaa549ed6))

## 1.184.1

No changes.

## 1.184.0

No changes.

## 1.183.1

No changes.

## 1.183.0

No changes.

## 1.182.2

No changes.

## 1.182.1

No changes.

## 1.182.0

### Bug fixes

- auth: added exports to fxa-shared package.json ([31c8d650a](https://github.com/mozilla/fxa/commit/31c8d650a))
- payments: de-dupe and correct some differing types between fxa-shared and fxa-payments-server Redux store ([e695bc9fb](https://github.com/mozilla/fxa/commit/e695bc9fb))

### Refactorings

- auth-server: convert subscriptions to TS ([b94d0c99b](https://github.com/mozilla/fxa/commit/b94d0c99b))

## 1.181.2

No changes.

## 1.181.1

No changes.

## 1.181.0

### Other changes

- styles: make subscription icon background configurable as metadata ([ab231fa37](https://github.com/mozilla/fxa/commit/ab231fa37))

## 1.180.1

No changes.

## 1.180.0

### New features

- payments: Support new download URLs for legal links in emails ([28ebf9572](https://github.com/mozilla/fxa/commit/28ebf9572))

## 1.179.4

No changes.

## 1.179.3

No changes.

## 1.179.2

No changes.

## 1.179.1

No changes.

## 1.179.0

### New features

- auth-server: add stripe object filtering ([de82e10d3](https://github.com/mozilla/fxa/commit/de82e10d3))

## 1.178.1

No changes.

## 1.178.0

### Bug fixes

- build: added postinstall to fxa-shared ([39345629b](https://github.com/mozilla/fxa/commit/39345629b))

### Other changes

- deps: update deps ([27cd24c63](https://github.com/mozilla/fxa/commit/27cd24c63))
- l10n: add en-US to shared list of supported locales ([56d735061](https://github.com/mozilla/fxa/commit/56d735061))
- docs: Replace 'master' with 'main' throughout ([20a0acf8b](https://github.com/mozilla/fxa/commit/20a0acf8b))

## 1.177.1

No changes.

## 1.177.0

### New features

- auth-server: use ToS ## 1.176.0 privacy links from Stripe metadata in subplat emails ([6b2817090](https://github.com/mozilla/fxa/commit/6b2817090))

### Bug fixes

- shared: ensure \*.ts tests run ([ea09677c3](https://github.com/mozilla/fxa/commit/ea09677c3))

### Other changes

- deps: updated dependencies ([3fa952919](https://github.com/mozilla/fxa/commit/3fa952919))
- pm2: Add ISO timestamp to pm2 log lines ([2c5630adb](https://github.com/mozilla/fxa/commit/2c5630adb))

## 1.176.0

No changes.

## 1.175.0

### New features

- metrics: add subscription payment source country to Amplitude events ([f60887595](https://github.com/mozilla/fxa/commit/f60887595))

## 1.174.2

No changes.

## 1.174.1

No changes.

## 1.174.0

### New features

- settings-redesign: add settings_version event property for fxa_pref amplitude events ([06a02d586](https://github.com/mozilla/fxa/commit/06a02d586))

### Bug fixes

- local-dev: added fxa-shared and fxa-react to pm2 ([c3780546b](https://github.com/mozilla/fxa/commit/c3780546b))

### Refactorings

- l10n: update supported languages ([2d0e5ba21](https://github.com/mozilla/fxa/commit/2d0e5ba21))

## 1.173.0

### Bug fixes

- build: fix paths to fxa-shared ([21fe09b72](https://github.com/mozilla/fxa/commit/21fe09b72))
- docker: removed need for fxa-shared postinstall script ([b3b3d2c0e](https://github.com/mozilla/fxa/commit/b3b3d2c0e))

### Refactorings

- tsconfig: consolidate common tsconfig options ([e565285b7](https://github.com/mozilla/fxa/commit/e565285b7))
- packages: use workspace references ([81575019a](https://github.com/mozilla/fxa/commit/81575019a))

### Other changes

- deps: update some dependencies ([fec460f6d](https://github.com/mozilla/fxa/commit/fec460f6d))
- format: mass reformat with prettier 2 and single config ([cc595fc2b](https://github.com/mozilla/fxa/commit/cc595fc2b))

## 1.172.2

No changes.

## 1.172.1

No changes.

## 1.172.0

### New features

- cad: Add metrics for the CAD via QR code ([2f9729154](https://github.com/mozilla/fxa/commit/2f9729154))

## 1.171.1

No changes.

## 1.171.0

### Bug fixes

- deps: Upgrade mocha to resolve yargs-parser nsp advisory 1500 ([8246673ba](https://github.com/mozilla/fxa/commit/8246673ba))

## 1.170.3

No changes.

## 1.170.2

No changes.

## 1.170.1

No changes.

## 1.170.0

### New features

- newsletters: Add newsletters experiment metrics ([134a7fea3](https://github.com/mozilla/fxa/commit/134a7fea3))
- settings: add sentry setup ([9a9aaade7](https://github.com/mozilla/fxa/commit/9a9aaade7))

### Bug fixes

- l10n: temporary (hopefully) fix for l10n CI build ([90c407f5e](https://github.com/mozilla/fxa/commit/90c407f5e))

### Other changes

- all: update readmes across all packages to improve testing documentation ([099163e94](https://github.com/mozilla/fxa/commit/099163e94))

## 1.169.3

No changes.

## 1.169.2

No changes.

## 1.169.1

No changes.

## 1.169.0

No changes.

## 1.168.3

No changes.

## 1.168.2

No changes.

## 1.168.1

No changes.

## 1.168.0

### New features

- docker: created fxa-builder docker image ([d4da8a360](https://github.com/mozilla/fxa/commit/d4da8a360))
- metrics: transform a "raw" Amplitude event into a HTTP payload ([ee5df17c6](https://github.com/mozilla/fxa/commit/ee5df17c6))

### Other changes

- cleanup: Remove the `marketingOptIn` param ([8a1446d43](https://github.com/mozilla/fxa/commit/8a1446d43))

## 1.167.1

No changes.

## 1.167.0

### Refactorings

- config: replace 127.0.0.1 with localhost ([1dd1b038d](https://github.com/mozilla/fxa/commit/1dd1b038d))

## 1.166.2

No changes.

## 1.166.1

No changes.

## 1.166.0

### Bug fixes

- coverage: Report coverage ([d42aef600](https://github.com/mozilla/fxa/commit/d42aef600))
- metrics: update language property on Amplitude schema ([4f2c4493b](https://github.com/mozilla/fxa/commit/4f2c4493b))

### Refactorings

- emails: move all email normalization and equality checks to helper functions ([ce1930f4b](https://github.com/mozilla/fxa/commit/ce1930f4b))

## 1.165.1

No changes.

## 1.165.0

### New features

- metrics: validate Amplitude events with a JSON schema ([63dadbc2c](https://github.com/mozilla/fxa/commit/63dadbc2c))

## 1.164.1

No changes.

## 1.164.0

No changes.

## 1.163.2

No changes.

## 1.163.1

No changes.

## 1.163.0

### Other changes

- deps: updated fxa-shared deps and added vuln exception for minimist ([595d424f3](https://github.com/mozilla/fxa/commit/595d424f3))

## 1.162.3

No changes.

## 1.162.2

No changes.

## 1.162.1

No changes.

## 1.162.0

### Bug fixes

- monorepo: update default node version across packages ([0f2d54071](https://github.com/mozilla/fxa/commit/0f2d54071))

### Refactorings

- ci: major refactor of CircleCI workflow ([7e77b0a29](https://github.com/mozilla/fxa/commit/7e77b0a29))

### Other changes

- deps: Updates to address nsp advisory 1488 ([e47bc55ba](https://github.com/mozilla/fxa/commit/e47bc55ba))

## 1.161.2

No changes.

## 1.161.1

No changes.

## 1.161.0

No changes.

## 1.160.1

No changes.

## 1.160.0

No changes.

## 1.159.0

### Bug fixes

- metrics: add Amplitude events for /pair on content server ([a345e36bc](https://github.com/mozilla/fxa/commit/a345e36bc))

## 1.158.1

No changes.

## 1.158.0

### Bug fixes

- deps: Ignore hoek nsp warning https://npmjs.com/advisories/1468 ([6c0edfa9c](https://github.com/mozilla/fxa/commit/6c0edfa9c))

## 1.157.0

No changes.

## 1.156.0

No changes.

## 1.155.0

### Refactorings

- git: merge all package gitignores into single root-level gitignore (a238c3d27)

## 1.154.0

No changes.

## 1.153.0

### New features

- metrics: add Amplitude events for subscription upgrades (d5acb5a65)

## 1.152.1

No changes.

## 1.152.0

No changes.

## 1.151.5

No changes.

## 1.151.4

No changes.

## 1.151.3

No changes.

## 1.151.2

No changes.

## 1.151.1

### Bug fixes

- emails: Add email templates for adding secondary email, recovery key, and both after account verified (7e329ffb3)

## 1.151.0

### New features

- sign-up: validate email domain with DNS (3facc9c30)
- audit: run npm audit on push instead of in ci (ccd3c2b07)
- metrics: Allow RPs to submit a generic 'engage' event to amplitude (9cfd5ec79)

### Other changes

- monorepo: eslint consolidation (0a5e3950f)

## 1.150.9

No changes.

## 1.150.8

No changes.

## 1.150.7

No changes.

## 1.150.6

No changes.

## 1.150.5

No changes.

## 1.150.4

No changes.

## 1.150.3

No changes.

## 1.150.2

### New features

- metrics: Allow RPs to submit a generic 'engage' event to amplitude (e6653e5af)

## 1.150.1

No changes.

## 1.150.0

### New features

- experiments: Add experiments support in fxa-shared (c17e6c754)

### Bug fixes

- payments: correctly append event time to amplitude events (9163183e8)
- metrics: Add metrics for recovery key, emails, and 2FA (fedc92bcc)
- payments: Append time property to amplitude events (6c3fe91c4)

## 1.149.4

### Bug fixes

- payments: correctly append event time to amplitude events (ec04e7e82)

## 1.149.3

No changes.

## 1.149.2

No changes.

## 1.149.1

### Bug fixes

- payments: Append time property to amplitude events (07b01d9ca)
- metrics: Add metrics for recovery key, emails, and 2FA (4d69b9b93)

## 1.149.0

### New features

- metrics: add flow perf metrics to payments server pages (b99457e70)
- payments: complete post-metrics endpoint (4ef358149)

### Bug fixes

- metrics: Update app_version to send complete train version number (6f698a6ce)

### Refactorings

- routes: Extract Express routing helpers into fxa-shared (e471b29c2)

## 1.148.8

No changes.

## 1.148.7

No changes.

## 1.148.6

No changes.

## 1.148.5

No changes.

## 1.148.4

### New features

- payments: complete post-metrics endpoint (f7998ad02)

## 1.148.3

No changes.

## 1.148.2

### New features

- metrics: add product_id and plan_id to more amplitude events (ed501fa1c)

### Other changes

- release: Merge branch 'train-147' into train-148-merge-147 (66e170d45)

## 1.148.1

No changes.

## 1.148.0

### New features

- add vscode tasks for running tests and debugger (dac5e8b98)

## 1.147.5

No changes.

## 1.147.4

No changes.

## 1.147.3

No changes.

## 1.147.2

No changes.

## 1.147.1

No changes.

## 1.147.0

### Bug fixes

- docs: update feature-flag readme with monorepo details (f9a49a667)

## 1.146.4

No changes.

## 1.146.3

No changes.

## 1.146.2

No changes.

## 1.146.1

No changes.

## 1.146.0

### New features

- metrics: add support form metrics (b9e7e08df)

### Other changes

- deps: fxa-shared npm audit changes (c8dd3862f)

## 1.145.5

No changes.

## 1.145.4

No changes.

## 1.145.3

No changes.

## 1.145.2

No changes.

## 1.145.1

No changes.

## 1.145.0

### New features

- metrics: add subscription events and new top funnel event (0224188c3)
- metrics: change name of button event (16f553bba)
- metrics: allow get-metrics-flow to take form_type button (1304e1b2b)

### Bug fixes

- build: fixed fxa-shared build on `npm install` (be709e07d)

### Other changes

- ts: convert fxa-shared/l10n/localizeTimestamp to typescript (99f3fce63)
- ts: prepare fxa-shared for conversion to typescript (e4c7eef42)

## 1.144.4

No changes.

## 1.144.3

No changes.

## 1.144.2

No changes.

## 1.144.1

### New features

- metrics: change name of button event (c4a9e398b)
- metrics: allow get-metrics-flow to take form_type button (c49f6ee76)

## 1.144.0

### Bug fixes

- deps: use ../ paths to fxa-shared and fxa-geodb in content server (9669cc946)

### Other changes

- scripts: add fxa-shared and fxa-geodb to the release script (3920a7b74)

## 1.143.4

Prehistoric.

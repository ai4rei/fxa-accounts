/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Firestore } from '@google-cloud/firestore';
import {
  MozillaSubscriptionTypes,
  SubscriptionType,
} from 'fxa-shared/subscriptions/types';
import { Container } from 'typedi';
import { TypedCollectionReference } from 'typesafe-node-firestore';

import { AppConfig, AuthFirestore, AuthLogger } from '../../types';
import { SubscriptionPurchase as AppStoreSubscriptionPurchase } from './apple-app-store/subscription-purchase';
import { SubscriptionPurchase as PlayStoreSubscriptionPurchase } from './google-play/subscription-purchase';
import { IapConfig } from './types';

export function getIapPurchaseType(
  purchase: PlayStoreSubscriptionPurchase | AppStoreSubscriptionPurchase
): Omit<SubscriptionType, typeof MozillaSubscriptionTypes.WEB> {
  if (purchase instanceof PlayStoreSubscriptionPurchase) {
    return MozillaSubscriptionTypes.IAP_GOOGLE;
  }
  if (purchase instanceof AppStoreSubscriptionPurchase) {
    return MozillaSubscriptionTypes.IAP_APPLE;
  }
  throw new Error('Purchase is not recognized as either Google or Apple IAP.');
}

export class IAPConfig {
  private firestore: Firestore;
  private log: AuthLogger;
  private iapConfigDbRef: TypedCollectionReference<IapConfig>;
  private prefix: string;

  constructor() {
    this.log = Container.get(AuthLogger);

    const { authFirestore } = Container.get(AppConfig);
    this.prefix = `${authFirestore.prefix}iap-`;
    this.firestore = Container.get(AuthFirestore);
    this.iapConfigDbRef = this.firestore.collection(
      `${this.prefix}iap-config`
    ) as TypedCollectionReference<IapConfig>;
  }

  /**
   * Fetch the Play Store/App Store plans for Android/iOS client usage.
   */
  public async plans(appName: string) {
    const doc = await this.iapConfigDbRef.doc(appName).get();
    if (doc.exists) {
      return doc.data()?.plans;
    } else {
      throw Error(`IAP Plans document does not exist for ${appName}`);
    }
  }

  /**
   * Fetch the Google Play packageName for the given appName.
   */
  public async packageName(appName: string) {
    // TODO: use a cached version of the iap config
    const doc = await this.iapConfigDbRef.doc(appName).get();
    if (doc.exists) {
      return doc.data()?.packageName;
    } else {
      throw Error(`IAP Plans document does not exist for ${appName}`);
    }
  }

  /**
   * Fetch the App Store bundleId for the given appName.
   */
  public async getBundleId(appName: string) {
    // TODO: use a cached version of the iap config
    const doc = await this.iapConfigDbRef.doc(appName).get();
    if (doc.exists) {
      return doc.data()?.bundleId;
    } else {
      throw Error(`IAP Plans document does not exist for ${appName}`);
    }
  }
}

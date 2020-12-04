/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import Account from './Account';
import './index.scss';

interface AccountType {
  uid: any;
  createdAt: number;
  emails: [
    {
      email: string;
      isVerified: boolean;
      isPrimary: boolean;
      createdAt: number;
    }
  ];
  emailBounces: [
    {
      email: string;
      createdAt: number;
      bounceType: string;
      bounceSubType: string;
    }
  ];
  totp: [
    {
      verified: boolean;
      createdAt: number;
      enabled: boolean;
    }
  ];
  recoveryKeys: [
    {
      createdAt: number;
      verifiedAt: number;
      enabled: boolean;
    }
  ];
  sessionTokens: [
    {
      tokenId: string;
      tokenData: string;
      uid: string;
      createdAt: number;
      uaBrowser: string;
      uaBrowserVersion: string;
      uaOS: string;
      uaOSVersion: string;
      uaDeviceType: string;
      lastAccessTime: number;
    }
  ];
}

export const GET_ACCOUNT_BY_EMAIL = gql`
  query getAccountByEmail($email: String!) {
    accountByEmail(email: $email) {
      uid
      createdAt
      emails {
        email
        isVerified
        isPrimary
        createdAt
      }
      emailBounces {
        email
        createdAt
        bounceType
        bounceSubType
      }
      totp {
        verified
        createdAt
        enabled
      }
      recoveryKeys {
        createdAt
        verifiedAt
        enabled
      }
      sessionTokens {
        tokenId
        tokenData
        uid
        createdAt
        uaBrowser
        uaBrowserVersion
        uaOS
        uaOSVersion
        uaDeviceType
        lastAccessTime
      }
    }
  }
`;

// new query for getting account by UID
export const GET_ACCOUNT_BY_UID = gql`
  query getAccountByUid($uid: String!) {
    accountByUid(uid: $uid) {
      uid
      createdAt
      emails {
        email
        isVerified
        isPrimary
        createdAt
      }
      emailBounces {
        email
        createdAt
        bounceType
        bounceSubType
      }
      totp {
        verified
        createdAt
        enabled
      }
      recoveryKeys {
        createdAt
        verifiedAt
        enabled
      }
      sessionTokens {
        tokenId
        tokenData
        uid
        createdAt
        uaBrowser
        uaBrowserVersion
        uaOS
        uaOSVersion
        uaDeviceType
        lastAccessTime
      }
    }
  }
`;

export const AccountSearch = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showResult, setShowResult] = useState<Boolean>(false);
  const [suggestions, setSuggestion] = useState<Array<String>>([]);
  const [text, setText] = useState<String>('');
  const [getAccount, { loading, error, data, refetch }] = useLazyQuery(
    inputValue.search('@') == -1 ? GET_ACCOUNT_BY_UID : GET_ACCOUNT_BY_EMAIL // check if searching email or uid
  );

  const items = [
    'test@yahoo.com',
    '123@gmail.com',
    'hello@hello.com',
    'test@gmail.com',
    'flowers@hotmail.com',
    'ece496@outlook.ca',
    'hello_world@hotmail.com',
  ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // choose correct query if email or uid
    if (inputValue.search('@') == -1 && inputValue != '') {
      // uid and non-empty
      getAccount({ variables: { uid: inputValue } });
      setShowResult(true);
    } else if (inputValue.search('@') != -1 && inputValue != '') {
      // email and non-empty
      getAccount({ variables: { email: inputValue } });
      setShowResult(true);
    }
    // Don't hide after the first result is shown
    else setShowResult(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setSuggestion([]);
    onTextChanged(event);
  };

  const onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = items.sort().filter((v) => regex.test(v));
    }
    setSuggestion(suggestions);
    setInputValue(event.target.value);
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map((item) => (
          <li onClick={() => suggestionSelected(item)}>{item}</li>
        ))}
      </ul>
    );
  };

  const suggestionSelected = (inputValue) => {
    setInputValue(inputValue);
    setSuggestion([]);
  };

  return (
    <div className="account-search" data-testid="account-search">
      <h2>Account Search</h2>

      <p>
        This page searches for an account by email or UID and displays its
        details, including: secondary emails, email bounces, time-based one-time
        passwords, recovery keys, and information on the current user session.
      </p>
      <br />
      <p>
        Email addresses are blocked from the FxA email sender when an email sent
        to the address has bounced. Remove an email address from the blocked
        list by first searching for an account by email. Brief account
        information will be displayed as well as email bounces attached to the
        account. Delete the block on the email by deleting the bounced email
        data.
      </p>

      <form onSubmit={handleSubmit} data-testid="search-form" className="flex">
        <label htmlFor="email">Email or UID to search for:</label>
        <br />
        <input
          autoFocus
          autoComplete="off"
          value={inputValue}
          name="email"
          type="search"
          onChange={handleChange}
          placeholder="hello@world.com or UID"
          data-testid="email-input"
        />
        <div className="suggestions-list">{renderSuggestions()}</div>
        <button
          className="account-search-search-button"
          title="search"
          data-testid="search-button"
        ></button>
      </form>

      {showResult && refetch ? (
        <>
          <hr />
          <AccountSearchResult
            onCleared={refetch}
            {...{
              loading,
              error,
              data,
              query: inputValue,
            }}
          />
        </>
      ) : null}
    </div>
  );
};

const AccountSearchResult = ({
  onCleared,
  loading,
  error,
  data,
  query,
}: {
  onCleared: Function;
  loading: boolean;
  error?: {};
  data?: {
    accountByEmail: AccountType;
    accountByUid: AccountType;
  };
  query: string;
}) => {
  if (loading) return <p data-testid="loading-message">Loading...</p>;
  if (error) return <p data-testid="error-message">An error occurred.</p>;

  if (data?.accountByEmail) {
    return <Account {...{ query, onCleared }} {...data.accountByEmail} />;
  }
  if (data?.accountByUid) {
    return <Account {...{ query, onCleared }} {...data.accountByUid} />;
  }
  return <p data-testid="no-account-message">Account not found.</p>;
};

export default AccountSearch;

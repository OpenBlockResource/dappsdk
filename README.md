# OpenBlock DApp SDK

OpenBlock SDK is an open-source SDK that allows you to connect your DApps to our users, their assets and NFTs. We currently support major EVM chains, Aptos, Starcoin and more. Login to [openblock.com](https://openblock.com) for more details.

## Introduction

- OpenBlock is a next-gen on-chain wallet committed to MPC protocol, keyless, seedless, and pushing security limits through distributed credentials and wallet recovery mechanisms.  


## Install 

```shell
yarn add @openblockhq/dappsdk
```

## Using SDK

### Ethereum

```Javascript
import '@openblockhq/dappsdk';

window.addEventListener('DOMContentLoaded', () => {
  const provider = window.openblock;

  // Config
  provider.autoRefreshOnNetworkChange = false;

  // On Chain Changed
  provider.on('chainChanged', (chain) => {
    // handler
  });

  // On Accounts Changed
  provider.on('accountsChanged', (accounts) => {
    // handler
  });

  // Request Accounts
  const accounts = await provider.request({
    method: 'eth_requestAccounts',
  });

  // Chain ID
  const chainId = await provider.request({
    method: 'eth_chainId',
  });

  // Net Version
  const networkId = await provider.request({
    method: 'net_version',
  });

  // Get Block By Number
  const block = await provider.request({
    method: 'eth_getBlockByNumber'
  });

  // Switch Ethereum Chain
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId,
      }
    ]
  });

  // Send Transaction
  await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from,
        to,
        value,
        gasLimit,
        gasPrice,
        type,
        data,
      }
    ]
  });

  // Add Ethereum Chain
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId,
        rpcUrls: [
          'https://http-mainner-node.huobichain.com',
          'https://http-mainner.hecochain.com',
        ],
        chainName: 'Huobi ECO Chain',
        nativeCurrency: { name: 'HECO', decimals: '18', symbol: 'HT' },
        blockExplorerUrls: ['https://hecoinfo.com'],
      }
    ]
  });

  // Sign
  await provider.request({
    method: 'eth_sign',
    params: ['accounts', 'msg'],
  });

  // Personal Sign
  await provider.request({
    method: 'personal_sign',
    params: ['msg', 'from'],
  });

  //  eth_signTypedData_v4
  await provider.request({
    method: 'eth_signTypedData_v4',
    params: ['accounts','typedata msg'],
  });

  // Personal Sign Verify
  await provider.request({
    method: 'personal_ecRecover',
    params: ['msg', 'sign'],
  });
});
```
### Aptos

```Javascript
import '@openblockhq/dappsdk';

window.addEventListener('DOMContentLoaded', () => {
  const provider = window.openblock.aptos;

  // connect 
  const account = await provider.connect();

  // Sign And Submit Transaction
  await provider.signAndSubmitTransaction({
    type: 'entry_function_payload',
    function: '0x1::managed_coin::register',
    arguments: [],
    type_arguments: [
      'address::move_coin::MoveCoin',
    ],
  });

  // Sign Message
  const signed = await provider.signMessage({
    address: true,
    application: true,
    chainId: true,
    message: 'hello world!',
    nonce: 888,
  });

  // Get Account
  const account = await provider.account();

  // Get Network
  const network = await provider.network();

  // Disconnect
  await provider.disconnect();

  // Check isConnected
  await provider.isConnected();

  // On Account Change
  await provider.onAccountChange((account) => {
    // handler
  });

  // On Network Change
  await provider.onNetworkChange((network) => {
    // handler
  });
});
```

### Starcoin

```Javascript
import '@openblockhq/dappsdk';
import { providers } from '@starcoin/starcoin';

window.addEventListener('DOMContentLoaded', () => {
  const provider = new providers.Web3Provider(window.obstarcoin, 'any');

  // Config
  window.obstarcoin.autoRefreshOnNetworkChange = false;

  // On Chain Changed
  window.obstarcoin.on('chainChanged', () => {
    // handler
  });

  // On Network Changed
  window.obstarcoin.on('networkChanged', () => {
    // handler
  });

  // On Accounts Changed
  window.obstarcoin.on('accountsChanged', () => {
    // handler
  });

  // Connect
  window.obstarcoin.request({
    method: 'stc_requestAccounts',
  });

  // Get Accounts
  const accounts = await window.obstarcoin.request({
    method: 'stc_accounts',
  });

  // Get Chain
  const chainInfo = await window.obstarcoin.request({
    method: 'chin.id',
  });

  // Request Permissions
  const permissions = await window.obstarcoin.request({
    method: 'wallet_requestPermission',
    params: [{ stc_accounts: {} }]
  });

  // Get Permissions
  const permissions = await window.obstarcoin.request({
    method: 'wallet_getPermissions',
  });

  // Resolve Functions
  const funcInfo = await window.obstarcoin.request({
    method: 'contract.resolve_function',
    params: [functionId]
  });

  // Resolve Module
  const moduleInfo = await window.obstarcoin.request({
    method: 'contract.resolve_module',
    params: [moduleId],
  });

  // Personal Sign
  const sign = await window.obstarcoin.request({
    method: 'personal_sign',
    params: [msg, from , extraParams]
  });

  // Get Encryption Key
  const key = await window.obstarcoin.request({
    method: 'stc_getEncryptionPublicKey',
    params: [accounts[0]]
  });

  // Auto Accept Token
  const result = await window.obstarcoin.request({
    method: 'state.get_resource',
    params: [accounts[0], '0x1::Account::AutoAcceptToken'],
  });

  // Send Transaction
  const hash = await provider
    .getSigner()
    .sendUncheckedTransaction({
      to,
      value,
      gasPrice,
    });

  // Get Transaction
  const transaction = await provider.getTransactionInfo(transactionHash);

  // Get Token Address
  const result = await provider.call({
    function_id: `${accounts[0]}::ABC::token_address`,
    type_args: [];
    args: [],
  });

  // Call Function
  const result = await provider.send('contract.call_v2', [
    {
      function_id,
      type_args,
      args,
    },
  ]);
});
```


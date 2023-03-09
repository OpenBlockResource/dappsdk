import mitt from 'mitt';
import { SUI_CHAINS, ReadonlyWalletAccount } from '@mysten/wallet-standard';

class openBlockInpageProvider {
  constructor(walletRef) {
    this.walletRef = walletRef;
    this.walletProvider = 'suiWallet';

    this._events = mitt();
    this.isOpenBlock = () => true;

    this.requestPermissions = this.requestPermissions.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.signAndExecuteTransaction = this.signAndExecuteTransaction.bind(this);
    this.executeMoveCall = this.executeMoveCall.bind(this);
    this.executeSerializedMoveCall = this.executeSerializedMoveCall.bind(this);
    this._connect = this._connect.bind(this);
  }

  get version() {
    return '1.0.0';
  }

  get name() {
    return 'OpenBlock';
  }

  get icon() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHZpZXdCb3g9IjAgMCA1NSA1NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjU1IiBoZWlnaHQ9IjU1IiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0zNi44MTQ3IDEwLjc3NTFDNDMuNTQ0NSAxMC43NzUxIDQ5IDE2LjIzMDYgNDkgMjIuOTYwNFYyMy4yNDc2TDQ0Ljc0NDIgMjcuNUw0OSAzMS43NDgzVjMyLjAzOTZDNDkgMzguNzY5NCA0My41Mzk5IDQ0LjIyNDkgMzYuODEwMiA0NC4yMjQ5SDUuOTg4NTNMMTUuODQ0NSAzNy4xMTAzTDMyLjI3NTEgMzcuMjMwN0MzNy41NTMzIDM3LjIz MDcgNDEuOTAzMSAzMi43NzgyIDQxLjkwMzEgMjcuNUM0MS45MDMxIDIyLjIyMTggMzcuNTUzMyAxNy43NjEgMzIuMjc1MSAxNy43NjFIMTUuODQ0NUw1Ljk5MzA4IDEwLjc3NTFIMzYuODE0N1oiIGZpbGw9IiM0QTNERTYiLz4KPHBhdGggZD0iTTE4LjEzODQgMjMuNDM4MkMxNS44OTUyIDIzLjQzODIgMTQuMDc2NyAyNS4yNTY3IDE0LjA3NjcgMjcuNDk5OUMxNC4wNzY3IDI5Ljc0MzIgMTUuODk1MiAzMS41NjE3IDE4LjEzODQgMzEuNTYxN0gzMi4yODkyQzM0LjUzMjUgMzEuNTYxNyAzNi4zNTEgMjkuNzQzMiAzNi4zNTEgMjcuNDk5OUMzNi4zNTEgMjUuMjU2NyAzNC41MzI1IDIzLjQzODIgMzIuMjg5MiAyMy40MzgySDE4LjEzODRaIiBmaWxsPSIjNEEzREU2Ii8+Cjwvc3ZnPgo=';
  }

  get chains() {
    return SUI_CHAINS;
  }

  async _connect() {
    console.log('suiProvider::_connect');
    const address = await this.requestPermissions();

    if (address) {
      if (!this._accounts || this._accounts.address !== address) {
        this._accounts = new ReadonlyWalletAccount({
          address,
          // TODO: Expose public key instead of address
          publicKey: new Uint8Array(),
          chains: SUI_CHAINS,
          features: ['sui:signAndExecuteTransaction'],
        });
        this._events.emit('change', { accounts: this._accounts });
      }
    }

    return { accounts: this._accounts };
  }

  get features() {
    return {
      'standard:connect': {
        version: '1.0.0',
        connect: this._connect,
      },
      'standard:events': {
        version: '1.0.0',
        on: (event, listener) => {
          console.log(
            'suiProvider::standard:events, event:',
            event,
            'listener:',
            listener,
          );
          this._events.on(event, listener);
          return () => this._events.off(event, listener);
        },
      },
      'sui:signAndExecuteTransaction': {
        version: '1.0.0',
        signAndExecuteTransaction: this.signAndExecuteTransaction,
      },
    };
  }

  get accounts() {
    return this._accounts ? [this._accounts] : [];
  }

  requestPermissions(permissions) {
    return this._hookRequest({
      method: 'sui_requestAccounts',
      params: permissions,
    });
  }

  getAccounts() {
    return this._hookRequest({
      method: 'sui_accounts',
    });
  }

  signAndExecuteTransaction(transaction) {
    return this._hookRequest({
      method: 'sui_signAndExecuteTransaction',
      params: {
        type: 'v2',
        data: transaction,
      },
    });
  }

  executeMoveCall(transaction) {
    return this._hookRequest({
      method: 'sui_signAndExecuteTransaction',
      params: {
        type: 'move-call',
        data: transaction,
      },
    });
  }

  executeSerializedMoveCall(transaction) {
    const data =
      typeof transaction === 'string'
        ? transaction
        : Buffer.from(transaction).toString('base64');
    return this._hookRequest({
      method: 'sui_signAndExecuteTransaction',
      params: {
        type: 'serialized-move-call',
        data,
      },
    });
  }

  _hookRequest(paramsObj) {
    if (typeof paramsObj === 'string') {
      paramsObj = {
        method: paramsObj,
      };
    }
    paramsObj = {
      ...paramsObj,
      provider: this.walletProvider,
    };
    return this.walletRef.hookRequest(paramsObj);
  }
}

export default openBlockInpageProvider;

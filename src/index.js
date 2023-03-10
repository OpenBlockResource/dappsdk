import OpenBlockAlert from './alert';
import aptosProvider from './aptos.js';
// import suiProvider from './sui';
import tronProvider from './tron';
import {
  StarCoinProvider,
  AuthActions,
  FIXED_SPACE_WIDTH,
  OPENBLOCK_SDK_WIDTH,
  OPENBLOCK_SDK_HEIGHT,
  OPENBLOCK_SDK_MOBILE_HEIGHT,
} from './consts';
class OpenBlock {
  constructor(provider) {
    this.callBackList = {};
    this.provider = provider;
    this.targetOrigin =
      {
        prod: 'https://openblock.com',
        fat: 'https://fat.openblock.vip',
        uat: 'https://uat.openblock.vip',
        dev: 'https://dev.openblock.vip',
        dev1: 'https://dev1.openblock.vip',
        dev2: 'https://dev2.openblock.vip',
        dev3: 'https://dev3.openblock.vip',
        dev4: 'https://dev4.openblock.vip',
        dev5: 'https://dev5.openblock.vip',
        local: 'http://localhost:3000',
      }[ENV] || 'http://localhost:3000';
    this.targetURL = `${this.targetOrigin}/?t=${Math.random()}#/home`;
    this.authActions = AuthActions;
    this.dappInfo = {
      origin: window.location.origin,
      href: window.location.href,
      icon: '',
      channel: 'dappsdk',
    };
    this._initDappListener();
    this._initOpenBlockIFrame();
    this.isMetaMask = true;
    this.isStarMask = true;
    this.isOpenBlock = true;
    this.isOpenBlockDappSDK = true;
    this.isLogin = false;
    this.theme = 'light';
    this.eventListener = {};
    this._metamask = this._getExperimentalApi();
    this.sdkLoaded = false;
    this.version = '23022700';
    this.accountIsValid = true;
    this.aptos = new aptosProvider(this);
    // this.sui = new suiProvider(this);
    this.tron = new tronProvider(this);
    this.onSDKLoadedCbk;
    this.onSDKLoaded = this.onSDKLoaded.bind(this);
    this.on = this.on.bind(this);
  }

  _initOpenBlockIFrame() {
    console.log('_initOpenBlockIFrame');
    let iframeWidth = OPENBLOCK_SDK_WIDTH ;
    let iframeHeight = OPENBLOCK_SDK_HEIGHT ;
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;
    if (clientWidth < OPENBLOCK_SDK_WIDTH +  FIXED_SPACE_WIDTH * 2) {
      iframeWidth = clientWidth - FIXED_SPACE_WIDTH * 2;
    }
    if (clientHeight < OPENBLOCK_SDK_HEIGHT) {
      iframeHeight = OPENBLOCK_SDK_MOBILE_HEIGHT;
    }
    this.openblockIFrame = new OpenBlockAlert({
      width: iframeWidth,
      height: iframeHeight,
      title: '',
      url: this.targetURL,
      hide:()=>{
        this.currentAuthActionMethod = '';
      },
      initComplate: () => {
        this.sdkLoaded = true;
        if (this.onSDKLoadedCbk) {
          this.onSDKLoadedCbk(true);
        }
        const handles = this.eventListener['sdkLoaded'];
        if (!handles) return;
        handles.forEach((func) => {
          func(true);
        });
      },
    });
   
     
    window.onresize = () => {
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth < OPENBLOCK_SDK_WIDTH +  FIXED_SPACE_WIDTH * 2) {
        iframeWidth = clientWidth - FIXED_SPACE_WIDTH * 2;
      } else {
        iframeWidth = OPENBLOCK_SDK_WIDTH
      }
      this.openblockIFrame.alertLayer.style.width = iframeWidth;
      this.openblockIFrame.landingLayer.style.width = iframeWidth;
    };
    let timer = setInterval(() => {
      if (this.sdkLoaded) {
        this.hideLandingLayer();
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }

  hideLandingLayer() {
    this.openblockIFrame.hideLandingLayer();
  }
  
  setTheme() {
    this.openblockIFrame.setTheme(this.theme, this.isLogin, this.sdkLoaded);
  }

  _getExperimentalApi() {
    return new Proxy(
      {
        isUnlocked: () => new Promise((resolve) => resolve(true)),
      },
      {
        get: (obj, prop, ...args) => {
          return Reflect.get(obj, prop, ...args);
        },
      }
    );
  }

  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  }

  activateOpenBlock(isLogin) {
    this.openblockIFrame.show(isLogin);
  }

  async enable() {
    if (this.provider !== 'starcoin') {
      const res = await this._hookRequest({ method: 'eth_accounts' });
      if (res.length) {
        return new Promise((resolve) => resolve(res));
      }
      return this.request({ method: 'eth_requestAccounts' });
    }
  }

  onSDKLoaded(callback) {
    this.onSDKLoadedCbk = callback;
  }

  on(event, callback) {
    if (typeof event !== 'string' || typeof callback !== 'function') {
      return;
    }
    if (this.eventListener[event] && this.eventListener[event].length > 5) {
      return;
    } else if (this.eventListener[event]) {
      this.eventListener[event].push(callback);
      this.eventListener[event] = Array.from(
        new Set(this.eventListener[event]),
      );
    } else if (!this.eventListener[event]) {
      this.eventListener = {
        ...this.eventListener,
        [event]: [callback],
      };
    }
    this._registerEvent(event);
  }

  _registerEvent(event) {
    let value = {
      dappInfo: this.dappInfo,
      provider: this.provider,
      mark: {
        eventName: event,
        type: 'register_event',
      },
      eventName: event,
    };
    if (this.openblockIFrame.contentWindow) {
      this.openblockIFrame.contentWindow.postMessage(
        {
          from: window.location.origin,
          chanel: 'dappsdk',
          target: 'openblock',
          data: value,
          value,
        },
        '*',
      );
    }
  }

  executeReq(params) {
    if (this.sdkLoaded) {
      this.hideLandingLayer();
    }
    const { execParams, ps } = params;
    const { method } = execParams.data;
    if (!method) {
      return;
    }
    if (!this.openblockIFrame.contentWindow) {
      return;
    }

    this.openblockIFrame.contentWindow.postMessage(execParams, '*');
    if (this.authActions.includes(method)) {
      this.setTheme();
      this.currentAuthActionMethod = method;
      setTimeout(() => {
        this.activateOpenBlock(this.isLogin);
      }, 0);
    }
    return ps;
  }

  buildReq(paramsObj) {
    const _guid = this.guid();
    let execParams = {};
    if (typeof paramsObj === 'string') {
      execParams = {
        method: paramsObj,
      };
    }
    execParams = {
      dappInfo: this.dappInfo,
      ...paramsObj,
      mark: {
        id: _guid,
        method: paramsObj.method,
      },
    };
    execParams = {
      from: window.location.origin,
      chanel: 'dappsdk',
      target: 'openblock',
      data: execParams,
    };
    const ps = new Promise((resolve) => {
      this.callBackList[_guid] = resolve;
    });
    return { ps, execParams };
  }

  async send(...params) {
    if (typeof params[1] === 'function') {
      this.sendAsync(params[0], params[1]);
      return;
    }
    if (typeof params[0] === 'string') {
      const res = await this.request({ method: params[0], params: params[1] });
      return res;
    }
    if (params.length === 1) {
      const res = await this.request(params);
      return res;
    }
  }

  async sendAsync(...paramsArr) {
    const paramsObj = {
      method: paramsArr[0].method,
      params: paramsArr[0].params,
    };
    const request_id = paramsArr[0].id;
    this.request(paramsObj)
      .then((res) => {
        paramsArr[1](null, { id: request_id, jsonrpc: '2.0', result: res });
      })
      .catch((error) => {
        paramsArr[1](null, { id: request_id, jsonrpc: '2.0', error });
      });
  }

  async request(params) {
    console.log('request--', params);
    if (this.provider === 'starcoin') {
      this.chainId = '0x1';
      this.networkVersion = '1';
      if (params.method === 'chain.id' || params.method === 'chain.info') {
        return { id: 1 };
      }
      if (params.method.startsWith('eth_')) {
        return {};
      }
    }
    params.provider = this.provider;
    const res = await this.hookRequest(params);
    return res;
  }

  checkAccountVaild() {
    const params = this.buildReq({ method: 'openblock_account_isValid' });
    this.executeReq(params);
  }

  async hookRequest(params) {
    if (!this.sdkLoaded) {
      if (params.method.includes('requestAccounts')) {
        this.setTheme();
        this.activateOpenBlock(false);
      }
      await new Promise((resolve) => {
        this.on('sdkLoaded', () => {
          console.log('sdkLoaded true');
          resolve();
        });
      });
    }
    if (!this.isLogin) {
      await this._hookRequest({ method: 'openblock_checklogin' });
    }
    if (params.method.includes('requestAccounts')) {
      await this._hookRequest({ method: 'openblock_account_isValid' });
      if (this.isLogin && this.accountIsValid) {
        const accountParams = {
          method: `${params.method.split('_')[0]}_accounts`,
          provider: params.provider,
        };
        const res = await this._hookRequest(accountParams);
        if (!this.currentAuthActionMethod || !this.currentAuthActionMethod.includes('requestAccounts')) {
          this.openblockIFrame.hide();
        }
        if (
          params.provider === 'aptos' &&
          res &&
          res.address &&
          res.publicKey
        ) {
          return res;
        } else if (res && res.length) {
          return res;
        } else {
          this.setTheme();
        }
      }
    }
    const res = await this._hookRequest(params);
    return res;
  }

  _hookRequest(paramsObj) {
    console.log('<dappsdk> _hookRequest', paramsObj);
    // console.log('<dappsdk> unExecutedReqs',this.unExecutedReqs);
    const params = this.buildReq(paramsObj);
    if (
      paramsObj.method === 'openblock_checklogin' ||
      paramsObj.method === 'openblock_account_isValid'
    ) {
      return this.executeReq(params);
    }
    return this.executeReq(params);
  }

  _initDappListener() {
    window.addEventListener('message', (event) => {
      if (
        event.origin !== this.targetOrigin ||
        !event.data ||
        !event.data.value ||
        !event.data.value.data
      ) {
        return;
      }
      const { mark } = event.data.value.data;
      if (mark) {
        if (mark.type === 'register_event') {
          this._handleEventMethod(event);
        } else if (mark.type === 'call_method') {
          this._handleNormalMethod(mark, event);
        } else {
          this._handleNormalMethod(mark, event);
        }
      }
    });
  }

  _handleNormalMethod(mark, event) {
    // console.log('_handleNormalMethod');
    if (mark.method === 'openblock_logout') {
      this.isLogin = false;
      this.setTheme();
      this.openblockIFrame.hide();
      return;
    }
    if (mark.method === 'openblock_account_isValid') {
      const isValid = event.data.value.data.result?.isValid;
      if (typeof isValid !== 'undefined') {
        this.accountIsValid = isValid;
      }
      if (!isValid) {
        this.setTheme();
      }
    }
    if (mark.method === 'openblock_logined') {
      // console.log('openblock_logined');
      this.theme = event.data.value.data.result.theme;
      this.checkAccountVaild();
      if (!this.isLogin) {
        this.isLogin = true;
        this._stcLoginedCallBackChainChanged();
        this.setTheme();
        // this.batchExecutedReqs();
        return;
      }
    }

    if (this.authActions.includes(mark.method)) {
      this.openblockIFrame.hide();
    }
    if (mark.method === 'openblock_checklogin') {
      this.theme = event.data.value.data.result.theme;
      this.isLogin = event.data.value.data.result.isLogin;
      if (this.isLogin) {
        this._stcLoginedCallBackChainChanged();
      }
      this.setTheme();
    }
    const resolve = this.callBackList[mark.id];
    if (resolve) {
      resolve(event.data.value.data.result || event.data.value.data.error);
      delete this.callBackList[mark.id];
    }
  }
  _stcLoginedCallBackChainChanged() {
    const event = {
      data: {
        value: { data: { params: '0x1', mark: { eventName: 'chainChanged' } } },
      },
    };
    this._handleEventMethod(event);
  }
  _handleEventMethod(event) {
    let eventName = event.data.value.data.mark.eventName;
    console.log('eventName:', eventName);
    let params = event.data.value.data.params;
    if (eventName) {
      const fireList = this.eventListener[eventName];
      if (!fireList) return;
      fireList.forEach((func) => {
        if (eventName === 'chainChanged') {
          if (this.provider !== StarCoinProvider) {
            this.chainId = params;
            this.networkVersion = Number(params);
          }
        }
        func(params);
      });
    }
  }
}

if (!window.openblock) {
  let evmprovider = new OpenBlock();
  Object.defineProperty(window, 'openblock', {
    value: evmprovider,
    configurable: false,
    writable: false,
  });
}

if (!window.obstarcoin) {
  let OBStarCoinProvider = Object.create(window.openblock);
  OBStarCoinProvider.provider = StarCoinProvider;
  Object.defineProperty(window, 'obstarcoin', {
    value: OBStarCoinProvider,
    configurable: false,
    writable: false,
  });
}

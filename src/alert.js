import { 
  ARROW_DARK_URL,
  ARROW_LIGHT_URL,
  HEADER_HEIGHT, 
  OPENBLOCK_SDK_ZERO_HEIGHT, 
  OPENBLOCK_SDK_HEIGHT,
  OPENBLOCK_LOGO_DARK_URL, 
  OPENBLOCK_LOGO_LIGHT_URL, 
  OPENBLOCK_LOGO_LOTTIE_HEIGHT, 
  OPENBLOCK_LOGO_LOTTIE_WIDTH, 
  OPENBLOCK_SDK_MOBILE_HEIGHT
} from './consts'
import animationData from './data.js';
import './lottie.js';

function openNewTab(url) {
  const ael = document.createElement('a');
  document.body.appendChild(ael);
  ael.href = url;
  ael.target = '_blank';
  ael.click();
  document.body.removeChild(ael);
}

function OpenBlockAlert(options) {
  this.options = options;
  const bg = document.createElement('div');
  bg.id = 'openblockframe';
  const bgStyle =
    'display:none;flex-direction:column;position:fixed;justify-content:center;align-items:center;top:0;left:0;width:100%;height:100%;z-index:99999;background-color:rgba(0, 0, 0,0.5)';
  bg.setAttribute('style', bgStyle);
  bg.addEventListener('click', () => {
    this.hide();
    if(options.hide){
      options.hide();
    }
  });
  document.body.appendChild(bg);
  const landingLayer = document.createElement('div');
  this.landingLayer = landingLayer;
  landingLayer.id = 'openblocklottie';
  this.landingLayer = landingLayer;
  const landingLayerStyle = `background-color:#4B3CE6;width:${this.options.width}px;height:${this.options.height}px;display:flex;overflow:hidden;justify-content: center;align-items: center; overflow:hidden;border-radius:16px`;
  landingLayer.setAttribute('style', landingLayerStyle);

  const lottieLayer = document.createElement('div');
  lottieLayer.id = 'lottieLayer';
  const lottieLayerStyle = `background-color:#4B3CE6;width:${OPENBLOCK_LOGO_LOTTIE_WIDTH}px;height:${OPENBLOCK_LOGO_LOTTIE_HEIGHT}px;display:block;overflow:hidden;transform:translate3d(0,0,0);opacityt:1;text-align:center;border-radius:16px;`;
  lottieLayer.setAttribute('style', lottieLayerStyle);
  landingLayer.appendChild(lottieLayer);
  bg.appendChild(landingLayer);

  const alertLayer = document.createElement('div');
  this.alertLayer = alertLayer;
  alertLayer.id = 'alertLayer';
  const alertLayerStyle = `width:${this.options.width}px;height:0px;background-color:#4B3CE6;border-radius:16px;overflow:hidden;`;
  alertLayer.setAttribute('style', alertLayerStyle);
  bg.appendChild(alertLayer);

  const headLayer = document.createElement('div');
  headLayer.id = 'headLayer';
  this.headLayer = headLayer;
  const headLayerStyle = `display:flex;justify-content:space-between;align-items:center;margin-left:0px;margin-right:0px;height:${HEADER_HEIGHT}px;`;
  headLayer.setAttribute('style', headLayerStyle);
  headLayer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  alertLayer.appendChild(headLayer);

  const headLogoLayer = document.createElement('div');
  const headLogoLayerStyle =
    'display:flex;justify-content:space-between;align-items:center;width:32px;height:32px;margin-left:21px';
  headLogoLayer.setAttribute('style', headLogoLayerStyle);
  headLayer.appendChild(headLogoLayer);

  const headLogoImg = document.createElement('img');
  headLogoImg.id = 'headLogoImg';
  this.headLogoImg = headLogoImg;
  headLogoImg.src = OPENBLOCK_LOGO_LIGHT_URL;
  const headLogoImgStyle = 'width:119px;height:32px;';
  headLogoImg.setAttribute('style', headLogoImgStyle);
  headLogoLayer.appendChild(headLogoImg);

  const headOpenWalletLayer = document.createElement('div');
  headOpenWalletLayer.id = 'headOpenWalletButton';
  const headOpenWalletLayerStyle = 'display:flex;justify-content:center;align-items:center;border:1px solid #FFFFFF;width:93px;height:32px;border-radius:8px;margin-right:21px;color:#ffffff;font-size:12px;font-weight:600;cursor:pointer;';
  headOpenWalletLayer.setAttribute('style', headOpenWalletLayerStyle);
  headLayer.appendChild(headOpenWalletLayer);
  headOpenWalletLayer.addEventListener('click', (e) => {
    e.stopPropagation();
    openNewTab(this.options.url);
  });
  const headOpenWalletText = document.createElement('span');
  headOpenWalletText.id = 'headOpenWalletText';
  headOpenWalletText.textContent = 'Wallet';
  headOpenWalletLayer.appendChild(headOpenWalletText);

  const headOpenWalletArrow = document.createElement('img');
  headOpenWalletArrow.id = 'headOpenWalletArrow';
  this.headOpenWalletArrow = headOpenWalletArrow;
  headOpenWalletArrow.style.width = '11px';
  headOpenWalletArrow.style.height = '9px';
  headOpenWalletArrow.style.marginLeft = '5px';
  headOpenWalletArrow.src = ARROW_LIGHT_URL;
  const headOpenWalletArrowStyle = 'width:11px;height:9px;margin-left:5px';
  headOpenWalletArrow.setAttribute('style', headOpenWalletArrowStyle);
  headOpenWalletLayer.appendChild(headOpenWalletArrow);

  const contentLayer = document.createElement('div');
  contentLayer.id = 'contentLayer';
  this.contentLayer = contentLayer;
  const contentLayerStyle = 'background-color:#23232E;margin-left:0;margin-right:0px;height:calc(100% - 80px);overflow:hidden;';
  contentLayer.setAttribute('style', contentLayerStyle);
  alertLayer.appendChild(contentLayer);

  setTimeout(() => {
    const iframe = document.createElement('iframe');
    iframe.id = 'openblockiframe';
    this.iframe = iframe;
    iframe.src = this.options.url === undefined ? '' : this.options.url;
    const iframeStyle = 'width:100%;height:100%;overflow:hidden;border-width:0px;border-bottom-right-radius: 16px;border-bottom-left-radius: 16px';
    iframe.setAttribute('style', iframeStyle);
    iframe.onload = () => {
      this.contentWindow = iframe.contentWindow;
      const { initComplate } = this.options;
      if (initComplate) {
        initComplate();
      }
    };
    contentLayer.appendChild(iframe);
  }, 0);
}

OpenBlockAlert.prototype.show = (isLogin) => {
  const lottieLayer = document.getElementById('lottieLayer');
  if (!isLogin) {
    var params = {
      container: lottieLayer,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData,
    };
    window.openblocklottie.loadAnimation(params);
    window.openblocklottie.stop();
    window.openblocklottie.play();
  }
  const openblockframe = document.getElementById('openblockframe');
  openblockframe.style.display = 'flex';
  document.body.style.top = `${-(
    document.documentElement.scrollTop || document.body.scrollTop
  )}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};
OpenBlockAlert.prototype.hide = () => {
  const openblockframe = document.getElementById('openblockframe');
  openblockframe.style.display = 'none';
  document.body.style.position = '';
  document.documentElement.scrollTop = Math.abs(parseInt(document.body.style.top, 10));
  document.body.scrollTop = Math.abs(parseInt(document.body.style.top, 10));
  document.body.style.top = '';
  window.openblocklottie.stop();
};

OpenBlockAlert.prototype.setTheme = (theme, isLogin, sdkLoaded)=> {
  const alertLayer = document.getElementById('alertLayer');
  const contentLayer = document.getElementById('contentLayer');
  const headOpenWalletButton = document.getElementById('headOpenWalletButton');
  const headOpenWalletArrow = document.getElementById('headOpenWalletArrow');
  const landingLayer = document.getElementById('openblocklottie');
  const headLogoImg = document.getElementById('headLogoImg');
  const openblockiframe = document.getElementById('openblockiframe');
  
  if (!isLogin) {
    alertLayer.style.height = `${OPENBLOCK_SDK_ZERO_HEIGHT}px`;
    alertLayer.style.backgroundColor = '#4B3CE6';
    if (sdkLoaded) {
      const landingLayer = document.getElementById('openblocklottie');
      landingLayer.style.height = `${OPENBLOCK_SDK_ZERO_HEIGHT}px`;
      let iframeHeight = OPENBLOCK_SDK_HEIGHT ;
      const clientHeight = document.body.clientHeight;
      if (clientHeight < OPENBLOCK_SDK_HEIGHT) {
        iframeHeight = OPENBLOCK_SDK_MOBILE_HEIGHT;
      }
      alertLayer.style.height = `${iframeHeight}px`;
    }
  } else {
    landingLayer.style.height = `${OPENBLOCK_SDK_ZERO_HEIGHT}px`;
    let iframeHeight = OPENBLOCK_SDK_HEIGHT ;
    const clientHeight = document.body.clientHeight;
    if (clientHeight < OPENBLOCK_SDK_HEIGHT) {
      iframeHeight = OPENBLOCK_SDK_MOBILE_HEIGHT;
    }
    alertLayer.style.height = `${iframeHeight}px`;
    if (theme === 'light') {
      alertLayer.style.backgroundColor = '#ffffff';
      contentLayer.style.backgroundColor = '#ffffff';
      headOpenWalletButton.style.border = '1px dashed #35334A';
      headOpenWalletButton.style.color = '#35334A';
      headOpenWalletArrow.src = ARROW_DARK_URL;
      headLogoImg.src = OPENBLOCK_LOGO_DARK_URL;
    } else if (theme === 'dark') {
      alertLayer.style.backgroundColor = '#23232E';
      contentLayer.style.backgroundColor = '#23232E';
      openblockiframe.style.backgroundColor = '#23232E';
      headOpenWalletButton.style.border = '1px solid #FFFFFF';
      headOpenWalletButton.style.color = '#ffffff';
      headOpenWalletArrow.src = ARROW_LIGHT_URL;
      headLogoImg.src = OPENBLOCK_LOGO_LIGHT_URL;
    }
  }
}

OpenBlockAlert.prototype.hideLandingLayer = ()=> {
  const landingLayer = document.getElementById('openblocklottie');
  if (landingLayer.style.height === `${OPENBLOCK_SDK_ZERO_HEIGHT}px`){
    return;
  }
  landingLayer.style.height = `${OPENBLOCK_SDK_ZERO_HEIGHT}px`;
}

export default OpenBlockAlert;
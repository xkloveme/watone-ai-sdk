export class WatoneSDK {
  constructor(options = {}) {
    this.debug = options.debug || false;
    // 设置目标源为 '*' 以允许跨域通信，也可以通过 options 指定特定的源
    this.parentOrigin = options.parentOrigin || '*';
    this.messageHandlers = new Map();
    this.initMessageListener();
  }

  initMessageListener() {
    window.addEventListener('message', (event) => {
      this.handleMessage(event);
    });
  }

  handleMessage(event) {
    if (this.debug) {
      console.log('Received message:', event.data);
    }

    const { type, data } = event.data;
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach(handler => handler(data));
  }

  postMessage(type, data) {
    const message = { type, data };
    if (this.debug) {
      console.log('Sending message:', message);
    }
    window.parent.postMessage(message, this.parentOrigin);
  }

  addMessageHandler(type, handler) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  removeMessageHandler(type, handler) {
    const handlers = this.messageHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      if (handlers.length === 0) {
        this.messageHandlers.delete(type);
      } else {
        this.messageHandlers.set(type, handlers);
      }
    }
  }

  on(type, handler) {
    this.addMessageHandler(type, handler);
    return this;
  }

  off(type, handler) {
    this.removeMessageHandler(type, handler);
    return this;
  }

  getLoginInfo(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.removeMessageHandler('LOGIN_INFO_RESPONSE', handler);
        reject(new Error('获取登录信息超时'));
      }, timeout);

      const handler = (data) => {
        clearTimeout(timeoutId);
        this.removeMessageHandler('LOGIN_INFO_RESPONSE', handler);
        resolve(data);
      };

      this.addMessageHandler('LOGIN_INFO_RESPONSE', handler);
      this.postMessage('GET_LOGIN_INFO');
    });
  }

  navigate(url, params) {
    if (!url) {
      throw new Error('URL不能为空');
    }
    this.postMessage('NAVIGATE', { url, params });
  }

  sendData(data) {
    this.postMessage('SEND_DATA', data);
  }

  logout(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.removeMessageHandler('LOGOUT_RESPONSE', handler);
        reject(new Error('退出登录超时'));
      }, timeout);

      const handler = (data) => {
        clearTimeout(timeoutId);
        this.removeMessageHandler('LOGOUT_RESPONSE', handler);
        resolve(data);
      };

      this.addMessageHandler('LOGOUT_RESPONSE', handler);
      this.postMessage('LOGOUT');
    });
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.messageHandlers.clear();
  }
}

export { ParentListener } from './parent-listener';
export default WatoneSDK;
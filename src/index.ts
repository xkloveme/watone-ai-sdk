import { WatoneSDKOptions, LoginInfo, MessageType, MessageData, MessageResponse } from './types';
export interface WatoneSDKOptions {
  debug?: boolean;
}

export interface LoginInfo {
  token: string;
  userId: string;
  [key: string]: any;
}


export class WatoneSDK {
  private debug: boolean;
  private parentOrigin: string;
  private messageHandlers: Map<string, Function[]>;

  constructor(options: WatoneSDKOptions = {}) {
    this.debug = options.debug || false;
    this.parentOrigin = window.parent.origin;
    this.messageHandlers = new Map();
    this.initMessageListener();
  }

  private initMessageListener() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    if (this.debug) {
      console.log('Received message:', event.data);
    }

    const { type, data } = event.data as MessageData;
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach(handler => handler(data));
  }

  private postMessage<T>(type: MessageType, data?: T) {
    const message: MessageData<T> = { type, data };
    if (this.debug) {
      console.log('Sending message:', message);
    }
    window.parent.postMessage(message, this.parentOrigin);
  }

  private addMessageHandler(type: MessageType, handler: Function) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  private removeMessageHandler(type: MessageType, handler: Function) {
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

  getLoginInfo(timeout: number = 5000): Promise<LoginInfo> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.removeMessageHandler('LOGIN_INFO_RESPONSE', handler);
        reject(new Error('获取登录信息超时'));
      }, timeout);

      const handler = (data: LoginInfo) => {
        clearTimeout(timeoutId);
        this.removeMessageHandler('LOGIN_INFO_RESPONSE', handler);
        resolve(data);
      };

      this.addMessageHandler('LOGIN_INFO_RESPONSE', handler);
      this.postMessage('GET_LOGIN_INFO');
    });
  }

  navigate(url: string, params?: Record<string, any>) {
    if (!url) {
      throw new Error('URL不能为空');
    }
    this.postMessage('NAVIGATE', { url, params });
  }

  sendData<T>(data: T) {
    this.postMessage('SEND_DATA', data);
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.messageHandlers.clear();
  }
}

export default WatoneSDK;
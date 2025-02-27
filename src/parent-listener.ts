import { MessageType, MessageData, MessageHandler } from './types';

export interface ParentListenerOptions {
  debug?: boolean;
}

export class ParentListener {
  private debug: boolean;
  private handlers: Map<MessageType, MessageHandler>;
  private childWindow: Window | null;

  constructor(options: ParentListenerOptions = {}) {
    this.debug = options.debug || false;
    this.handlers = new Map();
    this.childWindow = null;
    this.initMessageListener();
  }

  private initMessageListener() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    if (this.debug) {
      console.log('Parent received message:', event.data);
    }

    const { type, data } = event.data as MessageData;
    const handler = this.handlers.get(type);
    if (handler) {
      handler(data, event.source);
    }
    
    // 保存子窗口引用
    if (event.source instanceof Window) {
      this.childWindow = event.source;
    }
  }

  on(type: MessageType, handler: MessageHandler) {
    this.handlers.set(type, handler);
    return this;
  }

  off(type: MessageType) {
    this.handlers.delete(type);
    return this;
  }

  sendToChild<T>(type: MessageType, data?: T) {
    if (!this.childWindow) {
      throw new Error('子窗口未连接');
    }

    const message: MessageData<T> = { type, data };
    if (this.debug) {
      console.log('Parent sending message:', message);
    }
    this.childWindow.postMessage(message, '*');
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.handlers.clear();
    this.childWindow = null;
  }
}

export default ParentListener;
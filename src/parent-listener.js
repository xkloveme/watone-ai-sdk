export class ParentListener {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.handlers = new Map();
    this.childWindow = null;
    this.initMessageListener();
  }

  initMessageListener() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(event) {
    if (this.debug) {
      console.log('Parent received message:', event.data);
    }

    const { type, data } = event.data;
    const handler = this.handlers.get(type);
    if (handler) {
      handler(data, event.source);
    }
    
    // 保存子窗口引用
    if (event.source instanceof Window) {
      this.childWindow = event.source;
    }
  }

  on(type, handler) {
    this.handlers.set(type, handler);
    return this;
  }

  off(type) {
    this.handlers.delete(type);
    return this;
  }

  sendToChild(type, data) {
    if (!this.childWindow) {
      throw new Error('子窗口未连接');
    }

    const message = { type, data };
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
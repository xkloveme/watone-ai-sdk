"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const parentListener = require("./index.cjs2.js");
class WatoneSDK {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.parentOrigin = window.parent.origin;
    this.messageHandlers = /* @__PURE__ */ new Map();
    this.initMessageListener();
  }
  initMessageListener() {
    window.addEventListener("message", this.handleMessage.bind(this));
  }
  handleMessage(event) {
    if (this.debug) {
      console.log("Received message:", event.data);
    }
    const { type, data } = event.data;
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach((handler) => handler(data));
  }
  postMessage(type, data) {
    const message = { type, data };
    if (this.debug) {
      console.log("Sending message:", message);
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
  getLoginInfo(timeout = 5e3) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.removeMessageHandler("LOGIN_INFO_RESPONSE", handler);
        reject(new Error("获取登录信息超时"));
      }, timeout);
      const handler = (data) => {
        clearTimeout(timeoutId);
        this.removeMessageHandler("LOGIN_INFO_RESPONSE", handler);
        resolve(data);
      };
      this.addMessageHandler("LOGIN_INFO_RESPONSE", handler);
      this.postMessage("GET_LOGIN_INFO");
    });
  }
  navigate(url, params) {
    if (!url) {
      throw new Error("URL不能为空");
    }
    this.postMessage("NAVIGATE", { url, params });
  }
  sendData(data) {
    this.postMessage("SEND_DATA", data);
  }
  destroy() {
    window.removeEventListener("message", this.handleMessage.bind(this));
    this.messageHandlers.clear();
  }
}
exports.ParentListener = parentListener.ParentListener;
exports.WatoneSDK = WatoneSDK;
exports.default = WatoneSDK;

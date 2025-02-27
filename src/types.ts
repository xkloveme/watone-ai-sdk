export interface WatoneSDKOptions {
  debug?: boolean;
}

export interface LoginInfo {
  userId: string;
  username: string;
  token: string;
  [key: string]: any;
}

export interface NavigateParams {
  url: string;
  params?: Record<string, any>;
}

export type MessageType = 'GET_LOGIN_INFO' | 'LOGIN_INFO_RESPONSE' | 'NAVIGATE' | 'SEND_DATA';

export interface MessageData<T = any> {
  type: MessageType;
  data?: T;
}

export interface MessageResponse<T = any> {
  type: MessageType;
  data: T;
}

export type MessageHandler = (data: any, source: MessageEventSource | null) => void;
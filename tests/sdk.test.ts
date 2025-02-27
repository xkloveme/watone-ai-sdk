import { WatoneSDK } from '../src';
import { LoginInfo, MessageData } from '../src/types';

describe('WatoneSDK', () => {
  let sdk: WatoneSDK;
  let mockPostMessage: jest.SpyInstance;

  beforeEach(() => {
    sdk = new WatoneSDK({ debug: true });
    mockPostMessage = jest.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    sdk.destroy();
    mockPostMessage.mockRestore();
  });

  describe('getLoginInfo', () => {
    it('should get login info successfully', async () => {
      const mockLoginInfo: LoginInfo = {
        userId: '123',
        username: 'test',
        token: 'token123'
      };

      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: 'LOGIN_INFO_RESPONSE',
              data: mockLoginInfo
            }
          })
        );
      }, 100);

      const result = await sdk.getLoginInfo();
      expect(result).toEqual(mockLoginInfo);
      expect(mockPostMessage).toHaveBeenCalledWith(
        { type: 'GET_LOGIN_INFO' },
        window.parent.origin
      );
    });

    it('should timeout when no response received', async () => {
      await expect(sdk.getLoginInfo(100)).rejects.toThrow('获取登录信息超时');
    });
  });

  describe('navigate', () => {
    it('should send navigate message', () => {
      const url = '/dashboard';
      const params = { id: 123 };
      sdk.navigate(url, params);

      expect(mockPostMessage).toHaveBeenCalledWith(
        { type: 'NAVIGATE', data: { url, params } },
        window.parent.origin
      );
    });

    it('should throw error when url is empty', () => {
      expect(() => sdk.navigate('')).toThrow('URL不能为空');
    });
  });

  describe('sendData', () => {
    it('should send data message', () => {
      const data = { key: 'value' };
      sdk.sendData(data);

      expect(mockPostMessage).toHaveBeenCalledWith(
        { type: 'SEND_DATA', data },
        window.parent.origin
      );
    });
  });
});
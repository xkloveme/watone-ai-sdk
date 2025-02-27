# Watone AI SDK

一个用于iframe通信的轻量级SDK，支持子页面与父页面之间的安全通信。

## 特性

- 获取登录信息
- 页面导航
- 数据传输
- 类型安全
- 完整的错误处理
- 支持超时控制

## 安装

```bash
npm install watone-ai-sdk
```

## 使用示例

### 子页面（使用WatoneSDK）

```typescript
import { WatoneSDK } from 'watone-ai-sdk';

// 初始化SDK
const sdk = new WatoneSDK({
  debug: true // 开启调试模式
});

// 获取登录信息
try {
  const loginInfo = await sdk.getLoginInfo();
  console.log('登录信息:', loginInfo);
} catch (error) {
  console.error('获取登录信息失败:', error);
}

// 页面导航
sdk.navigate('/dashboard', { id: 123 });

// 发送数据
sdk.sendData({
  type: 'custom',
  data: { message: 'Hello from child' }
});

// 清理资源
sdk.destroy();
```

### 父页面（使用ParentListener）

```typescript
import { ParentListener } from 'watone-ai-sdk';

// 初始化监听器
const listener = new ParentListener({
  debug: true // 开启调试模式
});

// 处理登录信息请求
listener.on('GET_LOGIN_INFO', (data, source) => {
  const loginInfo = {
    userId: 'user123',
    username: 'demo',
    token: 'token123'
  };
  source?.postMessage({
    type: 'LOGIN_INFO_RESPONSE',
    data: loginInfo
  }, '*');
});

// 处理导航请求
listener.on('NAVIGATE', (data) => {
  console.log('导航到:', data.url, '参数:', data.params);
});

// 处理数据传输
listener.on('SEND_DATA', (data) => {
  console.log('收到数据:', data);
});

// 清理资源
listener.destroy();
```

## API文档

### WatoneSDK

#### 构造函数

```typescript
new WatoneSDK(options?: WatoneSDKOptions)
```

- `options.debug`: 是否开启调试模式，默认为false

#### 方法

##### getLoginInfo

```typescript
getLoginInfo(timeout?: number): Promise<LoginInfo>
```

获取登录信息，支持超时控制。

- `timeout`: 超时时间（毫秒），默认5000ms
- 返回: Promise<LoginInfo>

##### navigate

```typescript
navigate(url: string, params?: Record<string, any>): void
```

发送页面导航请求。

- `url`: 目标页面URL
- `params`: 导航参数（可选）

##### sendData

```typescript
sendData<T>(data: T): void
```

发送自定义数据到父页面。

- `data`: 要发送的数据

##### destroy

```typescript
destroy(): void
```

清理资源，移除事件监听。

### ParentListener

#### 构造函数

```typescript
new ParentListener(options?: ParentListenerOptions)
```

- `options.debug`: 是否开启调试模式，默认为false

#### 方法

##### on

```typescript
on(type: MessageType, handler: MessageHandler): ParentListener
```

注册消息处理器。

- `type`: 消息类型
- `handler`: 处理函数
- 返回: this（支持链式调用）

##### off

```typescript
off(type: MessageType): ParentListener
```

移除消息处理器。

- `type`: 消息类型
- 返回: this（支持链式调用）

##### destroy

```typescript
destroy(): void
```

清理资源，移除事件监听。

## 示例

查看 `src/demo` 目录下的示例：

- `parent.html`: 父页面示例
- `child.html`: 子页面示例

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 许可证

MIT

# Watone AI SDK

English | [简体中文](./README.md)

A lightweight SDK for secure iframe communication between parent and child pages.

## Features

- 🔒 Secure iframe communication mechanism
- 🔑 Login information retrieval
- 🧭 Page navigation control
- 📦 Bi-directional data transfer
- 📝 Complete TypeScript type support
- ⚡️ Lightweight with zero dependencies
- 🚦 Complete error handling and timeout control
- 🔍 Debug mode support

## Installation

```bash
npm install watone-ai-sdk
# or using yarn
yarn add watone-ai-sdk
# or using pnpm
pnpm add watone-ai-sdk
```

## Quick Start

### Child Page Integration

Use WatoneSDK in your embedded iframe page:

```typescript
import { WatoneSDK } from 'watone-ai-sdk';

// Initialize SDK
const sdk = new WatoneSDK({
  debug: true // Enable debug mode for development
});

// Get login information
try {
  const loginInfo = await sdk.getLoginInfo();
  console.log('Login info:', loginInfo);
} catch (error) {
  console.error('Failed to get login info:', error);
}

// Page navigation
sdk.navigate('/dashboard', { id: 123 });

// Send data to parent page
sdk.sendData({
  type: 'custom',
  data: { message: 'Hello from child' }
});

// Listen for parent page messages
sdk.on('PARENT_DATA', (data) => {
  console.log('Received parent data:', data);
});

// Clean up resources when component unmounts
sdk.destroy();
```

### Parent Page Integration

Use ParentListener in the parent page to handle child page requests:

```typescript
import { ParentListener } from 'watone-ai-sdk';

// Initialize listener
const listener = new ParentListener({
  debug: true // Enable debug mode
});

// Handle login info requests
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

// Handle navigation requests
listener.on('NAVIGATE', (data) => {
  console.log('Navigate to:', data.url, 'params:', data.params);
  // Implement your navigation logic here
});

// Handle child page data
listener.on('SEND_DATA', (data) => {
  console.log('Received child data:', data);
});

// Send data to child page
listener.sendToChild('PARENT_DATA', {
  message: 'Data from parent'
});

// Clean up resources when component unmounts
listener.destroy();
```

## API Documentation

### WatoneSDK

#### Constructor

```typescript
new WatoneSDK(options?: WatoneSDKOptions)
```

##### Parameters

- `options.debug`: boolean - Enable debug mode, defaults to false

#### Methods

##### getLoginInfo

```typescript
getLoginInfo(timeout?: number): Promise<LoginInfo>
```

Get login information with timeout control.

- `timeout`: Timeout in milliseconds, defaults to 5000ms
- Returns: Promise<LoginInfo>

##### navigate

```typescript
navigate(url: string, params?: Record<string, any>): void
```

Send page navigation request.

- `url`: Target page URL
- `params`: Navigation parameters (optional)

##### sendData

```typescript
sendData<T>(data: T): void
```

Send custom data to parent page.

- `data`: Data to send

##### on

```typescript
on(type: string, handler: (data: any) => void): void
```

Listen for parent page messages.

- `type`: Message type
- `handler`: Message handler function

##### destroy

```typescript
destroy(): void
```

Clean up resources and remove event listeners.

### ParentListener

#### Constructor

```typescript
new ParentListener(options?: ParentListenerOptions)
```

##### Parameters

- `options.debug`: boolean - Enable debug mode, defaults to false

#### Methods

##### on

```typescript
on(type: MessageType, handler: MessageHandler): ParentListener
```

Register message handler.

- `type`: Message type
- `handler`: Handler function
- Returns: this (for method chaining)

##### off

```typescript
off(type: MessageType): ParentListener
```

Remove message handler.

- `type`: Message type
- Returns: this (for method chaining)

##### sendToChild

```typescript
sendToChild(type: string, data: any): void
```

Send data to child page.

- `type`: Message type
- `data`: Data to send

##### destroy

```typescript
destroy(): void
```

Clean up resources and remove event listeners.

## Message Types

### Built-in Message Types

- `GET_LOGIN_INFO`: Get login information
- `LOGIN_INFO_RESPONSE`: Login information response
- `NAVIGATE`: Page navigation
- `SEND_DATA`: Data transfer
- `PARENT_DATA`: Parent page data

## Running Examples

The project includes complete example code demonstrating the main SDK features:

```bash
# Clone repository
git clone https://github.com/xkloveme/watone-ai-sdk.git
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Example code is located in the `src/demo` directory:
- `parent.html`: Parent page example
- `child.html`: Child page example
- `App.vue`: Vue version of parent page example

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build
pnpm build

# Run tests
pnpm test
```

## License

MIT
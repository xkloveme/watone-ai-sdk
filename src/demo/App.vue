<template>
  <div class="app-container">
    <h1>Parent Page Demo</h1>
    <div>
      <h2>Child Page</h2>
      <iframe id="childFrame" :src="childUrl"></iframe>
    </div>
    <div class="send-data-container">
      <h2>Send Data to Child</h2>
      <div class="form-group">
        <input v-model="message" placeholder="Enter message" class="input-field" />
        <button @click="sendDataToChild" class="send-button">Send Data</button>
      </div>
    </div>
    <div class="log-container">
      <h2>Message Log</h2>
      <div id="logContent">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ParentListener } from '../parent-listener';

const logs = ref<string[]>([]);
const message = ref('');
const childUrl = new URL('./child.html', import.meta.url).href;
const listener = new ParentListener({ debug: true });

function addLog(message: string) {
  logs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`);
}

function sendDataToChild() {
  if (!message.value.trim()) return;

  try {
    listener.sendToChild('PARENT_DATA', { message: message.value });
    addLog(`Sent data to child: ${message.value}`);
    message.value = '';
  } catch (error) {
    addLog(`Error sending data: ${error.message}`);
  }
}

onMounted(() => {
  // 处理获取登录信息的请求
  listener.on('GET_LOGIN_INFO', (data, source) => {
    addLog('Received GET_LOGIN_INFO request');
    const loginInfo = {
      userId: 'demo123',
      aaa: 'bbb',
      username: 'demoUser',
      token: 'demoToken'
    };
    source?.postMessage({
      type: 'LOGIN_INFO_RESPONSE',
      data: loginInfo
    }, '*');
    addLog(`Sent login info: ${JSON.stringify(loginInfo)}`);
  });

  // 处理导航请求
  listener.on('NAVIGATE', (data) => {
    addLog(`Received navigation request: ${JSON.stringify(data)}`);
  });

  // 处理数据传输
  listener.on('SEND_DATA', (data) => {
    addLog(`Received data: ${JSON.stringify(data)}`);
  });
});

onUnmounted(() => {
  listener.destroy();
});
</script>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

iframe {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.send-data-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  display: flex;
  gap: 10px;
}

.input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.send-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #45a049;
}

.log-container {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  margin: 5px 0;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
</style>
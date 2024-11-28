<template>
  <div class="w-[400px] p-4">
    <el-card class="custom-card">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-800">消息发送测试</span>
          <el-tag type="info" class="ml-2">Vue3 + TS + Element Plus + Tailwind</el-tag>
        </div>
      </template>

      <el-input
        v-model="message"
        placeholder="输入消息"
        :prefix-icon="ChatLineRound"
      >
        <template #append>
          <el-button @click="clearMessage">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-input>

      <div class="flex gap-2 mb-4">
        <el-button 
          type="primary" 
          class="flex-1"
          :icon="Position"
          @click="sendToContent"
          :loading="loading"
        >
          发送到 Content
        </el-button>
        
        <el-button 
          type="success" 
          class="flex-1"
          :icon="Connection"
          @click="sendToBackground"
          :loading="loading"
        >
          发送到 Background
        </el-button>
      </div>

      <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <el-alert
          v-if="response"
          :title="response"
          :type="responseType"
          show-icon
        />
        <div v-else class="text-gray-400 text-center py-2">
          等待响应...
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  ChatLineRound, 
  Connection,
  Delete,
  Position
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { MessagePayload, MessageResponse, ResponseType } from '@/types'

const message = ref<string>('')
const response = ref<string>('')
const responseType = ref<ResponseType>('success')
const loading = ref<boolean>(false)

const clearMessage = (): void => {
  message.value = ''
  response.value = ''
}

const sendMessage = async (
  type: 'content' | 'background'
): Promise<MessageResponse | undefined> => {
  if (!message.value) {
    ElMessage.warning('请输入消息内容')
    return
  }

  const payload: MessagePayload = {
    type: 'FROM_POPUP',
    message: message.value
  }

  try {
    if (type === 'content') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) throw new Error('No active tab')
      return await chrome.tabs.sendMessage(tab.id, payload)
    } else {
      return await chrome.runtime.sendMessage(payload)
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '未知错误')
  }
}

const handleResponse = async (
  action: () => Promise<MessageResponse | undefined>
): Promise<void> => {
  loading.value = true
  try {
    const result = await action()
    response.value = result?.message || '无响应'
    responseType.value = 'success'
  } catch (error) {
    response.value = `发送失败: ${error instanceof Error ? error.message : '未知错误'}`
    responseType.value = 'error'
  } finally {
    loading.value = false
  }
}

const sendToContent = (): Promise<void> => 
  handleResponse(() => sendMessage('content'))

const sendToBackground = (): Promise<void> => 
  handleResponse(() => sendMessage('background'))
</script>

<style scoped>
:deep(.el-card__header) {
  @apply p-4 bg-gray-50 border-b border-gray-200;
}

:deep(.el-input-group__append) {
  @apply p-0;
}
</style>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { chat } from '@/server/index'
import { useScroll } from '@/hooks/useScroll'

interface Messages {
  id: number
  content: string
  isBot: boolean
}
const messages = reactive<Messages[]>([])
const newMessage = ref('')
const isTyping = ref(false)
const session_id = ref('')
const currentIndex = ref<Number | null>(null)
const AutoGPTPrompt = '从现在你就是一个AI脑图,我需要输入任务的内容,请注意,你需要设置每一步的优先级并进行排序,并且在尽可能简化步骤的同时,还要提高实际完成此步骤的效率,每一步都要有description,并且分解成一维的结构,请你分解后返回一个可读的JSON格式'
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
// 初始化GPT的角色，后续可自行调整
const { data } = await chat({
  prompt: AutoGPTPrompt,
  session_id: session_id.value,
  onDownloadProgress(progressEvent) {
    const xhr = progressEvent.event.target
    const { responseText } = xhr
    // messages.splice(messages.length, 0, {
    //   id: Date.now(),
    //   content: responseText,
    //   isBot: true,
    // })
    console.log(responseText)
  },
})
messages.splice(messages.length, 0, {
  id: Date.now(),
  content: data,
  isBot: true,
})
scrollToBottom()

async function sendMessage() {
  if (messages.length === 0) {
    alert('请等待初始化')
    return
  }
  if (!newMessage.value)
    return
  if (isTyping.value) {
    alert('请等待上一次对话完成!')
    return
  }
  isTyping.value = true
  messages.splice(messages.length, 0, {
    id: Date.now(),
    content: newMessage.value,
    isBot: false,
  })
  scrollToBottom()

  try {
    let isFirst = true
    const { data } = await chat({
      prompt: newMessage.value,
      session_id: session_id.value,
      onDownloadProgress(progressEvent) {
        const xhr = progressEvent.event.target
        const { responseText } = xhr
        if (isFirst) {
          messages.splice(messages.length, 0, {
            id: Date.now(),
            content: responseText,
            isBot: true,
          })
          currentIndex.value = messages.length - 1
          isFirst = false
        }
        else {
          messages[messages.length - 1].content = responseText
          scrollToBottom()
        }
        // scrollToBottom

        console.log(responseText)
      },
    })
    // ！根据返回的内容进行分别请求然后得到输出
    //   const JSONObject = JSON.parse(data)
    //   const AIRequest = []
    //   for (const item of JSONObject) {
    //     AIRequest.push(AI({prompt:item.description,session_id:this.session_id}))
    //   }

    //  const AllRes = await Promise.all(AIRequest) // 可能耗时很久，可以考虑循环请求输出
    // TODO:
    // 循环
    isTyping.value = false
    session_id.value = data.session_id // 更新session_id
  }
  catch (error) {
    console.log(error)
  }
  finally {
    newMessage.value = ''
    currentIndex.value = null
  }
}
</script>

<template>
  <div class="container">
    <h1>模拟与AutoGPT对话</h1>
    <div id="scrollRef" ref="scrollRef" class="chat-window">
      <div v-if="messages.length === 0">
        请等待初始化~
      </div>
      <div
        v-for="(message, index) in messages" :key="index" :class="{
          'message-left': !message.isBot,
          'message-right': message.isBot,
        }"
      >
        <div v-if="!message.isBot" class="message-container reverse">
          <div class="user-avatar">
            <img
              loading="eager" src="https://avatars.githubusercontent.com/u/108790041?v=4"
              data-image-src="https://avatars.githubusercontent.com/u/108790041?v=4"
            >
          </div>
          <div class="user-message">
            {{ message.content }}
          </div>
        </div>
        <div v-else class="message-container">
          <div class="bot-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" width="50" height="50">
              <path
                d="M29.71,13.09A8.09,8.09,0,0,0,20.34,2.68a8.08,8.08,0,0,0-13.7,2.9A8.08,8.08,0,0,0,2.3,18.9,8,8,0,0,0,3,25.45a8.08,8.08,0,0,0,8.69,3.87,8,8,0,0,0,6,2.68,8.09,8.09,0,0,0,7.7-5.61,8,8,0,0,0,5.33-3.86A8.09,8.09,0,0,0,29.71,13.09Zm-12,16.82a6,6,0,0,1-3.84-1.39l.19-.11,6.37-3.68a1,1,0,0,0,.53-.91v-9l2.69,1.56a.08.08,0,0,1,.05.07v7.44A6,6,0,0,1,17.68,29.91ZM4.8,24.41a6,6,0,0,1-.71-4l.19.11,6.37,3.68a1,1,0,0,0,1,0l7.79-4.49V22.8a.09.09,0,0,1,0,.08L13,26.6A6,6,0,0,1,4.8,24.41ZM3.12,10.53A6,6,0,0,1,6.28,7.9v7.57a1,1,0,0,0,.51.9l7.75,4.47L11.85,22.4a.14.14,0,0,1-.09,0L5.32,18.68a6,6,0,0,1-2.2-8.18Zm22.13,5.14-7.78-4.52L20.16,9.6a.08.08,0,0,1,.09,0l6.44,3.72a6,6,0,0,1-.9,10.81V16.56A1.06,1.06,0,0,0,25.25,15.67Zm2.68-4-.19-.12-6.36-3.7a1,1,0,0,0-1.05,0l-7.78,4.49V9.2a.09.09,0,0,1,0-.09L19,5.4a6,6,0,0,1,8.91,6.21ZM11.08,17.15,8.38,15.6a.14.14,0,0,1-.05-.08V8.1a6,6,0,0,1,9.84-4.61L18,3.6,11.61,7.28a1,1,0,0,0-.53.91ZM12.54,14,16,12l3.47,2v4L16,20l-3.47-2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="bot-message">
            {{ message.content }}<span v-show="index === currentIndex" class="typing-indicator">_</span>
          </div>
        </div>
      </div>
    </div>
    <form class="formStyle" @submit.prevent="sendMessage">
      <input v-model="newMessage" type="text" placeholder="请输入您的消息">
      <button type="submit" style="background-color: pink">
        发送
      </button>
    </form>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin: auto;
}

h1 {
  text-align: center;
}

.chat-window {
  border: 1px solid #ddd;
  height: 600px;
  padding: 10px;
  overflow-y: scroll;
}

.message-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar,
.bot-avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  overflow: hidden;
  border-radius: 50%;
}

.user-avatar img,
.bot-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-message,
.bot-message {
  background-color: #000;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.user-message {
  margin-left: auto;
  margin-right: 0;
  display: flex;
  align-items: center;
}

.typing-indicator {
  width: 10px;
  height: 10px;
  background-color: #fff;
  animation: typing 0.7s infinite;
  margin-left: 5px;
}

@keyframes typing {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.message-left .user-avatar,
.message-right .bot-avatar {
  order: 1;
}

.message-left .user-message,
.message-right .bot-message {
  order: 2;
}

.message-left .typing-indicator {
  margin-left: 5px;
}

.message-right .user-avatar {
  order: 2;
  margin-right: 0;
  margin-left: 10px;
}

.message-right .bot-avatar {
  order: 1;
  margin-right: 10px;
  margin-left: 0;
}

.message-right .bot-message {
  background-color: #2980b9;
  color: white;
  margin-right: auto;
  margin-left: 0;
  text-align: left;
}

.message-right .user-message {
  background-color: white;
  color: black;
  margin-right: 0;
  margin-left: auto;
}

.message-right .typing-indicator {
  margin-right: 5px;
}

.reverse {
  flex-direction: row-reverse !important;
}

.formStyle {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

input {
  width: 600px;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

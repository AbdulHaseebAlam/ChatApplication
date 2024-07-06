<template>
  <div class="h-screen flex flex-col mx-auto max-w-6xl">
    <!-- Chat Interface Container -->
    <div class="bg-gray-50 p-4 flex-1 flex flex-col">
      <div
        class="bg-white shadow-md rounded-lg p-6 flex flex-col flex-1 overflow-y-auto mb-4 max-h-[calc(100vh-8rem)]"
        ref="messageContainer"
      >
        <!-- Chat Messages Section -->
        <div v-if="loading">
          <ChatLoader v-for="i in 1" :key="i" />
        </div>
        <div
          v-else-if="messages.length === 0"
          class="flex items-center justify-center flex-1"
        >
          <h2 class="text-2xl text-gray-400 font-bold">HR Assistant</h2>
        </div>
        <div v-else>
          <div v-for="message in messages" :key="message.id" class="space-y-4">
            <!-- User Message -->
            <div class="flex justify-end items-start space-x-2 my-2">
              <div class="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-md">
                <p>{{ message.userPrompt }}</p>
                <!-- {{ console.log(message.userPrompt) }} -->
              </div>
              <img
                src="../assets/user.png"
                alt="User DP"
                class="w-10 h-10 rounded-full mt-1"
              />
            </div>
            <!-- AI Response -->
            <div class="flex justify-start items-start space-x-2">
              <img
                src="../assets/ai.png"
                alt="AI DP"
                class="w-10 h-10 rounded-full mt-1"
              />
              <div class="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-md">
                <div v-html="message.apiResponse"></div>
                <!-- {{ console.log(message.apiResponse) }} -->
              </div>
            </div>
          </div>
          <div ref="bottom" />
        </div>
      </div>
      <!-- User Prompt Section -->
      <form
        @submit.prevent="sendMessage"
        autocomplete="off"
        class="w-full max-w-xl mx-auto py-2 px-6 rounded-full bg-gray-50 border border-gray-400 flex focus-within:border-gray-700"
      >
        <textarea
          v-model="newMessage"
          type="text"
          placeholder="HR Assistant here message me"
          class="bg-transparent w-full focus:outline-none pt-1 pr-4 font-semibold border-0 focus:ring-0 px-0 py-0 resize-none overflow-y-auto"
          rows="1"
          style="min-height: 38px; white-space: pre-wrap; word-wrap: break-word"
          name="topic"
        />
        <button
          class="flex flex-row items-center justify-center min-w-[130px] px-4 rounded-full font-medium tracking-wide border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-black text-white border-transparent py-1.5 h-[38px] -mr-3 hover:bg-gray-800"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {
  createChatSession,
  addMessageToChatSession,
  getMessagesByChatSessionId,
} from "../api";
import ChatLoader from "./ChatLoader.vue";
import { nextTick } from "vue";

export default {
  components: {
    ChatLoader,
  },
  props: {
    chatSessionId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      loading: false,
    };
  },
  watch: {
    chatSessionId: {
      immediate: true,
      handler(newChatSessionId) {
        if (newChatSessionId) {
          this.fetchMessages(newChatSessionId);
        } else {
          this.messages = [];
        }
      },
    },
  },
  methods: {
    async fetchMessages(chatSessionId) {
      this.loading = true;
      const response = await getMessagesByChatSessionId(chatSessionId);
      console.log(response);
      this.loading = false;
      this.messages = response.messages;
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      this.loading = true;
      if (!this.chatSessionId) {
        const { response, chatSessionId } = await createChatSession(
          this.newMessage
        );
        this.$emit("chatSessionCreated", chatSessionId);
        console.log(response, chatSessionId);
        this.messages.push({
          userPrompt: this.newMessage,
          apiResponse: response,
        });
      } else {
        const { response } = await addMessageToChatSession(
          this.chatSessionId,
          this.newMessage
        );
        console.log(response);
        this.messages.push({
          userPrompt: this.newMessage,
          apiResponse: response,
        });
      }
      this.newMessage = "";
      this.loading = false;
      await nextTick();
      this.scrollToBottom();
    },
    scrollToBottom() {
      const bottomElement = this.$refs.bottom;
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

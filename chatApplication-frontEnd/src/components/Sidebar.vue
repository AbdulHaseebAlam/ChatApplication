<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="bg-gray-50 p-4 flex flex-col h-screen">
    <div
      class="flex flex-col h-full justify-between border-e bg-white shadow-md rounded-lg"
    >
      <div class="p-4 bg-blue-300 rounded-t-lg flex flex-col items-center">
        <img class="w-16" src="../assets/ai-.png" alt="Logo" />
        <h1
          class="grid h-10 w-full place-content-center text-gray-600 font-bold"
        >
          HR Assistant
        </h1>
      </div>
      <div class="mx-2 px-2 pt-3 flex">
        <a class="px-4 py-4 text-sm font-medium text-gray-500 flex" href="/"
          >New Chat
          <img
            class="w-5 ml-2"
            src="../assets/plus-circle1.svg"
            alt="Add button"
        /></a>
      </div>
      <div class="px-2 flex-1 overflow-y-auto">
        <ul class="mx-2 space-y-1">
          <li v-if="loading">
            <Loader :lines="5" />
          </li>
          <li v-else v-for="chat in chats" :key="chat.id">
            <div
              class="flex items-center justify-between rounded-lg px-4 py-4 text-sm font-medium"
              :class="{
                'text-gray-700 bg-blue-100': chat.id === activeChat,
                'text-gray-500 hover:bg-blue-100 hover:text-gray-700':
                  chat.id !== activeChat,
              }"
            >
              <a
                href=""
                @click.prevent="selectChat(chat)"
                style="
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                "
              >
                {{ chat.title }}
              </a>
              <img
                @click="deleteChat(chat.id)"
                class="w-10 px-2 cursor-pointer"
                src="../assets/cross-circle.svg"
                alt="Delete Button"
              />
            </div>
          </li>
        </ul>
      </div>

      <div class="sticky inset-x-0 p-4 bottom-0 border-t border-gray-300">
        <a href="" class="flex items-center gap-2 bg-white hover:bg-gray-50">
          <img
            alt=""
            src="https://avatars.githubusercontent.com/u/136955691?v=4"
            class="size-10 rounded-full object-cover"
          />

          <div>
            <p class="text-xs">
              <strong class="block font-medium">Abdul Haseeb Alam</strong>

              <span> Haseeb@Abdul.com </span>
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteChatSession, getChatSessions } from "../api";
import Loader from "./Loader.vue";

export default {
  components: {
    Loader,
  },
  data() {
    return {
      chats: [],
      activeChat: null,
      loading: true,
    };
  },
  methods: {
    async fetchChatSessions() {
      this.loading = true;
      const chatSessions = await getChatSessions();
      this.chats = chatSessions;
      this.loading = false;
    },
    selectChat(chat) {
      this.$emit("chatSelected", chat.id);
      this.activeChat = chat.id;
    },
    async deleteChat(chatSessionId) {
      await deleteChatSession(chatSessionId);
      this.fetchChatSessions();
    },
  },
  created() {
    this.fetchChatSessions();
  },
};
</script>

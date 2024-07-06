<script>
import Sidebar from "./components/Sidebar.vue";
import MainComponent from "./components/MainComponent.vue";

export default {
  components: {
    Sidebar,
    MainComponent,
  },
  data() {
    return {
      selectedChatSessionId: null,
    };
  },
  methods: {
    handleChatSelected(chatSessionId) {
      this.selectedChatSessionId = chatSessionId;
    },
    handleChatSessionCreated(chatSessionId) {
      this.selectedChatSessionId = chatSessionId;
    },
  },
};
</script>

<template>
  <div class="flex h-screen">
    <div class="w-3/12">
      <Sidebar @chatSelected="handleChatSelected" />
    </div>
    <div class="w-9/12">
      <MainComponent
        :chatSessionId="selectedChatSessionId"
        @chatSessionCreated="handleChatSessionCreated"
      />
    </div>
  </div>
</template>

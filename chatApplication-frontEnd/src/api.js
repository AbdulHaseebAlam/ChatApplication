const API_URL = 'http://localhost:3000';

export async function getChatSessions() {
    const response = await fetch(`${API_URL}/chat-sessions`);
    return response.json();
}

export async function getMessagesByChatSessionId(id) {
    const response = await fetch(`${API_URL}/chat-sessions/${id}`);
    return response.json();
}

export async function createChatSession(prompt) {
    const response = await fetch(`${API_URL}/prompt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });
    return response.json();
}

export async function addMessageToChatSession(chatSessionId, prompt) {
    const response = await fetch(`${API_URL}/chat-sessions/${chatSessionId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });
    return response.json();
}

export async function deleteChatSession(chatSessionId) {
    const response = await fetch(`${API_URL}/chat-sessions/${chatSessionId}`, {
        method: 'DELETE',
    });
    return response.json();
}
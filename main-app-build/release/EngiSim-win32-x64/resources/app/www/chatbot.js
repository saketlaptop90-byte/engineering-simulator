// chatbot.js
import * as THREE from 'three';
import { getCurrentUser } from './auth.js';

const STORAGE_KEY = 'engisim_custom_models';
let chatHistory = [];

export async function loadCustomModels(machinesArray) {
    let customModels = [];
    try { customModels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { console.warn('localStorage not available'); }
    for (const model of customModels) {
        try {
            const blob = new Blob([model.code], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const module = await import(url);
            const createFn = Object.values(module)[0];
            
            machinesArray.push({
                id: model.id,
                name: model.name,
                icon: '🤖',
                category: 'custom',
                create: createFn
            });
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to load custom model", model.name, e);
        }
    }
}

// Backend Server Configuration
// Use local URL for testing, update to Render/Railway URL when deployed
// Replace this with your deployed Cloudflare Worker URL
const BACKEND_URL = 'https://engisim-chat-worker.engisim.workers.dev';
export function initChatbot() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'chatbot.css';
    document.head.appendChild(link);

    if (!customElements.get('emoji-picker')) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://unpkg.com/emoji-picker-element@1';
        document.head.appendChild(s);
    }

    const container = document.createElement('div');
    container.id = 'engisim-chatbot-container';
    container.innerHTML = `
        <button id="engisim-chatbot-fab">🤖</button>
        <div id="engisim-chatbot-window">
            <div id="engisim-chatbot-header">
                <div>
                    <h3>EngiBot (Live Server)</h3>
                    <span id="engisim-chatbot-tokens" style="font-size: 0.8rem; color: var(--color-primary);">Tokens: ...</span>
                </div>
                <div id="engisim-chatbot-header-actions">
                    <button class="chatbot-icon-btn" id="engisim-chatbot-btn-close" title="Close">✖️</button>
                </div>
            </div>
            
            <div id="engisim-chatbot-messages">
                <div class="chatbot-msg bot">
                    <p>Hello! I am EngiBot. Please ensure you are signed in to use the AI.</p>
                </div>
            </div>
            
            <div id="engisim-chatbot-input-area" style="position: relative; display: flex; align-items: center; gap: 4px;">
                <button id="chatbot-btn-emoji" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0 4px; color: var(--color-text);">😀</button>
                <div id="chatbot-emoji-popover" style="display: none; position: absolute; bottom: 100%; left: 0; z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.5); border-radius: 8px;">
                    <emoji-picker class="dark"></emoji-picker>
                </div>
                <input type="text" id="engisim-chatbot-input" placeholder="Ask a question..." style="flex: 1;">
                <button id="engisim-chatbot-send">➤</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const fab = document.getElementById('engisim-chatbot-fab');
    const chatWindow = document.getElementById('engisim-chatbot-window');
    const closeBtn = document.getElementById('engisim-chatbot-btn-close');
    const sendBtn = document.getElementById('engisim-chatbot-send');
    const inputEl = document.getElementById('engisim-chatbot-input');
    const msgsEl = document.getElementById('engisim-chatbot-messages');
    
    const emojiBtn = document.getElementById('chatbot-btn-emoji');
    const emojiPopover = document.getElementById('chatbot-emoji-popover');
    const picker = emojiPopover.querySelector('emoji-picker');

    emojiBtn.onclick = (e) => {
        e.stopPropagation();
        emojiPopover.style.display = emojiPopover.style.display === 'none' ? 'block' : 'none';
    };

    picker.addEventListener('emoji-click', event => {
        inputEl.value += event.detail.unicode;
        inputEl.focus();
    });

    document.addEventListener('click', e => {
        if (!emojiPopover.contains(e.target) && e.target !== emojiBtn) {
            emojiPopover.style.display = 'none';
        }
    });

    fab.onclick = () => {
        chatWindow.classList.add('open');
        fab.style.display = 'none';
        
        const user = getCurrentUser();
        if (!user) {
            appendMessage('bot', '⚠️ You are not signed in. Please click Sign In in the navigation bar to use EngiBot.');
            inputEl.disabled = true;
            sendBtn.disabled = true;
        } else {
            inputEl.disabled = false;
            sendBtn.disabled = false;
        }
    };

    const tokenEl = document.getElementById('engisim-chatbot-tokens');

    closeBtn.onclick = () => {
        chatWindow.classList.remove('open');
        fab.style.display = 'flex';
    };

    // Real-time credits tracking
    let unsubCredits = null;
    
    // Helper function to handle auth changes and credit listener
    async function handleAuthChange(user) {
        if (user) {
            inputEl.disabled = false;
            sendBtn.disabled = false;
            
            // Listen to credits
            if (unsubCredits) unsubCredits();
            
            try {
                const { db, doc, onSnapshot } = await import('./firebase.js');
                unsubCredits = onSnapshot(doc(db, 'users', user.uid), (snap) => {
                    const data = snap.data();
                    const creds = data?.credits || 0;
                    // Update token element to show credits
                    const currentText = tokenEl.textContent;
                    const reqText = currentText.includes('|') ? currentText.split('|')[1] : 'Requests Left: ?';
                    tokenEl.textContent = `Credits: ${creds} | ${reqText.trim()}`;
                });
            } catch (e) {
                console.error("Failed to load firebase for credits", e);
            }
        } else {
            inputEl.disabled = true;
            sendBtn.disabled = true;
            if (unsubCredits) {
                unsubCredits();
                unsubCredits = null;
            }
            tokenEl.textContent = "Tokens: ...";
        }
    }

    // Re-check auth if user signs in while chat is closed
    document.addEventListener('engisim-auth-changed', (e) => {
        handleAuthChange(e.detail.user);
    });
    
    // Initial check
    handleAuthChange(getCurrentUser());

    inputEl.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
    sendBtn.onclick = handleSend;

    async function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;

        const user = getCurrentUser();
        if (!user) {
            alert("You must be signed in to use the Chatbot.");
            return;
        }

        const isPremium = window.currentUserIsPremium || false;
        const charLimit = isPremium ? 2000 : 500;
        if (text.length > charLimit) {
            alert(`Your message is ${text.length} characters long. Your current plan limit is ${charLimit} characters. Please shorten it or upgrade to Premium.`);
            return;
        }

        inputEl.value = '';
        appendMessage('user', text);
        chatHistory.push({ role: 'user', content: text });
        
        showTyping();

        try {
            const idToken = await user.getIdToken();
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                    'X-User-Tier': isPremium ? 'pro' : 'free'
                },
                body: JSON.stringify({ messages: chatHistory })
            });

            const data = await response.json();
            hideTyping();

            if (!response.ok) {
                appendMessage('bot', `⚠️ Error: ${data.message || data.error}`);
            } else {
                chatHistory.push({ role: 'assistant', content: data.message.content });
                appendMessage('bot', data.message.content);
                tokenEl.textContent = `Tier: ${data.tier} | Requests Left: ${data.requestsLeft}`;
            }
        } catch (error) {
            console.error('Chat error:', error);
            hideTyping();
            appendMessage('bot', '⚠️ Could not connect to the EngiBot server. Please ensure the backend is running.');
        }
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `chatbot-msg ${sender}`;
        let formatted = text
            .replace(/**(.*?)**/g, '<strong>$1</strong>')
            .replace(/*(.*?)*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
        div.innerHTML = `<p>${formatted}</p>`;
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return div;
    }

    let typingEl = null;
    function showTyping() {
        typingEl = document.createElement('div');
        typingEl.className = 'chatbot-msg bot typing-indicator';
        typingEl.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        msgsEl.appendChild(typingEl);
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function hideTyping() {
        if (typingEl) {
            typingEl.remove();
            typingEl = null;
        }
    }
}


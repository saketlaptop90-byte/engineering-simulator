import { auth, db } from './firebase.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getCurrentUser } from './auth.js';

const BACKEND_URL = 'https://engisim-chat-worker.engisim.workers.dev';
let chatHistory = [];
let unsubscribe = null;


export async function loadCustomModels(machinesArray) {
    const STORAGE_KEY = 'engisim_custom_models';
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

export function initChatbot() {
    // Inject HTML
    const container = document.createElement('div');
    container.id = 'engisim-chatbot-container';
    container.innerHTML = `
        <button id="engisim-chatbot-fab" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg, #00c8ff, #7c6aff);color:white;font-size:24px;border:none;box-shadow:0 4px 15px rgba(0,200,255,0.4);cursor:pointer;z-index:9999;transition:transform 0.2s;">🤖</button>
        <div id="engisim-chatbot-window" style="display:none; position:fixed; bottom:90px; right:20px; width:380px; height:550px; background:#111827; border-radius:16px; border:1px solid rgba(255,255,255,0.1); box-shadow:0 10px 30px rgba(0,0,0,0.8); z-index:9999; overflow:hidden;">
            <div id="engisim-chatbot-header" style="display:flex; justify-content:space-between; align-items:center; background:#1f2937; padding:15px; border-bottom:1px solid rgba(255,255,255,0.1);">
                <h3 style="margin:0; font-size:16px; color:#fff;">EngiBot (AI)</h3>
                <div id="engisim-chatbot-header-actions" style="display:flex; gap:10px; align-items:center;">
                    <span id="engisim-chatbot-credits" style="color: #00c8ff; font-size: 12px; font-weight: bold; padding-right: 8px;" title="AI Credits Remaining">...</span>
                    <button class="chatbot-icon-btn" id="engisim-chatbot-btn-clear" title="Clear Chat" style="background:none;border:none;cursor:pointer;color:white;font-size:16px;">🧹</button>
                    <button class="chatbot-icon-btn" id="engisim-chatbot-btn-close" title="Close" style="background:none;border:none;cursor:pointer;color:white;font-size:16px;">✖️</button>
                </div>
            </div>
            
            <div id="engisim-chatbot-messages" style="flex:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; background:#111827;">
            </div>
            
            <div id="engisim-chatbot-input-area" style="position: relative; display: flex; align-items: center; gap: 8px; padding: 15px; background: #1f2937; border-top: 1px solid rgba(255,255,255,0.1);">
                <button id="chatbot-btn-emoji" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0 4px; color: white;">😀</button>
                <div id="chatbot-emoji-popover" style="display: none; position: absolute; bottom: 100%; left: 0; z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.5); border-radius: 8px;">
                    <emoji-picker class="dark"></emoji-picker>
                </div>
                <input type="text" id="engisim-chatbot-input" placeholder="Ask a question..." style="flex: 1; padding:12px; border-radius:20px; border:none; background:rgba(255,255,255,0.05); color:white; outline:none;">
                <button id="engisim-chatbot-send" style="background:linear-gradient(135deg, #00c8ff, #7c6aff); border:none; border-radius:50%; width:40px; height:40px; color:white; cursor:pointer;">➤</button>
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
    const clearBtn = document.getElementById('engisim-chatbot-btn-clear');
    
    const emojiBtn = document.getElementById('chatbot-btn-emoji');
    const emojiPopover = document.getElementById('chatbot-emoji-popover');
    const picker = emojiPopover.querySelector('emoji-picker');

    fab.onmouseenter = (e) => e.target.style.transform = 'scale(1.1)';
    fab.onmouseleave = (e) => e.target.style.transform = 'scale(1)';

    emojiBtn.onclick = (e) => {
        e.stopPropagation();
        emojiPopover.style.display = emojiPopover.style.display === 'none' ? 'block' : 'none';
    };

    picker.addEventListener('emoji-click', event => {
        inputEl.value += event.detail.unicode;
        inputEl.focus();
    });

    document.addEventListener('click', (e) => {
        if (!emojiBtn.contains(e.target) && !emojiPopover.contains(e.target)) {
            emojiPopover.style.display = 'none';
        }
    });

    fab.onclick = () => {
        chatWindow.style.display = 'flex';
        chatWindow.style.flexDirection = 'column';
        fab.style.display = 'none';
        
        const user = auth.currentUser || getCurrentUser();
        if (user) {
            loadHistory(user);
            fetchCredits(user);
        } else {
            msgsEl.innerHTML = '';
            appendMessage('bot', 'You are not signed in. Please sign in to use the AI Chatbot.');
        }
    };

    closeBtn.onclick = () => {
        chatWindow.style.display = 'none';
        fab.style.display = 'block';
    };

    clearBtn.onclick = () => {
        const user = auth.currentUser || getCurrentUser();
        if (!user) return;
        localStorage.setItem(`engibot_clearedAt_${user.uid}`, Date.now());
        msgsEl.innerHTML = '';
        chatHistory = [];
        appendMessage('bot', 'Chat history cleared for this session.');
    };

    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `chatbot-msg ${role}`;
        div.style.padding = '10px 14px';
        div.style.borderRadius = '16px';
        div.style.maxWidth = '85%';
        div.style.wordBreak = 'break-word';
        div.style.marginBottom = '8px';
        div.style.fontSize = '14px';
        div.style.lineHeight = '1.4';
        
        if (role === 'user') {
            div.style.background = '#00c8ff';
            div.style.color = '#000';
            div.style.alignSelf = 'flex-end';
            div.style.borderBottomRightRadius = '4px';
        } else {
            div.style.background = '#2a3149';
            div.style.color = '#fff';
            div.style.alignSelf = 'flex-start';
            div.style.borderBottomLeftRadius = '4px';
        }
        
        const p = document.createElement('p');
        p.style.margin = '0';
        if (role === 'bot') p.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        else p.textContent = text;
        
        div.appendChild(p);
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return div;
    }

    async function loadHistory(user) {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        const clearedAt = parseInt(localStorage.getItem(`engibot_clearedAt_${user.uid}`) || '0');
        
        const q = query(collection(db, `chats/engibot_${user.uid}/messages`), orderBy('timestamp', 'asc'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
            msgsEl.innerHTML = '';
            chatHistory = [];
            let shownCount = 0;
            
            snapshot.forEach(docSnap => {
                const msg = docSnap.data();
                const msgTime = msg.timestamp ? msg.timestamp.toMillis() : Date.now();
                if (msgTime < clearedAt) return; // Hide cleared messages
                
                shownCount++;
                if (msg.senderUid === 'bot') {
                    chatHistory.push({ role: 'assistant', content: msg.text });
                    appendMessage('bot', msg.text);
                } else {
                    chatHistory.push({ role: 'user', content: msg.text });
                    appendMessage('user', msg.text);
                }
            });
            
            if (shownCount === 0) {
                appendMessage('bot', 'Hello! I am EngiBot, your AI Assistant. How can I help you today?');
            }
            
            setTimeout(() => msgsEl.scrollTop = msgsEl.scrollHeight, 100);
        });
    }

    async function handleSend() {
        const user = auth.currentUser || getCurrentUser();
        if (!user) {
            appendMessage('bot', 'You are not signed in.');
            return;
        }
        const text = inputEl.value.trim();
        if (!text) return;
        
        inputEl.value = '';
        
        try {
            await addDoc(collection(db, `chats/engibot_${user.uid}/messages`), {
                senderUid: user.uid,
                text: text,
                timestamp: serverTimestamp()
            });
            
            const tempDiv = appendMessage('bot', 'Typing...');
            const textEl = tempDiv.querySelector('p');
            
            const isPremium = window.currentUserIsPremium ? 'pro' : 'free';
            const idToken = await user.getIdToken();
            
            const reqHistory = chatHistory.slice(-5); // Keep last 5 messages for context
            reqHistory.push({ role: 'user', content: text });
            
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                    'X-User-Tier': isPremium
                },
                body: JSON.stringify({ messages: reqHistory })
            });

            if (!response.ok) {
                const err = await response.json();
                textEl.textContent = `Error: ${err.error || 'Server error'}`;
                textEl.style.color = '#ef4444';
                return;
            }

            textEl.textContent = '';
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullResponse = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.response) {
                                fullResponse += parsed.response;
                                textEl.innerHTML = fullResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
                                msgsEl.scrollTop = msgsEl.scrollHeight;
                            }
                        } catch (e) {}
                    }
                }
            }
            
            await addDoc(collection(db, `chats/engibot_${user.uid}/messages`), {
                senderUid: 'bot',
                text: fullResponse,
                timestamp: serverTimestamp()
            });
            tempDiv.remove(); 
            fetchCredits(user);
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchCredits(user) {
        try {
            const token = await user.getIdToken();
            const response = await fetch(BACKEND_URL + '/credits', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-Tier': window.currentUserIsPremium ? 'pro' : 'free'
                }
            });
            if (response.ok) {
                const data = await response.json();
                document.getElementById('engisim-chatbot-credits').textContent = `${data.credits} Credits`;
            }
        } catch(e) {
            console.error('Failed to fetch AI credits:', e);
        }
    }

    sendBtn.onclick = handleSend;
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });
}

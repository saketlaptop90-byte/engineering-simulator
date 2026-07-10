// chatbot.js
import * as webllm from "https://esm.run/@mlc.ai/web-llm";

const STORAGE_KEY = 'engisim_custom_models';
let chatHistory = [];
let engine = null;
let isInitializing = false;
let selectedModel = 'Llama-3-8B-Instruct-q4f32_1-MLC';

try { 
    selectedModel = localStorage.getItem('engisim_webllm_model') || 'Llama-3-8B-Instruct-q4f32_1-MLC'; 
} catch(e) { 
    console.warn('localStorage not available', e); 
}

export async function loadCustomModels(machinesArray) {
    let customModels = [];
    try { customModels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { console.warn('localStorage not available'); }
    for (const model of customModels) {
        try {
            // Re-evaluate the module code using a Blob
            const blob = new Blob([model.code], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const module = await import(url);
            
            // Assume the first exported function is the creation function
            const createFn = Object.values(module)[0];
            
            // Add to MACHINES array
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
    // Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'chatbot.css';
    document.head.appendChild(link);

    // Inject HTML
    const container = document.createElement('div');
    container.id = 'engisim-chatbot-container';
    container.innerHTML = `
        <button id="engisim-chatbot-fab">🤖</button>
        <div id="engisim-chatbot-window">
            <div id="engisim-chatbot-header">
                <h3>EngiSim Local AI</h3>
                <div id="engisim-chatbot-header-actions">
                    <button class="chatbot-icon-btn" id="engisim-chatbot-btn-settings" title="Settings">⚙️</button>
                    <button class="chatbot-icon-btn" id="engisim-chatbot-btn-close" title="Close">✖️</button>
                </div>
            </div>
            
            <div id="engisim-chatbot-messages">
                <div class="chatbot-msg bot">
                    <p>Hello! I am EngiSim AI. I run 100% locally on your device via WebGPU. No tokens, no servers, full privacy!</p>
                </div>
                <div id="engisim-ai-progress-container" style="display:none; padding: 10px; background: rgba(0,200,255,0.1); border-radius: 8px; margin: 10px; font-size: 12px; text-align: center; color: #00c8ff;">
                    <div id="engisim-ai-progress-text">Initializing Engine...</div>
                    <div style="width: 100%; background: #222; height: 6px; border-radius: 3px; margin-top: 5px; overflow: hidden;">
                        <div id="engisim-ai-progress-bar" style="width: 0%; background: #00c8ff; height: 100%; transition: width 0.3s;"></div>
                    </div>
                </div>
            </div>
            
            <div id="engisim-chatbot-input-area">
                <input type="text" id="engisim-chatbot-input" placeholder="Ask a question or request a model..." disabled>
                <button id="engisim-chatbot-send" disabled>➤</button>
            </div>
            
            <!-- Settings Modal -->
            <div id="engisim-chatbot-settings">
                <h4>AI Settings</h4>
                <label>WebLLM Model</label>
                <select id="engisim-chatbot-model-select" style="width: 100%; padding: 8px; border-radius: 6px; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 20px;">
                    <option value="Llama-3-8B-Instruct-q4f32_1-MLC">Llama 3 8B (High Quality, ~4.5GB)</option>
                    <option value="Phi-3-mini-4k-instruct-q4f16_1-MLC">Phi-3 Mini (Fast, ~2.2GB)</option>
                    <option value="Mistral-7B-Instruct-v0.3-q4f16_1-MLC">Mistral 7B (~4GB)</option>
                </select>
                <div>
                    <button class="settings-btn" id="engisim-chatbot-save-settings">Save & Reload</button>
                    <button class="settings-btn secondary" id="engisim-chatbot-cancel-settings">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Event Listeners
    const fab = document.getElementById('engisim-chatbot-fab');
    const chatWindow = document.getElementById('engisim-chatbot-window');
    const closeBtn = document.getElementById('engisim-chatbot-btn-close');
    const settingsBtn = document.getElementById('engisim-chatbot-btn-settings');
    const settingsModal = document.getElementById('engisim-chatbot-settings');
    const saveSettings = document.getElementById('engisim-chatbot-save-settings');
    const cancelSettings = document.getElementById('engisim-chatbot-cancel-settings');
    const modelSelect = document.getElementById('engisim-chatbot-model-select');
    const sendBtn = document.getElementById('engisim-chatbot-send');
    const inputEl = document.getElementById('engisim-chatbot-input');
    const msgsEl = document.getElementById('engisim-chatbot-messages');
    
    const progressContainer = document.getElementById('engisim-ai-progress-container');
    const progressText = document.getElementById('engisim-ai-progress-text');
    const progressBar = document.getElementById('engisim-ai-progress-bar');

    modelSelect.value = selectedModel;

    fab.onclick = async () => {
        chatWindow.classList.add('open');
        fab.style.display = 'none';
        
        if (!engine && !isInitializing) {
            await initializeWebLLM();
        }
    };

    closeBtn.onclick = () => {
        chatWindow.classList.remove('open');
        fab.style.display = 'flex';
    };

    settingsBtn.onclick = () => {
        modelSelect.value = selectedModel;
        settingsModal.classList.add('open');
    };

    cancelSettings.onclick = () => settingsModal.classList.remove('open');

    saveSettings.onclick = () => {
        selectedModel = modelSelect.value;
        localStorage.setItem('engisim_webllm_model', selectedModel);
        settingsModal.classList.remove('open');
        window.location.reload(); // Reload to re-initialize with new model
    };

    inputEl.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
    sendBtn.onclick = handleSend;

    async function initializeWebLLM() {
        isInitializing = true;
        progressContainer.style.display = 'block';
        inputEl.disabled = true;
        sendBtn.disabled = true;
        
        try {
            const initProgressCallback = (report) => {
                progressText.innerText = report.text;
                // Try to parse progress percentage from report string if possible, or just animate
                const match = report.text.match(/(\d+)\/(\d+)/);
                if (match) {
                    const pct = (parseInt(match[1]) / parseInt(match[2])) * 100;
                    progressBar.style.width = pct + '%';
                }
            };
            
            engine = await webllm.CreateMLCEngine(selectedModel, {
                initProgressCallback: initProgressCallback
            });
            
            progressContainer.style.display = 'none';
            appendMessage('bot', `AI Engine loaded successfully! Running ${selectedModel} locally.`);
            inputEl.disabled = false;
            sendBtn.disabled = false;
            inputEl.focus();
        } catch (error) {
            console.error(error);
            progressText.innerText = 'Failed to load WebGPU AI Engine.';
            progressBar.style.backgroundColor = 'red';
            appendMessage('bot', 'Error initializing AI: Your browser might not support WebGPU, or the model failed to download. Error: ' + error.message);
        }
        isInitializing = false;
    }

    async function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;
        if (!engine) return;

        inputEl.value = '';
        appendMessage('user', text);
        chatHistory.push({ role: 'user', content: text });
        
        showTyping();

        try {
            // Build system instructions with context of available machines
            let machinesList = "";
            if (window.ENGISIM_MACHINES) {
                // Just grab a tiny sample to save context window, or list all if small enough
                const sample = window.ENGISIM_MACHINES.slice(0, 50).map(m => `- ${m.name} (ID: ${m.id})`).join('\n');
                machinesList = "\n\nAvailable Models in Registry (Sample):\n" + sample;
            }

            const systemPrompt = `You are EngiSim AI, a highly advanced assistant embedded in EngiSim3D, an interactive engineering simulator.
Your role:
1. Answer questions about the simulator and help users find specific models.
2. If the user asks you to CREATE or CUSTOMIZE a model, you MUST generate valid Javascript code using THREE.js.
   The code must be an ES module that exports exactly one function (e.g. \`export function createCustomModel(THREE)\`).
   The function must return an object: \`{ group: THREE.Group, animationClips: Array<THREE.AnimationClip> }\`.
   Wrap the code strictly in \`\`\`javascript ... \`\`\` codeblocks.
   Do not explain the code too much; the system will automatically extract and run it in real-time.
   ${machinesList}`;

            const messages = [
                { role: "system", content: systemPrompt },
                ...chatHistory
            ];

            const reply = await engine.chat.completions.create({
                messages: messages,
                temperature: 0.7
            });
            
            const responseText = reply.choices[0].message.content;
            hideTyping();
            
            chatHistory.push({ role: 'assistant', content: responseText });
            
            // Check for code generation
            const codeBlockRegex = /```(?:javascript|js)\n([\s\S]*?)```/;
            const match = responseText.match(codeBlockRegex);
            
            if (match) {
                const code = match[1];
                let desc = responseText.replace(codeBlockRegex, '').trim();
                appendMessage('bot', desc || "I generated a custom model for you!");
                await handleCodeGeneration(code);
            } else {
                appendMessage('bot', responseText);
            }

        } catch (error) {
            hideTyping();
            appendMessage('bot', 'Error generating response: ' + error.message);
        }
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `chatbot-msg ${sender}`;
        // Basic markdown formatting
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
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

    async function handleCodeGeneration(code) {
        let finalCode = code;
        }

        try {
            const blob = new Blob([finalCode], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const module = await import(url);
            const createFn = Object.values(module)[0];
            
            if (typeof createFn !== 'function') throw new Error("Exported value is not a function.");

            const modelId = 'custom_' + Date.now();
            const modelName = 'Custom Model ' + Math.floor(Math.random() * 1000);

            // Save to local storage
            let customModels = [];
            try { customModels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { console.warn('localStorage not available'); }
            customModels.push({
                id: modelId,
                name: modelName,
                code: finalCode
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customModels));

            // Add to runtime MACHINES
            if (window.ENGISIM_MACHINES) {
                window.ENGISIM_MACHINES.push({
                    id: modelId,
                    name: modelName,
                    icon: '🤖',
                    category: 'custom',
                    create: createFn
                });
            }

            // Create interactive UI buttons for it in the chat
            const msgDiv = document.createElement('div');
            msgDiv.className = `chatbot-msg bot`;
            msgDiv.innerHTML = `<p>Model saved as <strong>${modelName}</strong>!</p>`;
            
            const loadBtn = document.createElement('button');
            loadBtn.className = 'chatbot-action-btn';
            loadBtn.innerText = 'Load in Viewer';
            loadBtn.onclick = () => {
                const url = new URL(window.location);
                url.searchParams.set('model', modelId);
                window.history.pushState({}, '', url);
                if (window.loadMachineById) {
                    window.loadMachineById(modelId);
                } else {
                    window.location.reload();
                }
            };

            const delBtn = document.createElement('button');
            delBtn.className = 'chatbot-action-btn delete';
            delBtn.innerText = 'Undo / Delete';
            delBtn.onclick = () => {
                let models = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                models = models.filter(m => m.id !== modelId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
                if (window.ENGISIM_MACHINES) {
                    const idx = window.ENGISIM_MACHINES.findIndex(m => m.id === modelId);
                    if (idx > -1) window.ENGISIM_MACHINES.splice(idx, 1);
                }
                msgDiv.innerHTML = `<p>Model deleted.</p>`;
            };

            msgDiv.appendChild(loadBtn);
            msgDiv.appendChild(delBtn);
            msgsEl.appendChild(msgDiv);
            msgsEl.scrollTop = msgsEl.scrollHeight;

        } catch (e) {
            console.error(e);
            appendMessage('bot', 'I generated code, but there was an error executing it: ' + e.message);
        }
    }
}

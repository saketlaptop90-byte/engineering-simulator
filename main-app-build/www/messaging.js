import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, getDocs, setDoc, updateDoc, where } from './firebase.js';
import { getCurrentUser, getCurrentUniqueId, logActivity } from './auth.js';

let currentChatId = null;
let unsubscribeMessages = null;
let currentChatType = null;
let currentChatParticipants = [];

export function initMessaging() {
    const container = document.getElementById('messaging-container');
    const prompt = document.getElementById('sign-in-prompt');
    const chatListEl = document.getElementById('chat-list');
    const chatWindow = document.getElementById('chat-window');
    const messagesArea = document.getElementById('messages-area');
    const btnSend = document.getElementById('btn-send-message');
    const inputMsg = document.getElementById('message-input-box');
    const btnSearch = document.getElementById('btn-search-user');
    const inputSearch = document.getElementById('search-user-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const btnCreateGroup = document.getElementById('btn-create-group');
    const chatHeaderTitle = document.getElementById('chat-header-title');
    const btnBackToList = document.getElementById('btn-back-to-list');
    const msgSidebar = document.getElementById('msg-sidebar');
    
    // Profile Elements
    const profilePanel = document.getElementById('profile-panel');
    const btnOpenProfile = document.getElementById('btn-open-profile');
    const btnCloseProfile = document.getElementById('btn-close-profile');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileUniqueId = document.getElementById('profile-unique-id');
    const newIdInput = document.getElementById('new-id-input');
    const btnChangeId = document.getElementById('btn-change-id');
    const idStatus = document.getElementById('id-status');

    // Members Elements
    const membersPanel = document.getElementById('members-panel');
    const btnShowMembers = document.getElementById('btn-show-members');
    const btnCloseMembers = document.getElementById('btn-close-members');
    const membersList = document.getElementById('members-list');

    // Emoji Picker (Simple integrated version)
    const emojiList = ["😀","😂","🥰","😎","🤔","👍","👎","🔥","❤️","✨","🙌","💡","🚀","🛠️","⚙️"];
    const emojiDiv = document.createElement('div');
    emojiDiv.style.cssText = "position:absolute; bottom:100%; right:20px; background:rgba(12,18,37,0.95); border:1px solid #00c8ff; border-radius:8px; padding:10px; display:none; flex-wrap:wrap; gap:8px; width:220px; margin-bottom:10px; z-index:1000;";
    emojiList.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.cssText = "font-size:1.5rem; cursor:pointer; transition:transform 0.2s;";
        span.onmouseover = () => span.style.transform = "scale(1.2)";
        span.onmouseout = () => span.style.transform = "scale(1)";
        span.onclick = () => { inputMsg.value += emoji; inputMsg.focus(); emojiDiv.style.display='none'; };
        emojiDiv.appendChild(span);
    });
    document.querySelector('.message-input').style.position = 'relative';
    document.querySelector('.message-input').appendChild(emojiDiv);

    const btnEmoji = document.createElement('button');
    btnEmoji.textContent = '😊';
    btnEmoji.style.cssText = "background:transparent; border:none; font-size:1.5rem; cursor:pointer;";
    btnEmoji.onclick = (e) => { e.preventDefault(); emojiDiv.style.display = emojiDiv.style.display === 'none' ? 'flex' : 'none'; };
    document.querySelector('.message-input').insertBefore(btnEmoji, inputMsg);

    document.addEventListener('engisim-auth-changed', (e) => {
        const user = e.detail.user;
        const blocks = e.detail.blocks;
        if (user) {
            prompt.style.display = 'none';
            if (blocks && (blocks.global || blocks.chat)) {
                container.style.display = 'none';
                prompt.innerHTML = '<p style="color:#ef4444;">You are blocked from using Chat.</p>';
                prompt.style.display = 'flex';
            } else {
                container.style.display = 'flex';
                loadChats(user.uid);
                updateProfilePanel(user, e.detail.uniqueId);
            }
        } else {
            prompt.innerHTML = '<p>Please Sign In to access Messages</p>';
            prompt.style.display = 'flex';
            container.style.display = 'none';
            chatListEl.innerHTML = '';
            chatWindow.style.display = 'none';
            profilePanel.style.display = 'none';
        }
    });

    // Profile Panel Logic
    btnOpenProfile.onclick = () => profilePanel.style.display = 'block';
    btnCloseProfile.onclick = () => profilePanel.style.display = 'none';

    function updateProfilePanel(user, uniqueId) {
        profileAvatar.src = user.photoURL || 'https://via.placeholder.com/80';
        profileName.textContent = user.displayName || 'User';
        profileEmail.textContent = user.email || 'No email';
        profileUniqueId.innerHTML = (uniqueId || 'Loading...') + (window.currentUserIsPremium ? ' <span title="Premium ID" style="color: gold; text-shadow: 0 0 5px gold;">⭐</span>' : '');
    }

    btnChangeId.onclick = async () => {
        const newId = newIdInput.value.trim().toLowerCase();
        if (!newId.startsWith('@')) {
            idStatus.textContent = "ID must start with @";
            idStatus.style.color = "#ef4444";
            return;
        }
        if (newId.length < 4 || newId.length > 30) {
            idStatus.textContent = "ID must be between 4-30 chars";
            idStatus.style.color = "#ef4444";
            return;
        }
        if (!/^@[a-z0-9_]+$/.test(newId)) {
            idStatus.textContent = "Only lowercase letters, numbers, and underscores allowed";
            idStatus.style.color = "#ef4444";
            return;
        }

        btnChangeId.disabled = true;
        idStatus.textContent = "Checking availability...";
        idStatus.style.color = "white";

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uniqueId', '==', newId));
            const snap = await getDocs(q);
            
            if (!snap.empty) {
                idStatus.textContent = "ID is already taken!";
                idStatus.style.color = "#ef4444";
            } else {
                const user = getCurrentUser();
                await updateDoc(doc(db, 'users', user.uid), { uniqueId: newId });
                idStatus.textContent = "ID claimed successfully!";
                idStatus.style.color = "#10b981";
                profileUniqueId.textContent = newId;
                await logActivity(user, 'changed_id', { newId: newId });
                
                // Tell other scripts
                document.dispatchEvent(new CustomEvent('engisim-auth-changed', { detail: { user, uniqueId: newId } }));
            }
        } catch (e) {
            console.error(e);
            idStatus.textContent = "Error checking ID";
            idStatus.style.color = "#ef4444";
        }
        btnChangeId.disabled = false;
    };

    const btnBuyPremiumId = document.getElementById('btn-buy-premium-id');
    if (btnBuyPremiumId) {
        btnBuyPremiumId.onclick = async () => {
            const newId = newIdInput.value.trim().toLowerCase();
            if (!newId.startsWith('@')) return idStatus.textContent = "ID must start with @";
            if (newId.length < 4 || newId.length > 30) return idStatus.textContent = "ID must be between 4-30 chars";
            if (!/^@[a-z0-9_]+$/.test(newId)) return idStatus.textContent = "Only lowercase letters, numbers, and underscores allowed";

            const proceed = confirm("Proceed to purchase Premium ID " + newId + " for $4.99? (Simulated)");
            if (!proceed) return;

            btnBuyPremiumId.disabled = true;
            idStatus.textContent = "Processing payment and reserving ID...";
            idStatus.style.color = "white";

            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uniqueId', '==', newId));
                const snap = await getDocs(q);
                
                if (!snap.empty) {
                    idStatus.textContent = "ID is already taken!";
                    idStatus.style.color = "#ef4444";
                } else {
                    const user = getCurrentUser();
                    await updateDoc(doc(db, 'users', user.uid), { uniqueId: newId, isPremium: true });
                    window.currentUserIsPremium = true;
                    idStatus.textContent = "Premium ID claimed successfully!";
                    idStatus.style.color = "#ffd700";
                    profileUniqueId.innerHTML = newId + ' ⭐';
                    await logActivity(user, 'bought_premium_id', { newId: newId });
                    
                    document.dispatchEvent(new CustomEvent('engisim-auth-changed', { detail: { user, uniqueId: newId, isPremium: true } }));
                }
            } catch (e) {
                console.error(e);
                idStatus.textContent = "Transaction failed.";
                idStatus.style.color = "#ef4444";
            }
            btnBuyPremiumId.disabled = false;
        };
    }

    // Members Panel Logic
    btnShowMembers.onclick = () => {
        if (currentChatType === 'group') {
            membersPanel.style.display = 'block';
            loadMembers();
        }
    };
    btnCloseMembers.onclick = () => membersPanel.style.display = 'none';

    async function loadMembers() {
        membersList.innerHTML = 'Loading...';
        try {
            const snap = await getDoc(doc(db, 'chats', currentChatId));
            if (!snap.exists()) return;
            const data = snap.data();
            const uids = data.participants;
            
            membersList.innerHTML = '';
            for (const uid of uids) {
                const userSnap = await getDoc(doc(db, 'users', uid));
                if (userSnap.exists()) {
                    const uData = userSnap.data();
                    const div = document.createElement('div');
                    div.className = 'member-item';
                    div.innerHTML = `
                        <img src="${uData.photoURL || 'https://via.placeholder.com/32'}">
                        <div>
                            <div class="m-name">${uData.displayName || 'Unknown'}</div>
                            <div class="m-id">${uData.uniqueId || ''}</div>
                        </div>
                    `;
                    membersList.appendChild(div);
                }
            }
        } catch(e) {
            console.error(e);
            membersList.innerHTML = 'Error loading members';
        }
    }

    // Search Autocomplete
    let searchTimeout = null;
    let cachedUsers = null;

    inputSearch.addEventListener('input', () => {
        const val = inputSearch.value.trim().toLowerCase();
        if (val.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                if (!cachedUsers) {
                    const snap = await getDocs(collection(db, 'users'));
                    cachedUsers = [];
                    snap.forEach(d => cachedUsers.push(d.data()));
                }
                
                const matches = cachedUsers.filter(u => 
                    u.uniqueId && u.uniqueId.toLowerCase().includes(val)
                );
                
                suggestionsBox.innerHTML = '';
                if (matches.length === 0) {
                    suggestionsBox.style.display = 'none';
                    return;
                }
                
                matches.forEach(u => {
                    if (u.uniqueId === getCurrentUniqueId()) return; // Skip self
                    
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `
                        <img src="${u.photoURL || 'https://via.placeholder.com/28'}">
                        <div>
                            <div class="s-name">${u.displayName || 'User'}</div>
                            <div class="s-id">${u.uniqueId}</div>
                        </div>
                    `;
                    div.onclick = () => {
                        inputSearch.value = u.uniqueId;
                        suggestionsBox.style.display = 'none';
                    };
                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = suggestionsBox.children.length > 0 ? 'block' : 'none';
            } catch (e) {
                console.error(e);
            }
        }, 300);
    });

    const btnEmojiPicker = document.getElementById('btn-emoji-chat');
    const emojiPopover = document.getElementById('emoji-popover-chat');
    if (btnEmojiPicker && emojiPopover) {
        const emojiPicker = emojiPopover.querySelector('emoji-picker');
        btnEmojiPicker.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPopover.style.display = emojiPopover.style.display === 'none' ? 'block' : 'none';
        });
        emojiPicker.addEventListener('emoji-click', event => {
            inputMsg.value += event.detail.unicode;
        });
        document.addEventListener('click', (e) => {
            if (!emojiPopover.contains(e.target) && e.target !== btnEmojiPicker) {
                emojiPopover.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) suggestionsBox.style.display = 'none';
    });

    // Mobile Back Button
    btnBackToList.onclick = () => {
        chatWindow.style.display = 'none';
        msgSidebar.classList.remove('hidden-mobile');
    };

    btnSearch.onclick = async () => {
        let targetId = inputSearch.value.trim().toLowerCase();
        if (!targetId) return;
        if (!targetId.startsWith('@')) targetId = '@' + targetId;
        const user = getCurrentUser();
        if (!user) return;
        if (targetId === getCurrentUniqueId()) {
            alert("You cannot chat with yourself.");
            return;
        }

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uniqueId', '==', targetId));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                alert("User not found: " + targetId + ". Try selecting from the suggestions.");
                return;
            }
            
            const targetDoc = snapshot.docs[0];
            const targetUid = targetDoc.id;
            
            // Check for existing chat
            const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
            const chatSnap = await getDocs(chatsQuery);
            let existingChatId = null;
            chatSnap.forEach(doc => {
                const data = doc.data();
                if (data.type === 'direct' && data.participants.includes(targetUid)) {
                    existingChatId = doc.id;
                }
            });

            if (existingChatId) {
                inputSearch.value = '';
                openChat(existingChatId, targetId, 'direct', [getCurrentUniqueId(), targetId]);
                return;
            }
            
            // Create a new direct chat
            const newChatRef = await addDoc(collection(db, 'chats'), {
                type: 'direct',
                participants: [user.uid, targetUid],
                participantIds: [getCurrentUniqueId(), targetId],
                updatedAt: serverTimestamp()
            });
            
            inputSearch.value = '';
            openChat(newChatRef.id, targetId, 'direct', [getCurrentUniqueId(), targetId]);
            await logActivity(user, 'chat_created', { chatId: newChatRef.id, type: 'direct', withUser: targetId });
            
        } catch (err) {
            console.error("Error creating chat", err);
            alert("Error creating chat.");
        }
    };

    btnCreateGroup.onclick = async () => {
        const groupName = window.prompt("Enter Group Name:");
        if (!groupName) return;
        const membersStr = window.prompt("Enter up to 14 comma-separated Unique IDs of members to add:");
        if (!membersStr) return;
        
        const members = membersStr.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        if (members.length > 14) {
            alert("Maximum 14 additional members allowed.");
            return;
        }
        
        const user = getCurrentUser();
        const participantUids = [user.uid];
        const participantIds = [getCurrentUniqueId()];
        
        try {
            for (const mId of members) {
                const q = query(collection(db, 'users'), where('uniqueId', '==', mId));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    participantUids.push(snap.docs[0].id);
                    participantIds.push(mId);
                }
            }
            
            const newChatRef = await addDoc(collection(db, 'chats'), {
                type: 'group',
                name: groupName,
                participants: participantUids,
                participantIds: participantIds,
                updatedAt: serverTimestamp()
            });
            
            openChat(newChatRef.id, groupName, 'group', participantIds);
            await logActivity(user, 'group_created', { chatId: newChatRef.id, groupName: groupName, members: participantIds });
        } catch(e) {
            console.error(e);
            alert("Error creating group");
        }
    };

    btnSend.onclick = sendMessage;
    inputMsg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        if (!currentChatId) return;
        let text = inputMsg.value.trim();
        if (!text) return;
        if (text.length > 500) text = text.substring(0, 500);
        
        const user = getCurrentUser();
        const uniqueId = getCurrentUniqueId();
        inputMsg.value = '';
        emojiDiv.style.display = 'none';
        
        try {
            await addDoc(collection(db, `chats/${currentChatId}/messages`), {
                senderUid: user.uid,
                senderId: uniqueId,
                senderIsPremium: !!window.currentUserIsPremium,
                text: text,
                timestamp: serverTimestamp()
            });
            await updateDoc(doc(db, 'chats', currentChatId), {
                updatedAt: serverTimestamp()
            });
            await logActivity(user, 'message_sent', { chatId: currentChatId, textLength: text.length });
        } catch (e) {
            console.error(e);
            alert("Error sending message.");
        }
    }

    function loadChats(uid) {
        const q = query(collection(db, 'chats'), where('participants', 'array-contains', uid));
        onSnapshot(q, (snapshot) => {
            chatListEl.innerHTML = '';
            const chats = [];
            snapshot.forEach(doc => chats.push({id: doc.id, ...doc.data()}));
            chats.sort((a,b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
            
            chats.forEach(chat => {
                const div = document.createElement('div');
                div.className = 'chat-item';
                if (chat.id === currentChatId) div.classList.add('active');
                
                let chatName = chat.name || "Chat";
                if (chat.type === 'direct') {
                    const otherId = chat.participantIds.find(id => id !== getCurrentUniqueId());
                    chatName = otherId || "Unknown";
                }
                
                const initials = chatName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
                
                div.innerHTML = `
                    <div class="chat-icon">${initials}</div>
                    <div class="chat-info">
                        <div class="chat-name">${chatName}</div>
                        <div class="chat-type">${chat.type === 'group' ? 'Group' : 'Direct'}</div>
                    </div>
                `;
                
                div.onclick = () => {
                    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    openChat(chat.id, chatName, chat.type, chat.participantIds);
                };
                chatListEl.appendChild(div);
            });
        });
    }

    function openChat(chatId, title, type, participants) {
        currentChatId = chatId;
        currentChatType = type;
        currentChatParticipants = participants || [];
        
        chatWindow.style.display = 'flex';
        chatHeaderTitle.textContent = title;
        if (window.innerWidth <= 768) {
            msgSidebar.classList.add('hidden-mobile');
        }
        
        btnShowMembers.style.display = type === 'group' ? 'inline-block' : 'none';
        
        if (unsubscribeMessages) unsubscribeMessages();
        
        const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
        unsubscribeMessages = onSnapshot(q, (snapshot) => {
            messagesArea.innerHTML = '';
            snapshot.forEach(docSnap => {
                const msg = docSnap.data();
                const div = document.createElement('div');
                const isMine = msg.senderUid === getCurrentUser().uid;
                div.className = `message ${isMine ? 'sent' : 'received'}`;
                
                const senderEl = document.createElement('div');
                senderEl.style.fontSize = '0.7rem';
                senderEl.style.opacity = '0.7';
                senderEl.style.marginBottom = '4px';
                senderEl.innerHTML = msg.senderId + (msg.senderIsPremium ? ' <span title="Premium" style="color: gold;">⭐</span>' : '');
                
                const textEl = document.createElement('div');
                textEl.textContent = msg.text;
                
                if (!isMine) div.appendChild(senderEl);
                div.appendChild(textEl);
                messagesArea.appendChild(div);
            });
            setTimeout(() => messagesArea.scrollTop = messagesArea.scrollHeight, 100);
        });
    }
}

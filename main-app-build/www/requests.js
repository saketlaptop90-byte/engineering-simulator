import { db, getCurrentUser } from './auth.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let unsubscribeRequests = null;

export function initRequests() {
    const container = document.getElementById('requests-container');
    const prompt = document.getElementById('sign-in-prompt');
    const form = document.getElementById('request-form');
    const btnSubmit = document.getElementById('btn-submit-req');
    const msgEl = document.getElementById('req-msg');
    const listEl = document.getElementById('my-requests-list');

    document.addEventListener('engisim-auth-changed', (e) => {
        const user = e.detail.user;
        if (user) {
            prompt.style.display = 'none';
            container.style.display = 'flex';
            setupRequestsListener(user.uid);
        } else {
            prompt.style.display = 'flex';
            container.style.display = 'none';
            if (unsubscribeRequests) {
                unsubscribeRequests();
                unsubscribeRequests = null;
            }
        }
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) return;

        const title = document.getElementById('req-title').value.trim();
        const desc = document.getElementById('req-desc').value.trim();
        const link = document.getElementById('req-link').value.trim();

        if (!title || !desc) return;

        btnSubmit.disabled = true;
        msgEl.textContent = "Submitting request...";
        msgEl.style.color = "white";

        try {
            await addDoc(collection(db, 'model_requests'), {
                uid: user.uid,
                title: title,
                description: desc,
                link: link,
                status: 'pending', // pending, accepted, rejected
                createdAt: serverTimestamp()
            });
            form.reset();
            msgEl.textContent = "Request submitted successfully!";
            msgEl.style.color = "#10b981";
            setTimeout(() => msgEl.textContent = '', 3000);
        } catch (err) {
            console.error(err);
            msgEl.textContent = "Error submitting request.";
            msgEl.style.color = "#ef4444";
        }
        btnSubmit.disabled = false;
    };

    function setupRequestsListener(uid) {
        if (unsubscribeRequests) unsubscribeRequests();
        
        const q = query(
            collection(db, 'model_requests'), 
            where('uid', '==', uid),
            orderBy('createdAt', 'desc')
        );

        unsubscribeRequests = onSnapshot(q, (snapshot) => {
            listEl.innerHTML = '';
            if (snapshot.empty) {
                listEl.innerHTML = '<div style="color:rgba(255,255,255,0.5);">You haven\'t made any requests yet.</div>';
                return;
            }

            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const div = document.createElement('div');
                div.className = `request-item status-${data.status}`;
                
                let dateStr = 'Just now';
                if (data.createdAt) {
                    dateStr = data.createdAt.toDate().toLocaleDateString();
                }

                div.innerHTML = `
                    <div class="req-header">
                        <div class="req-title">${escapeHTML(data.title)}</div>
                        <div class="req-status">${escapeHTML(data.status)}</div>
                    </div>
                    <div class="req-desc">${escapeHTML(data.description)}</div>
                    <div class="req-meta">
                        <span>${data.link ? '<a href="'+escapeHTML(data.link)+'" target="_blank" style="color:#00c8ff;">Reference Link</a>' : ''}</span>
                        <span>${dateStr}</span>
                    </div>
                `;
                listEl.appendChild(div);
            });
        }, (err) => {
            console.error("Error listening to requests:", err);
            // Firebase requires an index if sorting by multiple fields or combining equality/range, but here we query by `uid` and orderBy `createdAt`. We might need an index on (uid, createdAt). Let's catch this and fallback to simple query if it fails.
            if (err.message.includes("index")) {
                listEl.innerHTML = '<div style="color:#f59e0b; font-size:0.9rem;">Index building... requests will appear shortly.</div>';
            }
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

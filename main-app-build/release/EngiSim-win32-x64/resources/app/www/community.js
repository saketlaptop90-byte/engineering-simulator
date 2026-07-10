import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from './firebase.js';
import { initAuth, getCurrentUser, logActivity } from './auth.js';

// Initialize Authentication UI
initAuth();

const feedEl = document.getElementById('feed');
const postComposer = document.getElementById('post-composer');
const signInPrompt = document.getElementById('sign-in-prompt');
const postInput = document.getElementById('post-input');
const btnEmoji = document.getElementById('btn-emoji-community');
const emojiPopover = document.getElementById('emoji-popover-community');
const emojiPicker = emojiPopover.querySelector('emoji-picker');
const submitBtn = document.getElementById('submit-post-btn');
const charCount = document.getElementById('char-count');

btnEmoji.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPopover.style.display = emojiPopover.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('emoji-click', event => {
    postInput.value += event.detail.unicode;
    charCount.textContent = `${postInput.value.length}/1000`;
});

document.addEventListener('click', (e) => {
    if (!emojiPopover.contains(e.target) && e.target !== btnEmoji) {
        emojiPopover.style.display = 'none';
    }
});

if (postInput && charCount) {
    postInput.addEventListener('input', () => {
        charCount.textContent = `${postInput.value.length}/1000`;
    });
}

let currentUserObj = null;

// Listen for auth state changes to show/hide composer
document.addEventListener('engisim-auth-changed', (e) => {
    const user = e.detail.user;
    const blocks = e.detail.blocks;
    currentUserObj = user;
    
    if (user) {
        signInPrompt.style.display = 'none';
        if (blocks && (blocks.global || blocks.community)) {
            postComposer.style.display = 'none';
            signInPrompt.innerHTML = '<p style="color:#ef4444;">You are blocked from posting in the Community.</p>';
            signInPrompt.style.display = 'block';
        } else {
            postComposer.style.display = 'block';
        }
    } else {
        signInPrompt.innerHTML = '<p>Please Sign In to Post</p>';
        signInPrompt.style.display = 'block';
        postComposer.style.display = 'none';
    }
});

// Setup Firestore real-time listener for posts
const postsRef = collection(db, 'community_posts');
const q = query(postsRef, orderBy('createdAt', 'desc'));

const loadTimeout = setTimeout(() => { if (feedEl.innerHTML.includes('Loading posts')) feedEl.innerHTML = '<p style="color: #ef4444; text-align: center;">Connection timed out. Check your network or Firebase rules.</p>'; }, 8000);

let initialScrollDone = false;
const urlParams = new URLSearchParams(window.location.search);
const targetPost = urlParams.get('post');

onSnapshot(q, (snapshot) => {
    clearTimeout(loadTimeout);
    feedEl.innerHTML = '';
    if (snapshot.empty) {
        feedEl.innerHTML = '<p style="text-align: center; color: #666;">No posts yet. Be the first!</p>';
        return;
    }
    
    // Split into pinned and normal posts to sort pinned first
    const pinnedPosts = [];
    const normalPosts = [];
    snapshot.forEach(doc => {
        if (doc.data().isPinned) pinnedPosts.push(doc);
        else normalPosts.push(doc);
    });

    [...pinnedPosts, ...normalPosts].forEach(docSnap => {
        const data = docSnap.data();
        const postId = docSnap.id;
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.id = 'post-' + postId;
        if(data.isPinned) postCard.style.border = '1px solid #00c8ff';

        const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Just now';
        
        const currentUid = currentUserObj ? currentUserObj.uid : null;
        const currentEmail = currentUserObj ? currentUserObj.email : null;
        const isAdmin = currentEmail === 'saketlaptop90@gmail.com' || currentEmail === 'saketdalal76@gmail.com';
        const isAuthor = currentUid === data.authorId;
        
        const likesArray = data.likes || [];
        const likeCount = likesArray.length;
        const isLiked = currentUid && likesArray.includes(currentUid);
        
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${data.authorPic || 'https://via.placeholder.com/32'}" alt="Pic" style="width:32px; height:32px; border-radius:50%;">
                <span class="post-author">${escapeHTML(data.authorName)} ${data.isPinned ? '📌' : ''}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="post-content">
                ${escapeHTML(data.text).replace(/\n/g, '<br>')}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${postId}">
                    ${isLiked ? '❤️' : '🤍'} <span class="like-count">${likeCount}</span>
                </button>
                <button class="action-btn share-btn" data-id="${postId}">🔗 Share</button>
                <button class="action-btn report-btn" data-id="${postId}">🚨 Report</button>
                ${isAuthor || isAdmin ? `<button class="action-btn delete-btn" data-id="${postId}">🗑️ Delete</button>` : ''}
                ${isAdmin ? `<button class="action-btn pin-btn" data-id="${postId}" data-pinned="${data.isPinned || false}">${data.isPinned ? 'Unpin' : '📌 Pin'}</button>` : ''}
            </div>
        `;
        feedEl.appendChild(postCard);
    });

    if (!initialScrollDone && targetPost) {
        setTimeout(() => {
            const targetEl = document.getElementById('post-' + targetPost);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.style.boxShadow = '0 0 20px #00c8ff';
                targetEl.style.transition = 'box-shadow 0.5s ease';
                setTimeout(() => targetEl.style.boxShadow = 'none', 3000);
                initialScrollDone = true;
            }
        }, 300);
    }
}, (error) => {
    console.error("Error fetching posts:", error);
    feedEl.innerHTML = '<p style="color: #ef4444;">Error loading community posts. Check Firebase config.</p>';
});

// Handle submitting new post
submitBtn.onclick = async () => {
    const user = getCurrentUser();
    if (!user) return;
    
    const text = postInput.value.trim();
    if (!text) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    try {
        const postRef = await addDoc(postsRef, {
            text: text,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            authorPic: user.photoURL,
            createdAt: serverTimestamp(),
            likes: []
        });
        postInput.value = '';
        if (charCount) charCount.textContent = '0/1000';

        // Log activity
        await logActivity(user, 'community_post', { postId: postRef.id, textLength: text.length });
    } catch (e) {
        console.error("Error adding post", e);
        alert("Failed to post: " + e.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post';
    }
};

feedEl.addEventListener('click', async (e) => {
    const likeBtn = e.target.closest('.like-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const shareBtn = e.target.closest('.share-btn');
    const reportBtn = e.target.closest('.report-btn');
    const pinBtn = e.target.closest('.pin-btn');
    const user = getCurrentUser();

    if (shareBtn) {
        const postId = shareBtn.dataset.id;
        const url = new URL(window.location.href);
        url.searchParams.set('post', postId);
        navigator.clipboard.writeText(url.toString()).then(() => alert("Post link copied!"));
    }

    if (reportBtn) {
        if (!user) return alert('Sign in to report posts.');
        const postId = reportBtn.dataset.id;
        const reason = prompt("Please provide a reason for reporting this post:");
        if (reason) {
            try {
                await addDoc(collection(db, 'reports'), {
                    type: 'Community Post',
                    targetId: postId,
                    reporterEmail: user.email,
                    reporterUid: user.uid,
                    feedback: reason,
                    resolved: false,
                    createdAt: serverTimestamp()
                });
                alert("Report submitted successfully.");
            } catch(err) { alert("Failed to report: " + err.message); }
        }
    }

    if (pinBtn) {
        const postId = pinBtn.dataset.id;
        const isCurrentlyPinned = pinBtn.dataset.pinned === 'true';
        try {
            await updateDoc(doc(db, 'community_posts', postId), { isPinned: !isCurrentlyPinned });
        } catch(err) { console.error(err); alert("Failed to pin."); }
    }

    if (likeBtn) {
        if (!user) return alert('Please sign in to like posts.');
        const postId = likeBtn.dataset.id;
        const isLiked = likeBtn.classList.contains('liked');
        const postRef = doc(db, 'community_posts', postId);
        
        try {
            if (isLiked) {
                await updateDoc(postRef, { likes: arrayRemove(user.uid) });
                await logActivity(user, 'post_unliked', { postId: postId });
            } else {
                await updateDoc(postRef, { likes: arrayUnion(user.uid) });
                await logActivity(user, 'post_liked', { postId: postId });
            }
        } catch(err) { console.error(err); }
    }

    if (deleteBtn) {
        if (!user) return;
        const postId = deleteBtn.dataset.id;
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'community_posts', postId));
                await logActivity(user, 'post_deleted', { postId: postId });
            } catch(err) { alert('Failed to delete post: ' + err.message); }
        }
    }
});

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

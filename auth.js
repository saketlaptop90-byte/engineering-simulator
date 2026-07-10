import { auth, db, doc, getDoc, setDoc, updateDoc, googleProvider, microsoftProvider, signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, serverTimestamp } from './firebase.js';

let currentUser = null;
let currentUniqueId = null;
let userBlocks = { global: false, community: false, chat: false };
window.currentUserIsPremium = false;

// --- Activity Logger ---
export async function logActivity(user, action, details = {}) {
    try {
        await addDoc(collection(db, 'activity_log'), {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            action: action,
            details: details,
            timestamp: serverTimestamp(),
            page: window.location.pathname
        });
    } catch (e) {
        console.warn('Activity log failed (non-critical):', e.message);
    }
}

// --- Unique ID Generator ---
function generateUniqueId(email, uid) {
    const base = email ? email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '') : uid.substring(0, 8);
    const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return '@' + base + '_' + suffix;
}

export function initAuth() {
    const unauthDiv = document.getElementById('nav-unauth');
    const authDiv = document.getElementById('nav-auth');
    const btnGoogle = document.getElementById('nav-signin-google');
    const btnBing = document.getElementById('nav-signin-bing');
    const btnSignout = document.getElementById('nav-signout');
    const userName = document.getElementById('nav-user-name');
    const userPic = document.getElementById('nav-user-pic');
    const btnMainSignin = document.getElementById('nav-signin-main');
    const signinDropdown = document.getElementById('signin-dropdown');
    const navMessages = document.getElementById('nav-messages');
    const navEconomy = document.getElementById('nav-economy');
    const navRequests = document.getElementById('nav-requests');

    // Dropdown is toggled via inline HTML onclick attribute on btnMainSignin

    if (btnGoogle) {
        btnGoogle.onclick = async () => {
            try {
                if (signinDropdown) signinDropdown.style.display = 'none';
                await signInWithPopup(auth, googleProvider);
            } catch (err) {
                console.error("Google Sign in error", err);
                alert("Sign in failed: " + err.message);
            }
        };
    }

    if (btnBing) {
        btnBing.onclick = async () => {
            try {
                if (signinDropdown) signinDropdown.style.display = 'none';
                await signInWithPopup(auth, microsoftProvider);
            } catch (err) {
                console.error("Bing/Microsoft Sign in error", err);
                alert("Sign in failed: " + err.message);
            }
        };
    }

    if (btnSignout) {
        btnSignout.onclick = async () => {
            const user = currentUser;
            if (user) {
                await logActivity(user, 'sign_out');
            }
            await signOut(auth);
        };
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        window.currentUser = user;
        window.logActivity = logActivity;
        if (user) {
            if(unauthDiv) unauthDiv.style.display = 'none';
            if(authDiv) authDiv.style.display = 'flex';
            if(navMessages) navMessages.style.display = 'inline-block';
            if(navEconomy) navEconomy.style.display = 'inline-block';
            if(navRequests) navRequests.style.display = 'inline-block';

            // --- Generate or fetch Unique ID (bulletproof) ---
            let uniqueId = null;
            let userBlocks = { global: false, community: false, chat: false };
            let userLocation = "Unknown Location";

            // IP Geolocation fetch has its own try/catch below
                // Fetch IP Location silently
                try {
                    const geoRes = await fetch('https://ipapi.co/json/');
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.city && geoData.country_name) {
                            userLocation = `${geoData.city}, ${geoData.country_name}`;
                        }
                    }
                } catch(ge) {
                    console.warn("Geolocation fetch failed:", ge.message);
                }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    // Brand new user - create profile + ID
                    uniqueId = generateUniqueId(user.email, user.uid);
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        uniqueId: uniqueId,
                        location: userLocation,
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp()
                    });
                    await logActivity(user, 'sign_up', { uniqueId: uniqueId });
                } else {
                    const data = userSnap.data();
                    if (data.blocks) {
                        const now = Date.now();
                        userBlocks = {
                            global: (data.blocks.global && data.blocks.global > now) ? data.blocks.global : false,
                            chat: (data.blocks.chat && data.blocks.chat > now) ? data.blocks.chat : false,
                            community: (data.blocks.community && data.blocks.community > now) ? data.blocks.community : false
                        };
                    }
                    if (data.isPremium) {
                        window.currentUserIsPremium = true;
                    }

                    if (userBlocks.global) {
                        const d = new Date(userBlocks.global);
                        document.body.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#050b14; color:#ef4444; flex-direction:column; text-align:center;"><h1>Account Banned</h1><p>Your account has been globally banned until ' + d.toLocaleString() + '.</p></div>';
                        return;
                    }

                    if (data.uniqueId && data.uniqueId.length > 0) {
                        uniqueId = data.uniqueId;
                        // Just update last login and location if we already have an ID
                        await updateDoc(userRef, { 
                            lastLogin: serverTimestamp(),
                            location: userLocation 
                        });
                    } else {
                        // Old account without ID - generate one now
                        uniqueId = generateUniqueId(user.email, user.uid);
                        await updateDoc(userRef, {
                            uniqueId: uniqueId,
                            location: userLocation,
                            lastLogin: serverTimestamp()
                        });
                    }
                    
                    await logActivity(user, 'sign_in', { uniqueId: uniqueId });
                }
            } catch (e) {
                console.error("Firestore user profile error:", e);
                // FALLBACK: Generate a local ID so user always sees something
                uniqueId = generateUniqueId(user.email, user.uid);
                // Try one more time to save it
                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        uniqueId: uniqueId,
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp()
                    }, { merge: true });
                } catch (e2) {
                    console.error("Fallback save also failed:", e2);
                }
            }

            // Always set this AFTER try/catch so it's never null
            currentUniqueId = uniqueId;

            if(userName) {
                userName.innerHTML = `<div style="line-height:1.2;">${user.displayName || 'User'}<br><span style="font-size:0.75rem; color:#00c8ff; font-family:monospace;">${currentUniqueId}</span></div>`;
            }

            if(userPic) userPic.src = user.photoURL || 'https://via.placeholder.com/32';

            // Dispatch a custom event so other scripts know auth state changed
            document.dispatchEvent(new CustomEvent('engisim-auth-changed', { detail: { user, uniqueId: currentUniqueId, blocks: userBlocks, isPremium: window.currentUserIsPremium } }));
        } else {
            currentUniqueId = null;
            if(unauthDiv) unauthDiv.style.display = 'inline-block';
            if(authDiv) authDiv.style.display = 'none';
            if(navMessages) navMessages.style.display = 'none';
            if(navEconomy) navEconomy.style.display = 'none';
            if(navRequests) navRequests.style.display = 'none';
            document.dispatchEvent(new CustomEvent('engisim-auth-changed', { detail: { user: null, uniqueId: null, blocks: null } }));
        }
    });
}

export function getCurrentUser() {
    return currentUser;
}

export function getCurrentUniqueId() {
    return currentUniqueId;
}




export async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch(e) { console.error(e); }
}

export async function signInWithMicrosoft() {
    try {
        await signInWithPopup(auth, microsoftProvider);
    } catch(e) { console.error(e); }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch(e) { console.error(e); }
}


// ads.js
import { db, doc, onSnapshot, collection, query, where, updateDoc, getDoc } from './firebase.js?v=CACHE_BUST';
import { getCurrentUser } from './auth.js?v=CACHE_BUST';

class AdEngine {
    constructor() {
        this.activeAds = new Map();
        this.userCredits = 0;
        this.userUid = null;
        this.container = document.createElement('div');
        this.container.id = 'engisim-ads-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);

        // Listen for auth changes to get credits
        document.addEventListener('engisim-auth-changed', (e) => {
            const user = e.detail.user;
            if (user) {
                this.userUid = user.uid;
                this.listenToCredits();
            } else {
                this.userUid = null;
                this.userCredits = 0;
            }
        });
        
        const user = getCurrentUser();
        if (user) {
            this.userUid = user.uid;
            this.listenToCredits();
        }

        this.listenToAds();
    }

    listenToCredits() {
        if (!this.userUid) return;
        onSnapshot(doc(db, 'users', this.userUid), (snap) => {
            if (snap.exists()) {
                this.userCredits = snap.data().credits || 0;
                this.updateAllSkipButtons();
            }
        });
    }

    listenToAds() {
        const q = query(collection(db, 'ads'), where('isActive', '==', true));
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                const id = change.doc.id;
                data.id = id;

                if (change.type === 'added' || change.type === 'modified') {
                    if (this.shouldShowAd(data)) {
                        this.renderAd(data);
                    } else {
                        this.removeAd(id);
                    }
                }
                if (change.type === 'removed') {
                    this.removeAd(id);
                }
            });
        });
    }

    shouldShowAd(ad) {
        // Check expiration
        if (ad.expiresAt && new Date(ad.expiresAt).getTime() < Date.now()) {
            return false;
        }
        
        // Check page targeting
        const currentPath = window.location.pathname;
        let currentPage = 'index';
        if (currentPath.includes('simulator')) currentPage = 'simulator';
        if (currentPath.includes('community')) currentPage = 'community';
        if (currentPath.includes('messages')) currentPage = 'messages';

        if (ad.targetPage && ad.targetPage !== 'all' && ad.targetPage !== currentPage) {
            return false;
        }

        // Check if user already skipped or interacted with it in this session
        if (sessionStorage.getItem(`ad_skipped_${ad.id}`)) {
            return false;
        }

        return true;
    }

    renderAd(ad) {
        // If already showing, update it
        if (this.activeAds.has(ad.id)) {
            const el = this.activeAds.get(ad.id);
            this.removeAd(ad.id);
        }

        const adEl = document.createElement('div');
        adEl.className = `engisim-ad-box ${ad.position} ${ad.size}`;
        adEl.style.cssText = this.getStyleForAd(ad);

        let mediaHtml = '';
        if (ad.mediaType === 'video') {
            mediaHtml = `<video src="${ad.mediaUrl}" autoplay loop muted style="width:100%; height:100%; object-fit:cover; border-radius: 8px;"></video>`;
        } else {
            mediaHtml = `<img src="${ad.mediaUrl}" style="width:100%; height:100%; object-fit:cover; border-radius: 8px;">`;
        }

        adEl.innerHTML = `
            <div class="ad-media" style="cursor: pointer; width: 100%; height: 100%; position: relative;">
                ${mediaHtml}
                <div class="ad-overlay" style="position:absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 5px; text-align: center; font-size: 0.8rem; color: #fff;">
                    Ad • Click for ${ad.creditsReward || 0} Credits
                </div>
            </div>
            <button class="ad-skip-btn" style="position: absolute; top: -10px; right: -10px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold; pointer-events: auto;">X</button>
            <div class="ad-skip-label" style="position: absolute; top: -25px; right: 0; font-size: 0.75rem; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; display: none;">
                Skip (${ad.skipCost || 0}c)
            </div>
        `;

        // Handle Clicking the Ad
        const mediaContainer = adEl.querySelector('.ad-media');
        mediaContainer.addEventListener('click', () => {
            this.handleAdClick(ad);
        });

        // Handle Skipping
        const skipBtn = adEl.querySelector('.ad-skip-btn');
        const skipLabel = adEl.querySelector('.ad-skip-label');
        
        skipBtn.addEventListener('mouseenter', () => skipLabel.style.display = 'block');
        skipBtn.addEventListener('mouseleave', () => skipLabel.style.display = 'none');
        
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSkip(ad);
        });

        // Append and track
        this.container.appendChild(adEl);
        this.activeAds.set(ad.id, adEl);
        this.updateSkipButtonState(adEl, ad);

        // Handle duration if set
        if (ad.displayDuration && ad.displayDuration > 0) {
            setTimeout(() => {
                if (this.activeAds.has(ad.id)) {
                    this.removeAd(ad.id);
                }
            }, ad.displayDuration * 1000);
        }
    }

    getStyleForAd(ad) {
        let base = `position: absolute; pointer-events: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: #000; transition: all 0.3s ease;`;
        
        // Size
        if (ad.size === 'small') base += `width: 200px; height: 150px;`;
        else if (ad.size === 'large') base += `width: 600px; height: 400px;`;
        else base += `width: 320px; height: 250px;`; // Medium

        // Position
        if (ad.position === 'center') {
            base += `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
        } else if (ad.position === 'top-banner') {
            base += `top: 60px; left: 50%; transform: translateX(-50%); width: 80%; height: 100px;`;
        } else if (ad.position === 'bottom-left') {
            base += `bottom: 20px; left: 20px;`;
        } else {
            // Default bottom-right
            base += `bottom: 20px; right: 20px;`;
        }

        return base;
    }

    async handleAdClick(ad) {
        if (ad.redirectUrl) {
            window.open(ad.redirectUrl, '_blank');
        }
        
        // Award credits
        if (this.userUid && ad.creditsReward > 0) {
            try {
                const userRef = doc(db, 'users', this.userUid);
                const userSnap = await getDoc(userRef);
                const currentCredits = userSnap.data()?.credits || 0;
                await updateDoc(userRef, {
                    credits: currentCredits + parseInt(ad.creditsReward)
                });
            } catch(e) {
                console.error("Failed to award credits", e);
            }
        }
        
        this.removeAd(ad.id);
        sessionStorage.setItem(`ad_skipped_${ad.id}`, 'true');
    }

    async handleSkip(ad) {
        const cost = parseInt(ad.skipCost || 0);
        
        if (cost > 0) {
            if (!this.userUid) {
                alert("You must be signed in to use credits to skip ads.");
                return;
            }
            if (this.userCredits < cost) {
                alert(`You need ${cost} credits to skip this ad. You have ${this.userCredits}.`);
                return;
            }
            
            // Deduct credits
            try {
                const userRef = doc(db, 'users', this.userUid);
                await updateDoc(userRef, {
                    credits: this.userCredits - cost
                });
            } catch(e) {
                console.error("Failed to deduct credits", e);
                return;
            }
        }
        
        this.removeAd(ad.id);
        sessionStorage.setItem(`ad_skipped_${ad.id}`, 'true');
    }

    updateSkipButtonState(adEl, ad) {
        const skipBtn = adEl.querySelector('.ad-skip-btn');
        const cost = parseInt(ad.skipCost || 0);
        if (cost > 0 && this.userCredits < cost) {
            skipBtn.style.opacity = '0.5';
        } else {
            skipBtn.style.opacity = '1';
        }
    }

    updateAllSkipButtons() {
        this.activeAds.forEach((el, id) => {
            const adData = { skipCost: el.querySelector('.ad-skip-label').textContent.replace(/[^0-9]/g, '') };
            this.updateSkipButtonState(el, adData);
        });
    }

    removeAd(id) {
        if (this.activeAds.has(id)) {
            const el = this.activeAds.get(id);
            if (el.parentNode) el.parentNode.removeChild(el);
            this.activeAds.delete(id);
        }
    }
}

// Initialize
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.engisimAdEngine = new AdEngine();
    });
}

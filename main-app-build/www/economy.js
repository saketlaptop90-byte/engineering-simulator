import { auth, db, doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from './firebase.js';

const uiLoader = document.getElementById('loader');
const uiContainer = document.getElementById('plans-container');
const uiCouponSec = document.getElementById('coupon-section');
const btnApply = document.getElementById('btn-apply-coupon');
const inputCoupon = document.getElementById('coupon-input');
const msgCoupon = document.getElementById('coupon-msg');

let currentUser = null;

auth.onAuthStateChanged((user) => {
    currentUser = user;
    if(user) {
        uiCouponSec.style.display = 'block';
    }
});

// Real-time sync of subscription plans from Admin Portal
onSnapshot(doc(db, 'platform_config', 'subscription_plans'), (snapshot) => {
    uiLoader.style.display = 'none';
    uiContainer.style.display = 'flex';
    
    if (snapshot.exists()) {
        const plans = snapshot.data().list || [];
        renderPlans(plans);
    } else {
        uiContainer.innerHTML = '<p>No subscription plans found. Admin must configure them.</p>';
    }
});

function renderPlans(plans) {
    let html = '';
    plans.forEach(plan => {
        const isPro = plan.price > 0;
        
        html += `
        <div class="plan-card ${isPro ? 'pro' : ''}">
            ${isPro ? '<div class="pro-badge">MOST POPULAR</div>' : ''}
            <div class="plan-name">${plan.name}</div>
            <div class="plan-price">$${plan.price}<span>/mo</span></div>
            <ul class="features-list">
                <li>${plan.aiLimit} AI Special Pro Requests / day</li>
                <li>${plan.chatChars} Character limit per chat</li>
                ${plan.priority ? '<li>Priority AI Queueing</li>' : ''}
                ${!plan.hasAds ? '<li>Ad-Free Experience</li>' : '<li>Standard Ads</li>'}
            </ul>
            <button class="btn-buy ${isPro ? 'premium' : 'free'}" onclick="handleBuy('${plan.id}')">
                ${isPro ? 'Upgrade Now' : 'Current Plan'}
            </button>
        </div>`;
    });
    uiContainer.innerHTML = html;
}

window.handleBuy = (planId) => {
    if (!currentUser) {
        alert("Please sign in first to upgrade!");
        return;
    }
    if (planId === 'free') return;
    
    // The user requested a "Coming Soon" for payment gateways
    alert("Payment Gateway Integration is coming soon! For now, use a Coupon Code to unlock premium features.");
};

// Coupon Logic
btnApply.onclick = async () => {
    if (!currentUser) return;
    const code = inputCoupon.value.trim().toUpperCase();
    if (!code) return;
    
    msgCoupon.style.color = 'white';
    msgCoupon.innerText = 'Verifying...';
    
    try {
        const coupRef = doc(db, 'platform_config', 'coupons');
        const snap = await getDoc(coupRef);
        
        if (snap.exists()) {
            const list = snap.data().list || [];
            const coupon = list.find(c => c.code === code);
            
            if (coupon) {
                if (coupon.uses >= coupon.maxUses) {
                    msgCoupon.style.color = '#ef4444';
                    msgCoupon.innerText = 'This coupon has reached its maximum usage limit.';
                    return;
                }
                
                // Upgrade User Document
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    plan: 'pro',
                    isPremium: true,
                    aiLimit: 10,
                    chatChars: 2000,
                    upgradedAt: serverTimestamp()
                });
                
                // Increment coupon usage
                coupon.uses++;
                await updateDoc(coupRef, { list: list });
                
                msgCoupon.style.color = '#10b981';
                msgCoupon.innerText = 'Success! You are now a Premium user.';
                
                // Dispatch event so AI engine updates
                window.currentUserIsPremium = true;
                document.dispatchEvent(new CustomEvent('engisim-auth-changed', { 
                    detail: { user: currentUser, isPremium: true } 
                }));
                
            } else {
                msgCoupon.style.color = '#ef4444';
                msgCoupon.innerText = 'Invalid coupon code.';
            }
        }
    } catch (err) {
        console.error(err);
        msgCoupon.innerText = 'An error occurred checking the coupon.';
    }
};

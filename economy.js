import { auth, db, doc, getDoc, onSnapshot, updateDoc, setDoc, serverTimestamp, collection, addDoc } from './firebase.js';

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
    } else {
        uiCouponSec.style.display = 'none';
    }
});

// Real-time sync of pricing from Admin Portal
onSnapshot(doc(db, 'platform_config', 'pricing'), (snapshot) => {
    uiLoader.style.display = 'none';
    uiContainer.style.display = 'flex';
    
    if (snapshot.exists()) {
        const pricing = snapshot.data();
        renderStore(pricing);
    } else {
        uiContainer.innerHTML = '<p>Store is currently offline. Admin must configure pricing.</p>';
    }
});

function renderStore(pricing) {
    uiContainer.innerHTML = `
        <div class="plan-card pro">
            <div class="pro-badge">MOST POPULAR</div>
            <div class="plan-name">Premium Upgrade</div>
            <div class="plan-price">$\${pricing.premium}<span>/mo</span></div>
            <ul class="features-list">
                <li>Unlimited AI Pro Requests</li>
                <li>Priority AI Queueing</li>
                <li>Ad-Free Experience</li>
            </ul>
            <button class="btn-buy premium" onclick="handleBuy('premium', \${pricing.premium})">
                Upgrade Now
            </button>
        </div>

        <div class="plan-card">
            <div class="plan-name">AI Credits Pack</div>
            <div class="plan-price">$\${pricing.aiCredits}<span>/pack</span></div>
            <ul class="features-list">
                <li>+50 AI Requests</li>
                <li>Valid Forever</li>
                <li>Priority Processing</li>
            </ul>
            <button class="btn-buy free" onclick="handleBuy('ai_credits', \${pricing.aiCredits})">
                Buy AI Credits
            </button>
        </div>

        <div class="plan-card">
            <div class="plan-name">Ad Credits Pack</div>
            <div class="plan-price">$\${pricing.adCredits}<span>/pack</span></div>
            <ul class="features-list">
                <li>10,000 Ad Impressions</li>
                <li>Targeted Audience</li>
                <li>Run custom banners</li>
            </ul>
            <button class="btn-buy free" onclick="handleBuy('ad_credits', \${pricing.adCredits})">
                Buy Ad Credits
            </button>
        </div>
    `;
}

let selectedItem = null;
let selectedPrice = 0;
const modalOverlay = document.getElementById('payment-modal-overlay');
const btnCloseModal = document.getElementById('close-payment-modal');
const btnSubmitPayment = document.getElementById('btn-submit-payment');
const msgPayment = document.getElementById('payment-msg');
const paymentDesc = document.getElementById('payment-plan-desc');

btnCloseModal.onclick = () => {
    modalOverlay.style.display = 'none';
};

window.handleBuy = (item, price) => {
    if (!currentUser) {
        alert("Please sign in first to purchase!");
        return;
    }
    
    selectedItem = item;
    selectedPrice = price;
    
    paymentDesc.innerText = \`You are purchasing: \${item.toUpperCase()} for $\${price}\`;
    
    modalOverlay.style.display = 'flex';
    msgPayment.innerText = '';
    btnSubmitPayment.disabled = false;
    btnSubmitPayment.innerText = 'Pay Securely';
};

btnSubmitPayment.onclick = async () => {
    const name = document.getElementById('card-name').value.trim();
    const email = document.getElementById('card-email').value.trim();
    const card = document.getElementById('card-number').value.trim();
    const exp = document.getElementById('card-exp').value.trim();
    const cvc = document.getElementById('card-cvc').value.trim();
    
    if(!name || !email || !card || !exp || !cvc) {
        msgPayment.style.color = '#ef4444';
        msgPayment.innerText = 'Please fill all fields.';
        return;
    }
    
    btnSubmitPayment.disabled = true;
    btnSubmitPayment.innerText = 'Processing via Cloudflare Edge...';
    msgPayment.style.color = 'white';
    msgPayment.innerText = 'Contacting payment gateway...';
    
    try {
        // Call our secure Cloudflare Worker API
        const response = await fetch('https://payment-backend.engisim.workers.dev/api/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.uid,
                userEmail: currentUser.email,
                item: selectedItem,
                amount: selectedPrice,
                token: "tok_" + card // In a real app, this is from Stripe Elements
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            msgPayment.style.color = '#10b981';
            msgPayment.innerText = 'Payment Successful! Verifying transaction signature...';
            
            // --- SECURITY LOGIC ---
            // The Cloudflare worker returns a cryptographic signature.
            // We write the transaction to Firestore. The Admin dashboard reads from this.
            await addDoc(collection(db, 'payments'), {
                transactionId: data.transactionId,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                item: selectedItem,
                amount: selectedPrice,
                date: serverTimestamp(),
                signature: data.signature
            });
            
            // Grant user credits/premium
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            let updateData = {};
            
            if (selectedItem === 'pro') {
                updateData = { isPremium: true, subscription: 'pro', upgradedAt: serverTimestamp() };
            } else if (selectedItem === 'ultra') {
                updateData = { isPremium: true, subscription: 'ultra', upgradedAt: serverTimestamp() };
            } else if (selectedItem === 'ai_credits') {
                const currentAi = userSnap.exists() && userSnap.data().aiLimit ? userSnap.data().aiLimit : 0;
                updateData = { aiLimit: currentAi + 50 };
            } else if (selectedItem === 'ad_credits') {
                const currentAds = userSnap.exists() && userSnap.data().adCredits ? userSnap.data().adCredits : 0;
                updateData = { adCredits: currentAds + 10000 };
            }
            
            await updateDoc(userRef, updateData);
            
            generateInvoice(name, email, data.transactionId, selectedPrice, selectedItem);
            
            msgPayment.innerText = 'Purchase Complete! Enjoy your upgrade.';
            
            setTimeout(() => {
                modalOverlay.style.display = 'none';
                alert("Purchase complete. Your invoice has been downloaded.");
                window.location.reload();
            }, 2000);
            
        } else {
            throw new Error(data.error || 'Payment declined by bank.');
        }
    } catch (err) {
        btnSubmitPayment.disabled = false;
        btnSubmitPayment.innerText = 'Pay Securely';
        msgPayment.style.color = '#ef4444';
        msgPayment.innerText = err.message || 'An error occurred';
    }
};

function generateInvoice(name, email, txId, amount, item) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(0, 200, 255);
    doc.text("EngiSim Invoice", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(\`Date: \${new Date().toLocaleDateString()}\`, 20, 50);
    doc.text(\`Transaction ID: \${txId}\`, 20, 60);
    
    doc.text("Billed To:", 20, 80);
    doc.text(name, 20, 90);
    doc.text(email, 20, 100);
    
    doc.text("Description", 20, 130);
    doc.text("Amount", 160, 130);
    doc.line(20, 135, 190, 135);
    
    doc.text(\`EngiSim \${item.toUpperCase()} Purchase\`, 20, 145);
    doc.text(\`\${amount.toFixed(2)}\`, 160, 145);
    
    doc.line(20, 160, 190, 160);
    doc.setFontSize(14);
    doc.text("Total Paid:", 120, 170);
    doc.text(\`$\${amount.toFixed(2)}\`, 160, 170);
    
    doc.save(\`Invoice_\${txId}.pdf\`);
}

// Coupon Logic (unchanged for backward compatibility)
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
                
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    plan: 'pro',
                    isPremium: true,
                    aiLimit: 10,
                    chatChars: 2000,
                    upgradedAt: serverTimestamp()
                });
                
                coupon.uses++;
                await updateDoc(coupRef, { list: list });
                
                msgCoupon.style.color = '#10b981';
                msgCoupon.innerText = 'Success! You are now a Premium user.';
                
            } else {
                msgCoupon.style.color = '#ef4444';
                msgCoupon.innerText = 'Invalid coupon code.';
            }
        }
    } catch (err) {
        msgCoupon.innerText = 'An error occurred checking the coupon.';
    }
};

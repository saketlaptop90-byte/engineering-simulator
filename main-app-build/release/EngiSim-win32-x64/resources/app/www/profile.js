import { auth, db, collection, getDocs, query, where, orderBy } from './firebase.js';

const uiMain = document.getElementById('main-content');
const uiUnauth = document.getElementById('unauth-msg');
const uiHistoryList = document.getElementById('history-list');

auth.onAuthStateChanged(async (user) => {
    if (user) {
        uiUnauth.style.display = 'none';
        uiMain.style.display = 'block';
        
        document.getElementById('p-name').innerText = user.displayName || "Engineer";
        document.getElementById('p-email').innerText = user.email;
        if(user.photoURL) document.getElementById('p-pic').src = user.photoURL;
        
        await fetchHistory(user.uid);
    } else {
        uiUnauth.style.display = 'block';
        uiMain.style.display = 'none';
    }
});

async function fetchHistory(uid) {
    try {
        const q = query(
            collection(db, 'quiz_history'), 
            where('userId', '==', uid)
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            uiHistoryList.innerHTML = '<p style="color:var(--text-muted)">No quizzes taken yet. Start exploring!</p>';
            return;
        }
        
        let totalScore = 0;
        let perfectScores = 0;
        let html = '';
        
        // Firebase orderby requires composite index, so we sort client side
        const records = [];
        snapshot.forEach(doc => records.push(doc.data()));
        records.sort((a,b) => b.timestamp - a.timestamp);
        
        records.forEach(data => {
            totalScore += data.percentage;
            if(data.percentage === 100) perfectScores++;
            
            let color = data.percentage >= 80 ? '#10b981' : (data.percentage >= 50 ? '#f59e0b' : '#ef4444');
            let date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : 'Just now';
            let catName = data.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            html += `
            <div class="history-item">
              <div class="history-info">
                <h4>${catName}</h4>
                <p>Taken on: ${date} • ${data.score}/${data.total} Marks</p>
              </div>
              <div class="history-score" style="color: ${color}">${data.percentage}%</div>
            </div>`;
        });
        
        uiHistoryList.innerHTML = html;
        document.getElementById('s-total').innerText = records.length;
        document.getElementById('s-avg').innerText = Math.round(totalScore / records.length) + "%";
        document.getElementById('s-perfect').innerText = perfectScores;
        
        if (perfectScores >= 2 || (totalScore / records.length) >= 90) {
            document.getElementById('premium-banner').style.display = 'block';
            window.currentUserIsPremium = true;
        }
        
    } catch (err) {
        console.error("Error fetching history:", err);
        uiHistoryList.innerHTML = '<p style="color:#ef4444">Error loading history.</p>';
    }
}

import { auth, db } from './firebase.js';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, updateDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const loginOverlay = document.getElementById('admin-login-overlay');
const adminLayout = document.getElementById('admin-layout');
const btnLogin = document.getElementById('btn-admin-login');
const btnSignout = document.getElementById('nav-signout');
const navAdminName = document.getElementById('nav-admin-name');
const navAuth = document.getElementById('nav-auth');
const loginError = document.getElementById('login-error');

let currentAdminUid = null;

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.target).classList.add('active');
  });
});

// Auth Flow
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Check if admin (SuperAdmin emails or employee doc)
    const isSuperAdmin = (user.email === 'saketlaptop90@gmail.com' || user.email === 'saketdalal76@gmail.com');
    const employeeRef = doc(db, 'employees', user.email || 'unknown');
    const employeeSnap = await getDoc(employeeRef);
    
    if (isSuperAdmin || employeeSnap.exists()) {
      // Is admin
      currentAdminUid = user.uid;
      loginOverlay.style.display = 'none';
      adminLayout.style.display = 'flex';
      navAuth.style.display = 'flex';
      navAdminName.textContent = isSuperAdmin ? 'Super Admin' : (user.displayName || 'Employee');
      
      initDashboard();
    } else {
      // Not admin.
      loginError.textContent = "Access Denied: You do not have administrator or employee privileges.";
      signOut(auth);
    }
  } else {
    currentAdminUid = null;
    loginOverlay.style.display = 'flex';
    adminLayout.style.display = 'none';
    navAuth.style.display = 'none';
  }
});

btnLogin.addEventListener('click', async () => {
  loginError.textContent = "";
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login Error:", err);
    loginError.textContent = "Failed to sign in: " + err.message;
  }
});

btnSignout.addEventListener('click', () => {
  signOut(auth);
});

// Dashboard Data Fetching
function initDashboard() {
  // Listen to Users
  onSnapshot(collection(db, 'users'), (snapshot) => {
    let premiumCount = 0;
    const tbody = document.getElementById('table-users-body');
    tbody.innerHTML = '';
    
    document.getElementById('stat-users').textContent = snapshot.size;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.isPremium) premiumCount++;
      
      const tr = document.createElement('tr');
      
      let adFreeStr = 'None';
      if (data.adFreeUntil && data.adFreeUntil.toMillis() > Date.now()) {
        adFreeStr = data.adFreeUntil.toDate().toLocaleString();
      }
      
      const createdStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Unknown';
      
      tr.innerHTML = `
        <td style="font-family:monospace; color:#00c8ff;">${data.uniqueId || 'Unnamed'}</td>
        <td><span class="badge ${data.isPremium ? 'premium' : 'standard'}">${data.isPremium ? 'Premium ⭐' : 'Standard'}</span></td>
        <td style="font-size:0.85rem;">${adFreeStr}</td>
        <td style="font-size:0.85rem; color:rgba(255,255,255,0.5);">${createdStr}</td>
      `;
      tbody.appendChild(tr);
    });
    
    document.getElementById('stat-premium').textContent = premiumCount;
  });

  // Listen to Requests
  const qReq = query(collection(db, 'model_requests'), orderBy('createdAt', 'desc'));
  onSnapshot(qReq, (snapshot) => {
    const tbody = document.getElementById('table-requests-body');
    tbody.innerHTML = '';
    
    let pendingCount = 0;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      
      if (data.status === 'pending') pendingCount++;
      
      const tr = document.createElement('tr');
      const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Unknown';
      
      tr.innerHTML = `
        <td style="font-size:0.85rem; color:rgba(255,255,255,0.5);">${dateStr}</td>
        <td style="font-family:monospace; font-size:0.8rem;">${data.uid.substring(0,8)}...</td>
        <td style="font-weight:500;">${escapeHTML(data.title)}</td>
        <td><span class="badge ${data.status}">${data.status}</span></td>
        <td>
          ${data.status === 'pending' ? `
            <button class="action-btn accept" data-id="${id}">Accept</button>
            <button class="action-btn reject" data-id="${id}">Reject</button>
          ` : '<span style="color:rgba(255,255,255,0.3); font-size:0.8rem;">Resolved</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    document.getElementById('stat-requests').textContent = pendingCount;
    
    // Attach event listeners for accept/reject
    document.querySelectorAll('.action-btn.accept').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const reqId = e.target.dataset.id;
        await updateDoc(doc(db, 'model_requests', reqId), { status: 'accepted' });
      });
    });
    document.querySelectorAll('.action-btn.reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const reqId = e.target.dataset.id;
        await updateDoc(doc(db, 'model_requests', reqId), { status: 'rejected' });
      });
    });
  });

  // Export Data Logic
  const btnExport = document.getElementById('btn-export-data');
  if (btnExport) {
    btnExport.addEventListener('click', async () => {
      btnExport.textContent = 'Exporting...';
      try {
        const collections = ['users', 'model_requests', 'employees', 'community_posts'];
        const backupData = {};
        
        for (const colName of collections) {
          const snap = await getDocs(collection(db, colName));
          backupData[colName] = {};
          snap.forEach(d => {
            backupData[colName][d.id] = d.data();
          });
        }
        
        const jsonString = JSON.stringify(backupData, (key, value) => {
           if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
               return { _firestore_ts: true, ...value };
           }
           return value;
        }, 2);
        
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `engisim_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        btnExport.textContent = 'Download Full Backup';
      } catch (err) {
        console.error("Backup failed", err);
        btnExport.textContent = 'Failed!';
        setTimeout(() => btnExport.textContent = 'Download Full Backup', 3000);
      }
    });
  }

  // Restore Data Logic
  const btnRestore = document.getElementById('btn-trigger-restore');
  const fileRestore = document.getElementById('file-restore-data');
  const restoreStatus = document.getElementById('restore-status');
  
  if (btnRestore && fileRestore) {
    btnRestore.addEventListener('click', () => {
      fileRestore.click();
    });
    
    fileRestore.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      restoreStatus.textContent = 'Reading file...';
      restoreStatus.style.color = '#fbbf24';
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          restoreStatus.textContent = 'Restoring data... Please wait.';
          
          for (const [colName, docs] of Object.entries(data)) {
            for (const [docId, docData] of Object.entries(docs)) {
               // Deserialize timestamps if needed
               for (const key in docData) {
                   if (docData[key] && docData[key]._firestore_ts) {
                       // Note: For a true restore we'd convert back to Firestore Timestamp,
                       // but for this simple version we keep it as an object or just delete the tag.
                       delete docData[key]._firestore_ts;
                   }
               }
               await setDoc(doc(db, colName, docId), docData);
            }
          }
          
          restoreStatus.textContent = 'Restore Complete!';
          restoreStatus.style.color = '#10b981';
        } catch (err) {
          console.error("Restore failed", err);
          restoreStatus.textContent = 'Error restoring data: ' + err.message;
          restoreStatus.style.color = '#ef4444';
        }
      };
      reader.readAsText(file);
    });
  }
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

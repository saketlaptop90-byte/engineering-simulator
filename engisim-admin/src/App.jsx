import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, getDoc, setDoc, updateDoc, collection, onSnapshot, getDocs, addDoc, deleteDoc } from './firebase';
import { ShieldAlert, Users, CreditCard, Settings, LogOut, Ticket, Plus, Trash2, Activity, ShoppingBag, MessageSquare, Megaphone, Eye, Menu, X, DollarSign } from 'lucide-react';
import './App.css';

import SkeletonLoader from './components/SkeletonLoader';

import UsersTab from './components/UsersTab';
import AnalyticsTab from './components/AnalyticsTab';
import RequestsTab from './components/RequestsTab';
import ChatsTab from './components/ChatsTab';
import AllUserChatsTab from './components/AllUserChatsTab';
import OverviewTab from './components/OverviewTab';
import AdsManagerTab from './components/AdsManagerTab';
import RealtimeModelsTab from './components/RealtimeModelsTab';
import RevenueTab from './components/RevenueTab';

const SUPERADMINS = ['saketlaptop90@gmail.com', 'saketdalal76@gmail.com'];

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPermissions, setUserPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [plans, setPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    // Check if we just came back from a redirect login
    getRedirectResult(auth).catch(err => {
      console.error("Redirect error:", err);
      setLoginError("Redirect login failed: " + err.message);
    });

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const email = (u.email || "").toLowerCase();
        if (SUPERADMINS.includes(email)) {
          setIsAdmin(true);
          setUserPermissions({ analytics: true, blocking: true, subscriptions: true, employees: true, realtime: true });
          try {
             await seedInitialData();
             loadData();
          } catch(e) { console.error(e); }
          setLoading(false);
        } else {
          try {
            const empRef = doc(db, 'employees', email);
            const empSnap = await getDoc(empRef);
            if (empSnap.exists()) {
              setIsAdmin(true);
              setUserPermissions(empSnap.data().permissions || {});
              loadData();
            } else {
              setIsAdmin(false);
            }
          } catch(e) {
            console.warn("Admin check failed:", e);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const seedInitialData = async () => {
    const planRef = doc(db, 'platform_config', 'subscription_plans');
    const pSnap = await getDoc(planRef);
    if (!pSnap.exists()) {
      await setDoc(planRef, {
        list: [
          { id: 'free', name: 'Free Tier', price: 0, aiLimit: 5, chatChars: 500, hasAds: true, priority: false },
          { id: 'pro', name: 'Special Pro', price: 10, aiLimit: 10, chatChars: 2000, hasAds: false, priority: true }
        ]
      });
    }
    const coupRef = doc(db, 'platform_config', 'coupons');
    if (!(await getDoc(coupRef)).exists()) {
      await setDoc(coupRef, { list: [{ code: 'LAUNCH50', discount: 50, uses: 0, maxUses: 100 }] });
    }
  };

  const loadData = () => {
    onSnapshot(doc(db, 'platform_config', 'subscription_plans'), (doc) => {
      if (doc.exists()) setPlans(doc.data().list || []);
    });
    onSnapshot(doc(db, 'platform_config', 'coupons'), (doc) => {
      if (doc.exists()) setCoupons(doc.data().list || []);
    });
  };

  const handleLogin = async () => {
    try {
      setLoginError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Popup failed, trying redirect:", err);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        setLoginError("Login failed completely: " + redirectErr.message);
      }
    }
  };

  const savePlans = async (newPlans) => {
    await updateDoc(doc(db, 'platform_config', 'subscription_plans'), { list: newPlans });
  };
  
  const saveCoupons = async (newCoupons) => {
    await updateDoc(doc(db, 'platform_config', 'coupons'), { list: newCoupons });
  };

  if (loading) return <SkeletonLoader />;

  if (!user) {
    return (
      <div className="login-container">
        <h1><ShieldAlert size={40}/> EngiSim Admin</h1>
        <p>Restricted Portal. Authorized personnel only.</p>
        {loginError && <p style={{color: '#ef4444', marginBottom: '1rem'}}>{loginError}</p>}
        <button className="btn-primary" onClick={handleLogin}>Sign in with Google</button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="login-container">
        <h1>Access Denied</h1>
        <p>Your email ({user.email}) does not have admin privileges.</p>
        <button className="btn-secondary" onClick={() => signOut(auth)}>Sign Out</button>
      </div>
    );
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <div className={`sidebar-overlay${sidebarOpen ? ' sidebar-open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
          <div className="brand">EngiSim Admin</div>
          <nav>
            <a className={activeTab === 'overview' ? 'active' : ''} onClick={() => handleTabClick('overview')}><Activity/> Overview</a>
            
            {(userPermissions?.analytics || userPermissions?.realtime) && (
              <>
                {userPermissions?.analytics && <a className={activeTab === 'analytics' ? 'active' : ''} onClick={() => handleTabClick('analytics')}><Activity/> Analytics</a>}
                {userPermissions?.analytics && <a className={activeTab === 'revenue' ? 'active' : ''} onClick={() => handleTabClick('revenue')}><DollarSign/> Revenue & Payments</a>}
                {(userPermissions?.realtime || userPermissions?.analytics) && <a className={activeTab === 'realtime' ? 'active' : ''} onClick={() => handleTabClick('realtime')}><Eye/> Real-time Views</a>}
              </>
            )}

            {userPermissions?.blocking && (
              <>
                <a className={activeTab === 'users' ? 'active' : ''} onClick={() => handleTabClick('users')}><Users/> Users & Blocking</a>
                <a className={activeTab === 'chats' ? 'active' : ''} onClick={() => handleTabClick('chats')}><MessageSquare/> Community Moderation</a>
                <a className={activeTab === 'all_chats' ? 'active' : ''} onClick={() => handleTabClick('all_chats')}><MessageSquare/> All User Chats</a>
                <a className={activeTab === 'requests' ? 'active' : ''} onClick={() => handleTabClick('requests')}><ShoppingBag/> Model Requests</a>
              </>
            )}
            
            {userPermissions?.subscriptions && (
              <>
                <a className={activeTab === 'ads' ? 'active' : ''} onClick={() => handleTabClick('ads')}><Megaphone/> Ads & Credits</a>
                <a className={activeTab === 'plans' ? 'active' : ''} onClick={() => handleTabClick('plans')}><CreditCard/> Plans & Limits</a>
                <a className={activeTab === 'coupons' ? 'active' : ''} onClick={() => handleTabClick('coupons')}><Ticket/> Coupons</a>
              </>
            )}

            {userPermissions?.employees && (
              <a className={activeTab === 'employees' ? 'active' : ''} onClick={() => handleTabClick('employees')}><ShieldAlert/> Employees</a>
            )}
          </nav>
          <div className="user-profile">
            <p>{user.email}</p>
            <button onClick={() => signOut(auth)}><LogOut size={14}/> Logout</button>
          </div>
        </aside>

        <main className="content">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'analytics' && userPermissions?.analytics && <AnalyticsTab />}
          {activeTab === 'revenue' && userPermissions?.analytics && <RevenueTab />}
          {activeTab === 'realtime' && (userPermissions?.realtime || userPermissions?.analytics) && <RealtimeModelsTab />}
          {activeTab === 'users' && userPermissions?.blocking && <UsersTab />}
          {activeTab === 'chats' && userPermissions?.blocking && <ChatsTab />}
          {activeTab === 'all_chats' && userPermissions?.blocking && <AllUserChatsTab />}
          {activeTab === 'requests' && userPermissions?.blocking && <RequestsTab />}
          {activeTab === 'ads' && userPermissions?.subscriptions && <AdsManagerTab />}
          {activeTab === 'plans' && userPermissions?.subscriptions && <PlansManager plans={plans} savePlans={savePlans} />}
          {activeTab === 'coupons' && userPermissions?.subscriptions && <CouponsManager coupons={coupons} saveCoupons={saveCoupons} />}
          {activeTab === 'employees' && userPermissions?.employees && <EmployeesManager />}
        </main>
    </div>
  );
}

function PlansManager({ plans, savePlans }) {
  const handleUpdate = (index, field, value) => {
    const newPlans = [...plans];
    newPlans[index][field] = value;
    savePlans(newPlans);
  };

  const addPlan = () => {
    const newPlans = [...plans, { id: 'new_plan', name: 'New Plan', price: 0, aiLimit: 5, chatChars: 500, hasAds: true, priority: false }];
    savePlans(newPlans);
  };

  const delPlan = (index) => {
    const newPlans = plans.filter((_, i) => i !== index);
    savePlans(newPlans);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Subscription Plans & AI Limits</h2>
        <button className="btn-success" onClick={addPlan}><Plus size={16}/> Add Plan</button>
      </div>
      <p>Changes are pushed to all live users instantly.</p>
      
      <div className="card-grid">
        {plans.map((p, i) => (
          <div key={i} className="plan-card">
            <input type="text" value={p.name} onChange={e => handleUpdate(i, 'name', e.target.value)} className="input-title"/>
            <div className="field-row">
              <label>ID</label>
              <input type="text" value={p.id} onChange={e => handleUpdate(i, 'id', e.target.value)} />
            </div>
            <div className="field-row">
              <label>Price ($/mo)</label>
              <input type="number" value={p.price} onChange={e => handleUpdate(i, 'price', parseInt(e.target.value))} />
            </div>
            <div className="field-row">
              <label>AI Requests / Day</label>
              <input type="number" value={p.aiLimit} onChange={e => handleUpdate(i, 'aiLimit', parseInt(e.target.value))} />
            </div>
            <div className="field-row">
              <label>Chat Char Limit</label>
              <input type="number" value={p.chatChars} onChange={e => handleUpdate(i, 'chatChars', parseInt(e.target.value))} />
            </div>
            <div className="field-row">
              <label>Priority AI Queue</label>
              <input type="checkbox" checked={p.priority} onChange={e => handleUpdate(i, 'priority', e.target.checked)} />
            </div>
            <button className="btn-danger" style={{marginTop: '10px', width: '100%'}} onClick={() => delPlan(i)}><Trash2 size={14}/> Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouponsManager({ coupons, saveCoupons }) {
  const [newCode, setNewCode] = useState('');
  
  const addCoupon = () => {
    if(!newCode) return;
    const newCoupons = [...coupons, { code: newCode.toUpperCase(), discount: 100, uses: 0, maxUses: 10 }];
    saveCoupons(newCoupons);
    setNewCode('');
  };

  const handleUpdate = (index, field, value) => {
    const newC = [...coupons];
    newC[index][field] = value;
    saveCoupons(newC);
  };

  const del = (idx) => {
    const newC = coupons.filter((_, i) => i !== idx);
    saveCoupons(newC);
  };

  return (
    <div className="panel">
      <h2>Coupon Codes</h2>
      <div className="add-bar">
        <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Enter code (e.g. SUMMERPRO)"/>
        <button className="btn-primary" onClick={addCoupon}>Create</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Code</th><th>Discount %</th><th>Uses</th><th>Max Uses</th><th>Action</th></tr>
        </thead>
        <tbody>
          {coupons.map((c, i) => (
            <tr key={i}>
              <td><strong>{c.code}</strong></td>
              <td><input type="number" value={c.discount} onChange={e=>handleUpdate(i,'discount',parseInt(e.target.value))} style={{width:'60px'}}/></td>
              <td>{c.uses}</td>
              <td><input type="number" value={c.maxUses} onChange={e=>handleUpdate(i,'maxUses',parseInt(e.target.value))} style={{width:'60px'}}/></td>
              <td><button className="btn-danger" onClick={() => del(i)}><Trash2 size={14}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmployeesManager() {
  const [emps, setEmps] = useState([]);
  const [newEmp, setNewEmp] = useState('');

  useEffect(() => {
    return onSnapshot(collection(db, 'employees'), (snap) => {
      setEmps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);
  
  const add = async () => {
    if(!newEmp) return;
    const lowerEmail = newEmp.toLowerCase();
    await setDoc(doc(db, 'employees', lowerEmail), { email: lowerEmail, permissions: {} });
    setNewEmp('');
  };

  const del = async (id) => {
    await deleteDoc(doc(db, 'employees', id));
  };

  const togglePerm = async (id, currentPerms, permName) => {
    const updated = { ...currentPerms, [permName]: !currentPerms[permName] };
    await updateDoc(doc(db, 'employees', id), { permissions: updated });
  };

  return (
    <div className="panel">
      <h2>Employee Access Management (RBAC)</h2>
      <p>Configure fine-grained permissions for employees.</p>
      <div className="add-bar">
        <input type="email" value={newEmp} onChange={e => setNewEmp(e.target.value)} placeholder="employee@domain.com"/>
        <button className="btn-primary" onClick={add}>Add Employee</button>
      </div>
      <table className="admin-table" style={{marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Analytics & Real-time</th>
            <th>Blocking & Mod</th>
            <th>Subscriptions</th>
            <th>Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emps.map(emp => (
            <tr key={emp.id}>
              <td><strong>{emp.email}</strong></td>
              <td>
                <input type="checkbox" checked={emp.permissions?.analytics || false} onChange={() => togglePerm(emp.id, emp.permissions || {}, 'analytics')} />
              </td>
              <td>
                <input type="checkbox" checked={emp.permissions?.blocking || false} onChange={() => togglePerm(emp.id, emp.permissions || {}, 'blocking')} />
              </td>
              <td>
                <input type="checkbox" checked={emp.permissions?.subscriptions || false} onChange={() => togglePerm(emp.id, emp.permissions || {}, 'subscriptions')} />
              </td>
              <td>
                <input type="checkbox" checked={emp.permissions?.employees || false} onChange={() => togglePerm(emp.id, emp.permissions || {}, 'employees')} />
              </td>
              <td><button className="btn-danger" onClick={() => del(emp.id)}><Trash2 size={14}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

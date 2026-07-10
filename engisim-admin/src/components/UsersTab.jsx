import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc, updateDoc, query, where, orderBy, limit } from '../firebase';
import { UserX, Clock, MapPin, Activity, Mail } from 'lucide-react';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banScope, setBanScope] = useState('global');
  const [banDuration, setBanDuration] = useState('1'); // Days
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setUsers(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert("Failed to fetch users in real-time");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const applyBan = async () => {
    if(!selectedUser) return;
    const durDays = parseInt(banDuration);
    let expiration = 0;
    if (durDays === -1) {
      expiration = 4102444800000; // Year 2100 (Permanent)
    } else {
      expiration = Date.now() + (durDays * 24 * 60 * 60 * 1000);
    }

    try {
      const currentBlocks = selectedUser.blocks || {};
      const newBlocks = { ...currentBlocks, [banScope]: expiration };
      await updateDoc(doc(db, 'users', selectedUser.uid), { blocks: newBlocks });
      
      // Update local state
      setUsers(users.map(u => u.uid === selectedUser.uid ? { ...u, blocks: newBlocks } : u));
      alert(`User banned successfully from ${banScope}.`);
    } catch(e) {
      console.error(e);
      alert("Failed to apply ban");
    }
  };

  const fetchHistory = async (uid) => {
    setHistoryLoading(true);
    try {
      const q = query(collection(db, 'activity_log'), where('uid', '==', uid), orderBy('timestamp', 'desc'), limit(50));
      const snap = await getDocs(q);
      const data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setHistory(data);
    } catch(e) {
      console.error(e);
    }
    setHistoryLoading(false);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>User Management</h2>
      </div>

      {loading ? <p>Loading users...</p> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name / Email</th>
                <th>Location</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isBannedGlobal = u.blocks?.global && u.blocks.global > Date.now();
                return (
                  <tr key={u.id} style={{ opacity: isBannedGlobal ? 0.6 : 1 }}>
                    <td><span className="mono-badge">{u.uniqueId || 'None'}</span></td>
                    <td>
                      <div><strong>{u.displayName || 'Unknown'}</strong></div>
                      <div className="subtext"><Mail size={12}/> {u.email}</div>
                    </td>
                    <td><MapPin size={12}/> {u.location || 'Unknown'}</td>
                    <td>{u.lastLogin ? new Date(u.lastLogin.toDate()).toLocaleString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-small" onClick={() => { setSelectedUser(u); fetchHistory(u.uid); }}>View</button>
                        <button className="btn-small btn-danger" onClick={() => setSelectedUser(u)}>Ban</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '800px', width: '100%'}}>
            <h3>User Profile: {selectedUser.displayName || selectedUser.email}</h3>
            
            <div className="modal-grid">
              <div className="modal-section">
                <h4><UserX size={16}/> Moderation Action</h4>
                <div className="field-row">
                  <label>Scope</label>
                  <select value={banScope} onChange={e => setBanScope(e.target.value)}>
                    <option value="global">Global (Website)</option>
                    <option value="chat">Chat System</option>
                    <option value="community">Community Forum</option>
                  </select>
                </div>
                <div className="field-row">
                  <label>Duration</label>
                  <select value={banDuration} onChange={e => setBanDuration(e.target.value)}>
                    <option value="1">1 Day</option>
                    <option value="7">1 Week</option>
                    <option value="30">1 Month</option>
                    <option value="180">6 Months</option>
                    <option value="365">1 Year</option>
                    <option value="-1">Permanent</option>
                  </select>
                </div>
                <button className="btn-danger" style={{width: '100%', marginTop:'10px'}} onClick={applyBan}>Apply Ban</button>

                <h4 style={{marginTop: '20px'}}>Current Blocks:</h4>
                <pre style={{background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px', overflowX: 'auto'}}>
                  {JSON.stringify(selectedUser.blocks || {}, null, 2)}
                </pre>
              </div>

              <div className="modal-section" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <h4><Activity size={16}/> Activity History (incl. Quizzes)</h4>
                {historyLoading ? <p>Loading history...</p> : (
                  <ul className="history-list">
                    {history.map(h => (
                      <li key={h.id}>
                        <div className="h-action"><strong>{h.action}</strong></div>
                        <div className="h-time"><Clock size={12}/> {h.timestamp ? new Date(h.timestamp.toDate()).toLocaleString() : 'Just now'}</div>
                        {h.details && <div className="h-details">{JSON.stringify(h.details)}</div>}
                      </li>
                    ))}
                    {history.length === 0 && <li>No activity recorded.</li>}
                  </ul>
                )}
              </div>
            </div>

            <div className="modal-actions" style={{marginTop: '20px'}}>
              <button onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

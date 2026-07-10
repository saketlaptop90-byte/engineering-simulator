import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot } from '../firebase';
import { Eye, Activity } from 'lucide-react';

function RealtimeModelsTab() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'model_active_sessions'), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSessions(docs);
    });
    return () => unsub();
  }, []);

  // Group by modelId
  const viewsByModel = {};
  sessions.forEach(s => {
    const mId = s.modelId || 'Unknown Model';
    if (!viewsByModel[mId]) {
      viewsByModel[mId] = 0;
    }
    viewsByModel[mId]++;
  });

  const modelStats = Object.keys(viewsByModel).map(modelId => ({
    modelId,
    count: viewsByModel[modelId]
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2><Activity size={20}/> Real-time Model Views</h2>
      </div>
      <p>Live active sessions across the platform. (Auto-refreshes every few seconds)</p>

      <div style={{ marginTop: '20px' }}>
        {modelStats.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No users are currently viewing any models.</p>
        ) : (
          <div className="card-grid">
            {modelStats.map(stat => (
              <div className="stat-card" key={stat.modelId} style={{ background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.2)', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{stat.modelId}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '2rem', fontWeight: 'bold', color: '#00c8ff' }}>
                  <Eye size={24}/>
                  {stat.count} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal' }}>viewer(s)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ marginTop: '40px', marginBottom: '10px' }}>Raw Session Data</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Model ID</th>
            <th>Last Active Ping</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id}>
              <td style={{ fontFamily: 'monospace' }}>{s.uid}</td>
              <td><strong>{s.modelId}</strong></td>
              <td>{s.last_active?.toDate().toLocaleString() || 'Just now'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RealtimeModelsTab;

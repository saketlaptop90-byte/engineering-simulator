import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc, updateDoc, query, orderBy, limit } from '../firebase';
import { ShoppingBag, Check, X } from 'lucide-react';

export default function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [timeline, setTimeline] = useState('24 hours');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'model_requests'), orderBy('timestamp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert("Failed to fetch requests in real-time");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendQuote = async () => {
    if(!selectedReq) return;
    try {
      const ref = doc(db, 'model_requests', selectedReq.id);
      const updateData = { 
        status: timeline === 'not possible' ? 'rejected' : 'awaiting_user_confirmation',
        quoteTimeline: timeline,
        quotePrice: parseFloat(price),
        quoteDiscount: parseFloat(discount)
      };
      await updateDoc(ref, updateData);
      
      setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, ...updateData } : r));
      alert("Quote sent to user.");
      setSelectedReq(null);
    } catch(e) {
      console.error(e);
      alert("Failed to send quote");
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Special Model Requests</h2>
      </div>

      {loading ? <p>Loading requests...</p> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Model Info</th>
                <th>User / Contact</th>
                <th>Status</th>
                <th>Quoted Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div><strong>{r.modelName}</strong></div>
                    <div className="subtext">{r.description?.substring(0,50)}...</div>
                  </td>
                  <td>
                    <div>{r.contactEmail}</div>
                    <div className="subtext">{r.uid}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${r.status}`}>{r.status || 'pending'}</span>
                  </td>
                  <td>
                    {r.quotePrice !== undefined ? `$${r.quotePrice}` : 'N/A'}
                    {r.quoteDiscount > 0 ? ` (-$${r.quoteDiscount})` : ''}
                    {r.quoteTimeline && <div className="subtext">{r.quoteTimeline}</div>}
                  </td>
                  <td>
                    <button className="btn-small" onClick={() => setSelectedReq(r)}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <h3>Manage Request: {selectedReq.modelName}</h3>
            <p><strong>Description:</strong> {selectedReq.description}</p>
            <p><strong>Current Status:</strong> <span className={`status-badge ${selectedReq.status || 'pending'}`}>{selectedReq.status || 'pending'}</span></p>

            <div className="modal-section" style={{marginTop: '20px'}}>
              <h4>Respond / Quote</h4>
              <div className="field-row">
                <label>Timeline / Feasibility</label>
                <select value={timeline} onChange={e => setTimeline(e.target.value)}>
                  <option value="24 hours">Possible in 24 hours</option>
                  <option value="1 week">Possible in 1 week</option>
                  <option value="1 month">Possible in 1 month</option>
                  <option value="not possible">Not possible</option>
                </select>
              </div>
              
              {timeline !== 'not possible' && (
                <>
                <div className="field-row">
                  <label>Base Price ($)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="field-row">
                  <label>Superadmin Discount ($)</label>
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                </>
              )}

              <button className="btn-success" style={{width: '100%', marginTop:'10px'}} onClick={sendQuote}>
                {timeline === 'not possible' ? 'Reject Request' : 'Send Quote to User'}
              </button>
            </div>

            <div className="modal-actions" style={{marginTop: '20px'}}>
              <button onClick={() => setSelectedReq(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc, getDoc, updateDoc, setDoc } from '../firebase';
import { DollarSign, TrendingUp, BarChart2, CheckCircle, Save, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function RevenueTab() {
  const [payments, setPayments] = useState([]);
  const [pricing, setPricing] = useState({
    premium: 10,
    aiCredits: 5,
    adCredits: 50
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Listen to payments collection
    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      let total = 0;
      const data = snap.docs.map(d => {
        const p = d.data();
        total += p.amount || 0;
        return { id: d.id, ...p };
      });
      
      // Sort by date descending
      data.sort((a, b) => {
        const tA = a.date?.toMillis ? a.date.toMillis() : (new Date(a.date)).getTime();
        const tB = b.date?.toMillis ? b.date.toMillis() : (new Date(b.date)).getTime();
        return tB - tA;
      });

      setPayments(data);
      setTotalRevenue(total);
    });

    // Listen to pricing settings
    const pricingRef = doc(db, 'platform_config', 'pricing');
    getDoc(pricingRef).then(docSnap => {
      if (docSnap.exists()) {
        setPricing(docSnap.data());
      } else {
        // Initialize default pricing
        setDoc(pricingRef, pricing);
      }
    });

    const unsubPricing = onSnapshot(pricingRef, (docSnap) => {
      if (docSnap.exists()) {
        setPricing(docSnap.data());
      }
    });

    return () => {
      unsubPayments();
      unsubPricing();
    };
  }, []);

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'platform_config', 'pricing'), pricing);
      alert('Prices updated successfully. They are now live on the main website.');
    } catch (err) {
      console.error(err);
      alert('Failed to update prices.');
    }
  };

  // Prepare chart data (group by day)
  const chartData = payments.reduce((acc, curr) => {
    let dateStr = "Unknown";
    if (curr.date?.toDate) {
       const dateObj = curr.date.toDate();
       dateStr = dateObj.toLocaleDateString();
    } else if (curr.date) {
       const dateObj = new Date(curr.date);
       dateStr = dateObj.toLocaleDateString();
    }
    
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.revenue += curr.amount;
    } else {
      acc.push({ date: dateStr, revenue: curr.amount });
    }
    return acc;
  }, []).reverse(); // Reverse to show chronological order

  const [renderError, setRenderError] = useState(null);

  // Catch any sync errors in render
  try {
    return (
      <div className="tab-content fade-in">
      <div className="dashboard-header">
        <h1>Revenue & Payments Dashboard</h1>
        <p>Real-time tracking of Premium, AI Credits, and Ad Credits purchases.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(46, 213, 115, 0.2)', color: '#2ed573'}}>
            <DollarSign />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <h2>$\${totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(83, 82, 237, 0.2)', color: '#5352ed'}}>
            <CheckCircle />
          </div>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <h2>{payments.length}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757'}}>
            <TrendingUp />
          </div>
          <div className="stat-info">
            <h3>Avg. Ticket Size</h3>
            <h2>$\${payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : 0}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', marginTop: '20px' }}>
        
        {/* Charts & Table Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="panel">
            <h2>Revenue Trend (Daily)</h2>
            <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#2ed573" strokeWidth={3} dot={{ r: 5, fill: '#2ed573' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <h2>Recent Transactions</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User Email</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 20).map(p => (
                  <tr key={p.id}>
                    <td style={{fontFamily: 'monospace', color: '#888'}}>{p.transactionId || p.id}</td>
                    <td>{p.userEmail}</td>
                    <td>
                      <span className="badge" style={{background: '#333'}}>{p.item}</span>
                    </td>
                    <td style={{color: '#2ed573', fontWeight: 'bold'}}>$\${p.amount}</td>
                    <td>{p.date?.toDate ? p.date.toDate().toLocaleString() : new Date(p.date).toLocaleString()}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No transactions found yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Price Management Sidebar */}
        <div className="panel" style={{ height: 'fit-content' }}>
          <h2><Settings size={18} style={{marginRight: '8px'}}/> Dynamic Pricing</h2>
          <p style={{marginBottom: '20px', color: '#888', fontSize: '14px'}}>
            Update the prices below. Changes will reflect instantly on the main website Store.
          </p>
          
          <form onSubmit={handlePriceUpdate}>
            <div className="field-row" style={{marginBottom: '15px'}}>
              <label>Premium Upgrade ($)</label>
              <input 
                type="number" 
                value={pricing.premium} 
                onChange={(e) => setPricing({...pricing, premium: parseFloat(e.target.value)})} 
                required 
              />
            </div>
            
            <div className="field-row" style={{marginBottom: '15px'}}>
              <label>AI Credits Pack ($)</label>
              <input 
                type="number" 
                value={pricing.aiCredits} 
                onChange={(e) => setPricing({...pricing, aiCredits: parseFloat(e.target.value)})} 
                required 
              />
            </div>
            
            <div className="field-row" style={{marginBottom: '20px'}}>
              <label>Ad Credits Pack ($)</label>
              <input 
                type="number" 
                value={pricing.adCredits} 
                onChange={(e) => setPricing({...pricing, adCredits: parseFloat(e.target.value)})} 
                required 
              />
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%'}}>
              <Save size={16} /> Save Prices
            </button>
          </form>
        </div>

      </div>
    </div>
    );
  } catch (err) {
    return (
      <div className="tab-content fade-in">
        <h1 style={{color: '#ff4757'}}>Revenue Dashboard Crashed</h1>
        <pre style={{color: 'white', background: '#333', padding: '15px'}}>{err.toString()}\n{err.stack}</pre>
      </div>
    );
  }
}

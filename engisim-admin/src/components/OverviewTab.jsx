import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, MessageSquare, ShoppingBag } from 'lucide-react';

function OverviewTab() {
  const [stats, setStats] = useState({
    users: 0,
    messagesToday: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        
        // Fetch requests
        const requestsRef = collection(db, 'service_requests');
        const requestsSnap = await getDocs(requestsRef);
        
        const pendingCount = requestsSnap.docs.filter(d => d.data().status === 'pending').length;

        // Mock messages for now, or you could query a chats collection
        const messagesCount = 1240;

        setStats({
          users: usersSnap.size || 0,
          messagesToday: messagesCount,
          pendingRequests: pendingCount,
        });
      } catch (error) {
        console.error("Error fetching overview stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--primary)', padding: '20px' }}>Loading Dashboard...</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Dashboard Overview</h2>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card glass">
          <Users size={32} color="#00c8ff" />
          <div className="kpi-info">
            <h3>Total Users</h3>
            <p className="kpi-value">{stats.users}</p>
          </div>
        </div>
        <div className="kpi-card glass">
          <MessageSquare size={32} color="#00c8ff" />
          <div className="kpi-info">
            <h3>Messages Sent Today</h3>
            <p className="kpi-value">{stats.messagesToday}</p>
          </div>
        </div>
        <div className="kpi-card glass">
          <ShoppingBag size={32} color="#00c8ff" />
          <div className="kpi-info">
            <h3>Pending Requests</h3>
            <p className="kpi-value">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;

import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsTab() {
  const [userChartData, setUserChartData] = useState([]);
  const [chatChartData, setChatChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [modelAnalytics, setModelAnalytics] = useState([]);

  useEffect(() => {
    // Generate the last 7 days for labels
    const getLabels = () => {
      const today = new Date();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dateString: d.toISOString().split('T')[0] // yyyy-mm-dd format for matching
        });
      }
      return days;
    };

    const daysInfo = getLabels();
    setLabels(daysInfo.map(d => d.label));

    // Listen to users
    const unsubUsers = onSnapshot(query(collection(db, 'users')), (snap) => {
      const counts = new Array(7).fill(0);
      snap.forEach(doc => {
        const data = doc.data();
        if (data.createdAt) {
          // createdAt could be a Firestore timestamp or string depending on how it was saved
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const dateStr = date.toISOString().split('T')[0];
          const index = daysInfo.findIndex(d => d.dateString === dateStr);
          if (index !== -1) {
            counts[index]++;
          }
        }
      });
      setUserChartData(counts);
    });

    // Listen to chats
    const unsubChats = onSnapshot(query(collection(db, 'chats')), (snap) => {
      const counts = new Array(7).fill(0);
      snap.forEach(doc => {
        const data = doc.data();
        if (data.createdAt) {
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const dateStr = date.toISOString().split('T')[0];
          const index = daysInfo.findIndex(d => d.dateString === dateStr);
          if (index !== -1) {
            counts[index]++;
          }
        }
      });
      setChatChartData(counts);
    });

    // Listen to model analytics
    const unsubAnalytics = onSnapshot(query(collection(db, 'model_analytics'), orderBy('timestamp', 'desc')), (snap) => {
      const data = [];
      snap.forEach(doc => data.push({id: doc.id, ...doc.data()}));
      setModelAnalytics(data);
    });

    return () => { unsubUsers(); unsubChats(); unsubAnalytics(); };
  }, []);

  const lineData = {
    labels: labels,
    datasets: [
      {
        label: 'New User Registrations',
        data: userChartData,
        borderColor: '#00c8ff',
        backgroundColor: 'rgba(0, 200, 255, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barData = {
    labels: labels,
    datasets: [
      {
        label: 'New Chats Created',
        data: chatChartData,
        backgroundColor: 'rgba(124, 106, 255, 0.7)',
        borderColor: '#7c6aff',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#fff' } }
    },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  // Aggregation for Model Analytics
  const modelViews = {};
  const featureCounts = {};
  
  modelAnalytics.forEach(row => {
     if (row.modelId) {
         if(!modelViews[row.modelId]) modelViews[row.modelId] = { views: 0, totalDuration: 0 };
         modelViews[row.modelId].views++;
         modelViews[row.modelId].totalDuration += (row.durationSeconds || 0);
     }
     if (row.featuresUsed && Array.isArray(row.featuresUsed)) {
         row.featuresUsed.forEach(feat => {
             if (!featureCounts[feat]) featureCounts[feat] = 0;
             featureCounts[feat]++;
         });
     }
  });

  const topModels = Object.keys(modelViews).map(id => ({
      id, 
      views: modelViews[id].views, 
      duration: modelViews[id].totalDuration
  })).sort((a,b) => b.views - a.views).slice(0, 5);

  const topFeatures = Object.keys(featureCounts).map(f => ({
      feature: f,
      count: featureCounts[f]
  })).sort((a,b) => b.count - a.count);

  return (
    <div className="tab-pane active fade-in" id="analytics-tab">
      <div className="content-header">
        <h2>Live Analytics (Last 7 Days)</h2>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="chart-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,200,255,0.1)', borderRadius: '12px', padding: '20px', height: '300px' }}>
          <h3 style={{ marginBottom: '15px', color: '#00c8ff', fontSize: '1.1rem' }}>User Growth</h3>
          <Line data={lineData} options={chartOptions} />
        </div>
        
        <div className="chart-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,106,255,0.1)', borderRadius: '12px', padding: '20px', height: '300px' }}>
          <h3 style={{ marginBottom: '15px', color: '#7c6aff', fontSize: '1.1rem' }}>Chat Activity</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      <div className="analytics-details">
        <div className="chart-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,200,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#00c8ff', fontSize: '1.1rem' }}>Most Visited Models</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Model</th>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Views</th>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {topModels.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', fontSize: '0.9rem' }}>{m.id}</td>
                  <td style={{ padding: '8px 0', fontSize: '0.9rem' }}>{m.views}</td>
                  <td style={{ padding: '8px 0', fontSize: '0.9rem' }}>{m.duration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,106,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#7c6aff', fontSize: '1.1rem' }}>Most Used Features</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Feature</th>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Uses</th>
              </tr>
            </thead>
            <tbody>
              {topFeatures.map(f => (
                <tr key={f.feature} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', fontSize: '0.9rem', textTransform: 'capitalize' }}>{f.feature.replace('_',' ')}</td>
                  <td style={{ padding: '8px 0', fontSize: '0.9rem' }}>{f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,100,100,0.1)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#ff6666', fontSize: '1.1rem' }}>Recent Viewers</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>User</th>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Model</th>
                <th style={{ padding: '8px 0', color: 'rgba(255,255,255,0.5)' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {modelAnalytics.slice(0,5).map((a, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', fontSize: '0.8rem', color: a.userId.startsWith('anon') ? '#888' : '#fff' }}>{a.userId.substring(0, 10)}...</td>
                  <td style={{ padding: '8px 0', fontSize: '0.8rem' }}>{a.modelId.substring(0, 12)}...</td>
                  <td style={{ padding: '8px 0', fontSize: '0.8rem' }}>{a.durationSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

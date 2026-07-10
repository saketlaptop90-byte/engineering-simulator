import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc, deleteDoc, updateDoc, query, orderBy, limit } from '../firebase';
import { MessageSquare, Trash2, ShieldAlert } from 'lucide-react';

export default function ChatsTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For admin portal, we might fetch community_posts directly as a global feed, 
    // or query the 'messages' subcollections using a Collection Group Query.
    // For simplicity, let's fetch 'community_posts' as the main global chat.
    const q = query(collection(db, 'community_posts'), limit(100));
    const unsubscribe = onSnapshot(q, (snap) => {
      let data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      data = data.sort((a, b) => ((b.timestamp || b.createdAt)?.toMillis() || 0) - ((a.timestamp || a.createdAt)?.toMillis() || 0));
      setMessages(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert("Failed to fetch community posts in real-time");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteMessage = async (id) => {
    if(!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, 'community_posts', id));
      setMessages(messages.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete message");
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Community Moderation</h2>
      </div>

      {loading ? <p>Loading messages...</p> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Content</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td>
                    <div><strong>{m.authorName || 'Unknown'}</strong></div>
                    <div className="subtext">{m.authorUniqueId || m.authorId}</div>
                  </td>
                  <td>{m.content || m.text}</td>
                  <td>{(m.timestamp || m.createdAt) ? new Date((m.timestamp || m.createdAt).toDate()).toLocaleString() : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-small btn-danger" onClick={() => deleteMessage(m.id)}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

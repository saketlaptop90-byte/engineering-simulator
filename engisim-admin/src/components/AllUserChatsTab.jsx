import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit, collectionGroup } from '../firebase';
import { MessageSquare, Users, Trash2 } from 'lucide-react';

export default function AllUserChatsTab() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch all chat metadata
    const q = query(collection(db, 'chats'));
    const unsubscribe = onSnapshot(q, (snap) => {
      let data = [];
      snap.forEach(d => {
        // Exclude AI chats (usually engibot_uid)
        if (!d.id.startsWith('engibot_')) {
          data.push({ id: d.id, ...d.data() });
        }
      });
      data.sort((a, b) => ((b.lastMessageTime || b.createdAt)?.toMillis() || 0) - ((a.lastMessageTime || a.createdAt)?.toMillis() || 0));
      setChats(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openChat = (chatId) => {
    setSelectedChat(chatId);
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
    onSnapshot(q, (snap) => {
      let msgs = [];
      snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>All User Chats (P2P & Groups)</h2>
      </div>

      <div style={{ display: 'flex', gap: '20px', minHeight: '500px' }}>
        {/* Chat List */}
        <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px', overflowY: 'auto', maxHeight: '600px' }}>
          {loading ? <p>Loading chats...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chats.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => openChat(c.id)}
                  style={{ 
                    padding: '12px', 
                    background: selectedChat === c.id ? 'rgba(0,200,255,0.1)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    border: selectedChat === c.id ? '1px solid #00c8ff' : '1px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{c.type === 'group' ? <Users size={14}/> : <MessageSquare size={14}/>} {c.title || c.id}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    Participants: {c.participants?.join(', ') || 'Unknown'}
                  </div>
                </div>
              ))}
              {chats.length === 0 && <p>No user chats found.</p>}
            </div>
          )}
        </div>

        {/* Message View */}
        <div style={{ flex: 2, paddingLeft: '10px', overflowY: 'auto', maxHeight: '600px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!selectedChat ? (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Select a chat to view messages</div>
          ) : (
            messages.map(m => (
              <div key={m.id} style={{ 
                padding: '10px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                borderLeft: '4px solid #00c8ff'
              }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>
                  <strong>{m.senderId || 'Unknown'}</strong> &bull; {m.timestamp ? new Date(m.timestamp.toDate()).toLocaleString() : 'N/A'}
                </div>
                <div>{m.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

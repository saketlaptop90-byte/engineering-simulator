import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Megaphone, Plus, Trash2, Edit, CheckCircle, XCircle, 
  Image as ImageIcon, Link, Clock, MapPin, DollarSign 
} from 'lucide-react';

const AdsManagerTab = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mediaType: 'image',
    mediaUrl: '',
    redirectUrl: '',
    targetPage: 'all',
    position: 'bottom-right',
    size: 'medium',
    creditsReward: 5,
    skipCost: 0,
    displayDuration: 0,
    expiresAt: '',
    isActive: true
  });

  useEffect(() => {
    const q = query(collection(db, 'sponsors'));
    const unsub = onSnapshot(q, (snapshot) => {
      const adsData = [];
      snapshot.forEach(doc => {
        adsData.push({ id: doc.id, ...doc.data() });
      });
      setAds(adsData);
      setLoading(false);
    }, (error) => {
      console.error("Ads fetch error:", error);
      alert("Failed to load ads: " + error.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        creditsReward: parseInt(formData.creditsReward),
        skipCost: parseInt(formData.skipCost),
        displayDuration: parseInt(formData.displayDuration),
      };
      // Format date string to ISO
      if (dataToSave.expiresAt) {
          dataToSave.expiresAt = new Date(dataToSave.expiresAt).toISOString();
      }
      
      await addDoc(collection(db, 'sponsors'), dataToSave);
      setShowForm(false);
      setFormData({
        mediaType: 'image', mediaUrl: '', redirectUrl: '', targetPage: 'all',
        position: 'bottom-right', size: 'medium', creditsReward: 5,
        skipCost: 0, displayDuration: 0, expiresAt: '', isActive: true
      });
    } catch (err) {
      console.error(err);
      alert("Error adding ad: " + err.message);
    }
  };

  const toggleActive = async (adId, currentStatus) => {
    await updateDoc(doc(db, 'sponsors', adId), { isActive: !currentStatus });
  };

  const deleteAd = async (adId) => {
    if(window.confirm('Delete this advertisement permanently?')) {
      await deleteDoc(doc(db, 'sponsors', adId));
    }
  };

  // --- Reusable inline style objects ---
  const styles = {
    loadingText: {
      color: '#9ca3af',
      padding: '2rem',
      textAlign: 'center',
      animation: 'pulse 1.5s infinite',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    headerBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(31, 41, 55, 0.4)',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '1px solid rgba(55, 65, 81, 0.5)',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: 0,
    },
    headerSubtext: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      marginTop: '0.25rem',
      marginBottom: 0,
    },
    newAdBtn: {
      background: '#4f46e5',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: 'background-color 0.2s',
    },
    formContainer: {
      background: 'rgba(31, 41, 55, 0.8)',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    formTitle: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#ffffff',
      marginBottom: '1rem',
      marginTop: 0,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    },
    fieldLabel: {
      display: 'block',
      fontSize: '0.875rem',
      color: '#9ca3af',
      marginBottom: '0.25rem',
    },
    fieldInput: {
      width: '100%',
      background: '#111827',
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      color: '#ffffff',
      boxSizing: 'border-box',
      outline: 'none',
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#ffffff',
    },
    formFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: '1rem',
      borderTop: '1px solid #374151',
    },
    deployBtn: {
      background: '#059669',
      color: '#ffffff',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: 500,
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
    },
    adCard: {
      background: '#1f2937',
      borderRadius: '0.75rem',
      border: '1px solid #374151',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    adMediaContainer: {
      height: '10rem',
      background: '#111827',
      position: 'relative',
    },
    adMedia: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    adCardBody: {
      padding: '1rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    adRedirectRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    adRedirectLink: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#60a5fa',
      textDecoration: 'none',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '200px',
      display: 'inline-block',
    },
    adMetaGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    adMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    adFooter: {
      marginTop: 'auto',
      paddingTop: '1rem',
      borderTop: '1px solid #374151',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteBtn: {
      color: '#f87171',
      background: 'transparent',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
  };

  const getStatusBadgeStyle = (isActive, isExpired) => ({
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: isActive && !isExpired ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
    color: '#ffffff',
  });

  const getToggleBtnStyle = (isActive) => ({
    fontSize: '0.875rem',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    background: isActive ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
    color: isActive ? '#eab308' : '#22c55e',
  });

  if (loading) return <div style={styles.loadingText}>Loading Ads...</div>;

  try {
  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <div>
          <h2 style={styles.headerTitle}>
            <Megaphone style={{ width: '1.5rem', height: '1.5rem', color: '#818cf8' }} /> Advertisement Manager
          </h2>
          <p style={styles.headerSubtext}>Deploy dynamic ads and manage user credits in real-time.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={styles.newAdBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
          onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
        >
          {showForm ? 'Cancel' : <><Plus style={{ width: '1rem', height: '1rem' }} /> New Ad</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <h3 style={styles.formTitle}>Deploy New Advertisement</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.fieldLabel}>Media Type</label>
              <select name="mediaType" value={formData.mediaType} onChange={handleInputChange} style={styles.fieldInput}>
                <option value="image">Image (Photo)</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Media URL</label>
              <input required type="url" name="mediaUrl" value={formData.mediaUrl} onChange={handleInputChange} style={styles.fieldInput} placeholder="https://..."/>
            </div>
            <div>
              <label style={styles.fieldLabel}>Redirect URL (On Click)</label>
              <input required type="url" name="redirectUrl" value={formData.redirectUrl} onChange={handleInputChange} style={styles.fieldInput} placeholder="https://..."/>
            </div>
            <div>
              <label style={styles.fieldLabel}>Target Page</label>
              <select name="targetPage" value={formData.targetPage} onChange={handleInputChange} style={styles.fieldInput}>
                <option value="all">All Pages</option>
                <option value="index">Homepage Only</option>
                <option value="simulator">Simulator Only</option>
                <option value="community">Community Only</option>
                <option value="messages">Messages Only</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Position</label>
              <select name="position" value={formData.position} onChange={handleInputChange} style={styles.fieldInput}>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="center">Center Modal</option>
                <option value="top-banner">Top Banner</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Size</label>
              <select name="size" value={formData.size} onChange={handleInputChange} style={styles.fieldInput}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Credits Reward (Awarded on Click)</label>
              <input type="number" name="creditsReward" value={formData.creditsReward} onChange={handleInputChange} style={styles.fieldInput} />
            </div>
            <div>
              <label style={styles.fieldLabel}>Skip Cost (Credits needed to skip)</label>
              <input type="number" name="skipCost" value={formData.skipCost} onChange={handleInputChange} style={styles.fieldInput} />
            </div>
            <div>
              <label style={styles.fieldLabel}>Display Duration (Seconds, 0 = infinite)</label>
              <input type="number" name="displayDuration" value={formData.displayDuration} onChange={handleInputChange} style={styles.fieldInput} />
            </div>
            <div>
              <label style={styles.fieldLabel}>Expiration Date (Optional)</label>
              <input type="datetime-local" name="expiresAt" value={formData.expiresAt} onChange={handleInputChange} style={styles.fieldInput} />
            </div>
            <div style={styles.checkboxRow}>
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} id="isActive" />
              <label htmlFor="isActive" style={styles.checkboxLabel}>Ad is Active immediately</label>
            </div>
          </div>
          <div style={styles.formFooter}>
            <button type="submit" style={styles.deployBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#047857'}
              onMouseLeave={e => e.currentTarget.style.background = '#059669'}
            >
              Deploy Ad
            </button>
          </div>
        </form>
      )}

      <div className="ads-cards-grid" style={styles.cardsGrid}>
        {ads.map(ad => {
          const isExpired = ad.expiresAt && new Date(ad.expiresAt).getTime() < Date.now();
          return (
            <div key={ad.id} style={styles.adCard}>
              <div style={styles.adMediaContainer}>
                {ad.mediaType === 'video' ? (
                  <video src={ad.mediaUrl} style={styles.adMedia} muted />
                ) : (
                  <img src={ad.mediaUrl} style={styles.adMedia} alt="Ad preview" />
                )}
                <div style={getStatusBadgeStyle(ad.isActive, isExpired)}>
                  {isExpired ? 'EXPIRED' : (ad.isActive ? 'ACTIVE' : 'INACTIVE')}
                </div>
              </div>
              
              <div style={styles.adCardBody}>
                <div style={styles.adRedirectRow}>
                  <a href={ad.redirectUrl} target="_blank" rel="noreferrer" style={styles.adRedirectLink} title={ad.redirectUrl}>
                    <Link style={{ display: 'inline', width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }}/> {ad.redirectUrl}
                  </a>
                </div>
                
                <div style={styles.adMetaGrid}>
                  <div style={styles.adMetaItem}><MapPin style={{ width: '0.75rem', height: '0.75rem' }}/> {ad.targetPage}</div>
                  <div style={styles.adMetaItem}><ImageIcon style={{ width: '0.75rem', height: '0.75rem' }}/> {ad.size} / {ad.position}</div>
                  <div style={styles.adMetaItem}><DollarSign style={{ width: '0.75rem', height: '0.75rem', color: '#4ade80' }}/> +{ad.creditsReward} Reward</div>
                  <div style={styles.adMetaItem}><XCircle style={{ width: '0.75rem', height: '0.75rem', color: '#f87171' }}/> -{ad.skipCost} Skip Cost</div>
                </div>

                <div style={styles.adFooter}>
                  <button 
                    onClick={() => toggleActive(ad.id, ad.isActive)}
                    style={getToggleBtnStyle(ad.isActive)}
                  >
                    {ad.isActive ? 'Pause Ad' : 'Resume Ad'}
                  </button>
                  <button onClick={() => deleteAd(ad.id)} style={styles.deleteBtn} title="Delete"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} catch (err) {
  return (
    <div className="tab-content fade-in" style={styles.container}>
      <h1 style={{color: '#ff4757'}}>Ads Dashboard Crashed</h1>
      <pre style={{color: 'white', background: '#333', padding: '15px'}}>{err.toString()}\n{err.stack}</pre>
    </div>
  );
}
};
export default AdsManagerTab;

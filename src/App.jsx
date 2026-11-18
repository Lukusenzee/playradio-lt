import React, { useState, useEffect, useRef } from 'react';
import { STYLES, DEFAULT_POSTS, DEFAULT_TOP40, DEFAULT_SCHEDULE, DEFAULT_SETTINGS } from './data.js';
import { supabase } from './supabase.js';

const DAYS = [
  { id: 1, name: 'Pirmadienis' }, { id: 2, name: 'Antradienis' },
  { id: 3, name: 'Trečiadienis' }, { id: 4, name: 'Ketvirtadienis' },
  { id: 5, name: 'Penktadienis' }, { id: 6, name: 'Šeštadienis' },
  { id: 0, name: 'Sekmadienis' },
];

export default function App() {
  const sPosts = useState(DEFAULT_POSTS), posts = sPosts.at(0), setPosts = sPosts.at(1);
  const sTop = useState(DEFAULT_TOP40), top40 = sTop.at(0), setTop40 = sTop.at(1);
  const sSet = useState(DEFAULT_SETTINGS), settings = sSet.at(0), setSettings = sSet.at(1);
  const sTab = useState('NAUJIENOS'), activeTab = sTab.at(0), setActiveTab = sTab.at(1);
  const sDay = useState(() => new Date().getDay()), selectedDay = sDay.at(0), setSelectedDay = sDay.at(1);
  const sPost = useState(null), selectedPost = sPost.at(0), setSelectedPost = sPost.at(1);
  const sAdm = useState(false), isAdmin = sAdm.at(0), setIsAdmin = sAdm.at(1);
  const sPlay = useState(false), isPlaying = sPlay.at(0), setIsPlaying = sPlay.at(1);
  const sVol = useState(0.8), volume = sVol.at(0), setVolume = sVol.at(1);
  const sTrk = useState('PlayRadio.lt — More Hits!'), liveTrack = sTrk.at(0), setLiveTrack = sTrk.at(1);
    const sModal = useState(false), showPlayerModal = sModal.at(0), setShowPlayerModal = sModal.at(1);
    const sCov = useState('https://unsplash.com'), coverUrl = sCov.at(0), setCoverUrl = sCov.at(1);


  const audioRef = useRef(null);
  const sA1 = useState('posts'), adminTab = sA1.at(0), setAdminTab = sA1.at(1);
  const sEdit = useState(null), editId = sEdit.at(0), setEditId = sEdit.at(1);
  const sA2 = useState(''), title = sA2.at(0), setTitle = sA2.at(1);
  const sA3 = useState(''), content = sA3.at(0), setContent = sA3.at(1);
  const sA4 = useState(''), photoUrl = sA4.at(0), setPhotoUrl = sA4.at(1);
  const sA5 = useState(50), focusX = sA5.at(0), setFocusX = sA5.at(1);
  const sA6 = useState(25), focusY = sA6.at(0), setFocusY = sA6.at(1);
  const sA7 = useState(''), artist = sA7.at(0), setArtist = sA7.at(1);
  const sA8 = useState(''), track = sA8.at(0), setTrack = sA8.at(1);

  useEffect(() => {
    const loadCloud = async () => {
      const { data } = await supabase.from('site_data').select('*');
      if (data && data.length > 0) {
        data.forEach((row) => {
          if (row.key === 'posts' && Array.isArray(row.value)) setPosts(row.value);
          if (row.key === 'top40' && Array.isArray(row.value)) setTop40(row.value);
          if (row.key === 'settings' && row.value) setSettings(row.value);
        });
      }
    };
    loadCloud();
  }, []);
 

  useEffect(() => {
    if (settings.bgImage) {
      document.body.style.backgroundImage = `url("${settings.bgImage}")`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [settings]);

   useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data } = await supabase
          .from('site_data')
          .select('value')
          .eq('key', 'now_playing')
          .single();

        if (data && data.value && data.value.track) {
          setLiveTrack(data.value.track);
        }
      } catch (e) {}
    };

    fetchSong();
    const timer = setInterval(fetchSong, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!liveTrack || liveTrack.includes('PlayRadio.lt')) return;
    // Išvalome skliaustelius (pvz. "(4 Christmas)"), kad iTunes visada rastų tikrą viršelį
    const cleanQuery = liveTrack.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    fetch(`https://apple.com{encodeURIComponent(cleanQuery)}&entity=song&limit=1`)
      .then((r) => r.json())
      .then((d) => {
        const art = d.results?.at(0)?.artworkUrl100;
        if (art) setCoverUrl(art.replace('100x100', '600x600'));
      })
      .catch(() => {});
  }, [liveTrack]);


  const saveCloud = async (key, value) => {
    const { error } = await supabase.from('site_data').upsert({ key, value }, { onConflict: 'key' });
    if (error) {
      alert('Supabase klaida: ' + error.message);
      console.error(error);
    }
  };
  const togglePlay = (openModal = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && !openModal) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const targetSrc = `https://stream${'.'}radiojar${'.'}com/d9cm273ystzuv`;
      if (!audio.src || !audio.src.includes('d9cm273ystzuv')) audio.src = targetSrc;
      audio.volume = volume;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
          if (openModal) setShowPlayerModal(true);
        }).catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        });
      }
    }
  };

  const addPost = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalPhoto = photoUrl.trim() || DEFAULT_POSTS.at(0).photoUrl;
    let updated;
    if (editId) {
      updated = posts.map((p) => (p.id === editId ? { ...p, title: title.toUpperCase(), excerpt: content.slice(0, 115) + '...', content, photoUrl: finalPhoto, focusX, focusY } : p));
      setEditId(null);
    } else {
      updated = [{ id: Date.now(), title: title.toUpperCase(), excerpt: content.slice(0, 115) + '...', content, photoUrl: finalPhoto, focusX, focusY }, ...posts];
    }
    setPosts(updated);
    saveCloud('posts', updated);
    setTitle(''); setContent(''); setPhotoUrl('');
  };

  const menu = ['NAUJIENOS', 'PROGRAMA', 'LAIDOS', 'PLAYLIST', 'TOP 40', 'AIRPLAY TOP 200', 'METŲ TOP 100', 'APIE MUS', 'KONTAKTAI'];

  return (
    <>
      <style>{STYLES}</style>
      <div className="wp-admin-bar">
        <div><strong>PlayRadio.lt</strong> — More Hits!</div>
        <button onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? '← Grįžti į svetainę' : '⚙ Valdymo skydelis'}</button>
      </div>
      {isAdmin ? (
        <div className="dashboard-panel">
          <aside className="dash-sidebar">
            <button className={adminTab === 'posts' ? 'active' : ''} onClick={() => setAdminTab('posts')}>📝 Naujienos</button>
            <button className={adminTab === 'charts' ? 'active' : ''} onClick={() => setAdminTab('charts')}>🔥 TOP 40</button>
            <button className={adminTab === 'settings' ? 'active' : ''} onClick={() => setAdminTab('settings')}>📻 Fonas / Logo</button>
          </aside>
          <main className="dash-main">
            {adminTab === 'posts' && (<>
              <div className="dash-card">
                <h3 style={{ marginBottom: 12 }}>{editId ? 'Redaguoti naujieną' : 'Naujas straipsnis'}</h3>
                <form onSubmit={addPost}>
                  <input className="dash-input" placeholder="Antraštė" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  <input className="dash-input" placeholder="Nuotraukos URL (https://...)" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                  {photoUrl && (<div style={{ marginBottom: 12, padding: 10, background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                    <div style={{ width: 260, height: 175, overflow: 'hidden', border: '2px solid #2271b1', marginBottom: 6 }}>
                      <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focusX}% ${focusY}%` }} />
                    </div>
                    <label style={{ fontSize: 12 }}>X ({focusX}%): </label><input type="range" min="0" max="100" value={focusX} onChange={(e) => setFocusX(Number(e.target.value))} style={{ marginRight: 14 }} />
                    <label style={{ fontSize: 12 }}>Y ({focusY}%): </label><input type="range" min="0" max="100" value={focusY} onChange={(e) => setFocusY(Number(e.target.value))} />
                  </div>)}
                  <textarea className="dash-textarea" rows="4" placeholder="Pilnas tekstas" value={content} onChange={(e) => setContent(e.target.value)} required />
                  <button type="submit" className="dash-btn-primary">{editId ? 'Išsaugoti pakeitimus' : 'Publikuoti'}</button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setTitle(''); setContent(''); setPhotoUrl(''); }} style={{ marginLeft: 10, padding: '8px 14px' }}>Atšaukti</button>}
                </form>
              </div>
              <div className="dash-card">{posts.map((p) => (<div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span><strong>{p.title}</strong></span>
                <div>
                  <button className="dash-btn-primary" style={{ marginRight: 8, padding: '5px 10px', fontSize: 12 }} onClick={() => { setEditId(p.id); setTitle(p.title); setContent(p.content); setPhotoUrl(p.photoUrl); setFocusX(p.focusX || 50); setFocusY(p.focusY || 25); }}>Redaguoti</button>
                  <button className="dash-btn-danger" onClick={() => { const u = posts.filter((x) => x.id !== p.id); setPosts(u); saveCloud('posts', u); }}>Trinti</button>
                </div>
              </div>))}</div>
            </>)}
            {adminTab === 'charts' && (<div className="dash-card">
              <form onSubmit={(e) => { e.preventDefault(); if (artist && track) { const u = [...top40, { artist, title: track }]; setTop40(u); saveCloud('top40', u); setArtist(''); setTrack(''); } }} style={{ display: 'flex', gap: 8 }}>
                <input className="dash-input" placeholder="Atlikėjas" value={artist} onChange={(e) => setArtist(e.target.value)} />
                <input className="dash-input" placeholder="Daina" value={track} onChange={(e) => setTrack(e.target.value)} />
                <button type="submit" className="dash-btn-primary" style={{ height: 38 }}>Pridėti</button>
              </form>
              {top40.map((t, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>{i + 1}. <strong>{t.artist}</strong> — {t.title}</span><button className="dash-btn-danger" onClick={() => { const u = top40.filter((_, idx) => idx !== i); setTop40(u); saveCloud('top40', u); }}>X</button>
              </div>))}
            </div>)}
            {adminTab === 'settings' && (<div className="dash-card">
              <h3 style={{ marginBottom: 14 }}>Mėnesinis Fonas ir Logotipas</h3>
              <label style={{ fontWeight: 700 }}>Fono nuotraukos URL:</label>
              <input className="dash-input" placeholder="https://..." value={settings.bgImage || ''} onChange={(e) => { const u = { ...settings, bgImage: e.target.value }; setSettings(u); saveCloud('settings', u); }} />
              <label style={{ fontWeight: 700 }}>Logotipo URL:</label>
              <input className="dash-input" placeholder="https://..." value={settings.logoUrl || ''} onChange={(e) => { const u = { ...settings, logoUrl: e.target.value }; setSettings(u); saveCloud('settings', u); }} />
            </div>)}
          </main>
        </div>
      ) : (
        <div className="site-wrapper">
          <aside className="left-sidebar" style={{ paddingTop: 205 }}>
            <ul className="side-menu">
                            <li>
                <button className={`play-item ${isPlaying ? 'playing' : ''}`} onClick={() => togglePlay(true)}>
                  {isPlaying ? '🔊 GROJA (ATIDARYTI INFO)' : '► PLAY / GROTI'}
                </button>
              </li>

              {menu.map((m) => (<li key={m}><button className={activeTab === m && !selectedPost ? 'active' : ''} onClick={() => { setActiveTab(m); setSelectedPost(null); }}>{m}</button></li>))}
            </ul>
          </aside>
          <main className="main-content-column">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 12 }}>
              <svg width="285" height="118" viewBox="0 0 310 125" style={{ display: 'block', overflow: 'visible' }}>
                <g transform="rotate(-3 145 65)">
                  <polygon points="15,66 255,66 268,80 28,80" fill="#9ca3af" />
                  <polygon points="15,66 255,66 268,103 28,103" fill="#18181b" />
                  <rect x="15" y="28" width="240" height="38" fill="#ffffff" />
                  <text x="135" y="56" textAnchor="middle" fill="#09090b" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontStyle="italic" fontSize="31" letterSpacing="1">PLAY RADIO</text>
                  <text x="148" y="94" textAnchor="middle" fill="#ffffff" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic" fontSize="22" letterSpacing="1.5">MORE HITS!</text>
                  <g transform="translate(226, 2) rotate(14)">
                    <path d="M6,26 Q24,-10 54,14 Q62,21 60,34 Q40,22 6,26 Z" fill="#dc2626" />
                    <rect x="2" y="23" width="46" height="9" rx="4.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="61" cy="36" r="5.5" fill="#ffffff" />
                  </g>
                </g>
              </svg>
              <div style={{ background: 'rgba(255, 255, 255, 0.88)', color: '#09090b', padding: '6px 14px', borderRadius: 4, marginTop: -6, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                <div style={{ fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 900, fontSize: 13.5 }}>CHRISTMAS SPECIAL 24.12-26.12</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 4 }}>
                  <div><div style={{ fontSize: 18, lineHeight: 1 }}>👑</div><div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 15 }}>TOP 100</div><div style={{ fontSize: 8.5, fontWeight: 700 }}>OF THE YEAR</div></div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 25, fontWeight: 700 }}>31.12</div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, lineHeight: 1.15, textAlign: 'left' }}>+2UTC<br />TIME<br />ZONE</div>
                </div>
              </div>
            </div>
            <div className="content-box">
              {selectedPost ? (<div>
                <button onClick={() => setSelectedPost(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 4, cursor: 'pointer', marginBottom: 16 }}>← Grįžti</button>
                <h1 className="page-heading">{selectedPost.title}</h1>
                <img src={selectedPost.photoUrl} alt="" style={{ maxWidth: '100%', borderRadius: 4, marginBottom: 16 }} />
                <p style={{ lineHeight: 1.75 }}>{selectedPost.content}</p>
              </div>) : activeTab === 'NAUJIENOS' ? (<>
                <h1 className="page-heading">Naujienos</h1>
                <div className="fox-grid">{posts.map((p) => (<article className="fox-card" key={p.id} onClick={() => setSelectedPost(p)}>
                  <div className="fox-card-img-wrap"><img src={p.photoUrl} alt="" className="fox-card-img" style={{ objectPosition: `${p.focusX || 50}% ${p.focusY || 25}%` }} /></div>
                  <div className="fox-card-body"><h2 className="fox-card-title">{p.title}</h2><p className="fox-card-excerpt">{p.excerpt}</p></div>
                </article>))}</div>
              </>) : activeTab === 'TOP 40' ? (<>
                <h1 className="page-heading">TOP 40</h1>
                <table className="chart-table"><tbody>{top40.map((t, i) => (<tr key={i}><td style={{ color: '#ef4444', fontWeight: 700, width: 45 }}>{i + 1}</td><td><strong>{t.artist}</strong> — {t.title}</td></tr>))}</tbody></table>
              </>) : activeTab === 'PROGRAMA' ? (<>
                <h1 className="page-heading">Programa</h1>
                <div className="day-tabs">{DAYS.map((d) => (<button key={d.id} className={`day-tab ${selectedDay === d.id ? 'active' : ''}`} onClick={() => setSelectedDay(d.id)}>{d.name}</button>))}</div>
                <table className="chart-table"><tbody>{(DEFAULT_SCHEDULE[selectedDay] || []).map((s, i) => (<tr key={i}><td>{s}</td></tr>))}</tbody></table>
              </>) : (<><h1 className="page-heading">{activeTab}</h1><p>PlayRadio.lt — More Hits! Skiltis „{activeTab}“.</p></>)}
            </div>
          </main>
        </div>
      )}
      {showPlayerModal && (
        <div
          onClick={() => setShowPlayerModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#191512',
              color: '#ffffff',
              width: 310,
              padding: '24px 24px 28px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {/* Mažas uždarymo kryžiukas viršuje dešinėje */}
            <button
              onClick={() => setShowPlayerModal(false)}
              style={{
                position: 'absolute',
                top: 6,
                right: 8,
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.45)',
                fontSize: 15,
                cursor: 'pointer',
              }}
              title="Uždaryti (muzika gros toliau)"
            >
              ✕
            </button>

            {/* Kvadratinis albumo viršelis */}
            <div style={{ width: 262, height: 262, margin: '0 auto 18px', background: '#09090b', overflow: 'hidden' }}>
              <img
                src={coverUrl}
                alt={liveTrack}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Atlikėjas ir daina (identiškai kaip nuotraukoje) */}
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.2px', marginBottom: 4, lineHeight: 1.2 }}>
              {liveTrack.includes(' - ') ? liveTrack.split(' - ').at(0) : 'PlayRadio.lt'}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f3f4f6', marginBottom: 22 }}>
              {liveTrack.includes(' - ') ? liveTrack.split(' - ').slice(1).join(' - ') : 'More Hits!'}
            </div>

            {/* Apvalus minimalistinis „Stop“ / „Play“ mygtukas */}
            <button
              onClick={() => togglePlay(false)}
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'transparent',
                border: '1.5px solid rgba(255, 255, 255, 0.75)',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
        </div>
      )}
               <div className="bottom-radio-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="player-circle-btn" onClick={togglePlay}>{isPlaying ? '■' : '►'}</button>
          <div>
            <div style={{ fontSize: 11, color: isPlaying ? '#22c55e' : '#ef4444', fontWeight: 800 }}>
              {isPlaying ? '● GROJA TIESIOGIAI' : '○ ETERYJE'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{liveTrack}</div>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
          style={{ width: 90 }}
        />
      </div>


      <audio ref={audioRef} preload="none" />
    </>
  );
}

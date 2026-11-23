import React, { useState, useEffect, useRef } from 'react';
import { STYLES, DEFAULT_POSTS, DEFAULT_TOP40, DEFAULT_SCHEDULE, DEFAULT_SETTINGS } from './data.js';
import './App.css';

import { supabase } from './supabase.js';
import AdminPanel from './AdminPanel.jsx';

const DAYS = Array.of(
  { id: 1, name: 'Pirmadienis' }, { id: 2, name: 'Antradienis' },
  { id: 3, name: 'Trečiadienis' }, { id: 4, name: 'Ketvirtadienis' },
  { id: 5, name: 'Penktadienis' }, { id: 6, name: 'Šeštadienis' },
  { id: 0, name: 'Sekmadienis' }
);

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
  const sMobMenu = useState(false), mobileMenuOpen = sMobMenu.at(0), setMobileMenuOpen = sMobMenu.at(1);

  const sComName = useState(''), comName = sComName.at(0), setComName = sComName.at(1);
  const sComText = useState(''), comText = sComText.at(0), setComText = sComText.at(1);
  const sPages = useState({
    scheduleImg: '',
    scheduleText: '07:00 - Morning Hit Show\n11:00 - Dienos hitai\n16:00 - Drive Time\n20:00 - Vakaro TOP',
    laidos: 'MORNING HIT SHOW (Darbo dienomis 07:00 - 10:00)\nPLAY RADIO TOP 40 (Penktadieniais 18:00)\nWEEKEND CLUB MIX (Šeštadieniais 21:00)',
    playlist: 'PlayRadio.lt grojaraštis sudaromas iš karščiausių pasaulio ir Lietuvos pop, dance bei urban hitų 24/7.',
    airplay: '1. Sabrina Carpenter - Espresso\n2. Billie Eilish - Birds of a Feather\n3. Teddy Swims - Lose Control',
    metuTop: '1. Dua Lipa - Houdini\n2. Benson Boone - Beautiful Things\n3. Hozier - Too Sweet',
    apieMus: 'PlayRadio.lt — More Hits! Tai internetinė radijo stotis, transliuojanti tik pačius populiariausius pasaulio ir Lietuvos hitus 24/7.',
    kontaktai: 'El. paštas: info@playradio.lt\nReklama: reklama@playradio.lt\nMuzikos redakcija: music@playradio.lt',
  }), pages = sPages.at(0), setPages = sPages.at(1);


  const audioRef = useRef(null);
  useEffect(() => {
    const loadCloud = async () => {
      const { data } = await supabase.from('site_data').select('*');
      if (data && data.length > 0) {
        data.forEach((row) => {
          if (row.key === 'posts' && Array.isArray(row.value)) setPosts(row.value);
          if (row.key === 'top40' && Array.isArray(row.value)) setTop40(row.value);
          if (row.key === 'settings' && row.value) setSettings(row.value);
          if (row.key === 'pages' && row.value) setPages((prev) => ({ ...prev, ...row.value }));
        });
      }
    };
    loadCloud();
  }, new Array());

  useEffect(() => {
    if (settings.bgImage) {
      document.body.style.backgroundImage = `url("${settings.bgImage}")`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, Array.of(settings));

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
    const timer = setInterval(fetchSong, 5000);
    return () => clearInterval(timer);
  }, new Array());

  useEffect(() => {
    if (!selectedPost?.content) return;

    const timer = setTimeout(() => {
      if (selectedPost.content.includes('instagram-media')) {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        } else {
          const s = document.createElement('script');
          const igHost = 'www' + '.' + 'instagram' + '.' + 'com';
          s.src = `https://${igHost}/embed.js`;
          s.async = true;
          document.body.appendChild(s);
        }
      }

      if (selectedPost.content.includes('twitter-tweet')) {
        if (window.twttr?.widgets) {
          window.twttr.widgets.load();
        } else {
          const s = document.createElement('script');
          const twHost = 'platform' + '.' + 'twitter' + '.' + 'com';
          s.src = `https://${twHost}/widgets.js`;
          s.async = true;
          document.body.appendChild(s);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, Array.of(selectedPost?.id));

  useEffect(() => {
    if (!liveTrack || liveTrack.includes('PlayRadio.lt')) return;

    const clean = liveTrack
      .replace(/[–—]/g, '-')
      .replace(/\([^)]*\)/g, '')
      .replace(/\b(feat\.?|ft\.?|remix|edit|mix)\b.*/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const cbName = 'dzCb_' + Math.floor(Math.random() * 100000);
    window[cbName] = (res) => {
      const cover = res?.data?.at(0)?.album?.cover_big;
      if (cover) setCoverUrl(cover);
      delete window[cbName];
    };

    const script = document.createElement('script');
    const host = 'api' + '.' + 'deezer' + '.' + 'com';
    script.src = `https://${host}/search?q=${encodeURIComponent(clean)}&limit=1&output=jsonp&callback=${cbName}`;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, Array.of(liveTrack));
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
    if (isPlaying && openModal !== true) {
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
          if (openModal === true) setShowPlayerModal(true);
        }).catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        });
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comName.trim() || !comText.trim() || !selectedPost) return;
    const newComment = {
      id: Date.now(),
      author: comName.trim(),
      text: comText.trim(),
      date: new Date().toLocaleDateString('lt-LT'),
    };
    const updatedPosts = posts.map((p) => {
      if (p.id === selectedPost.id) {
        const updatedPost = { ...p, comments: Array.of(...(p.comments || new Array()), newComment) };
        setSelectedPost(updatedPost);
        return updatedPost;
      }
      return p;
    });
    setPosts(updatedPosts);
    saveCloud('posts', updatedPosts);
    setComName('');
    setComText('');
  };

  const menu = Array.of('NAUJIENOS', 'PROGRAMA', 'LAIDOS', 'PLAYLIST', 'TOP 40', 'AIRPLAY TOP 200', 'METŲ TOP 100', 'APIE MUS', 'KONTAKTAI');

  return (
    <>
      <style>{STYLES}</style>
      <audio ref={audioRef} preload="none" />
      <div className="wp-admin-bar">
        <div><strong>PlayRadio.lt</strong> — More Hits!</div>
        <button onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? '← Grįžti į svetainę' : '⚙ Valdymo skydelis'}</button>
      </div>

      {isAdmin ? (
        <AdminPanel
          posts={posts}
          setPosts={setPosts}
          top40={top40}
          setTop40={setTop40}
          settings={settings}
          setSettings={setSettings}
          pages={pages}
          setPages={setPages}
          saveCloud={saveCloud}
        />
      ) : (
        <div className="site-wrapper">
                    <aside className="left-sidebar">
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕ UŽDARYTI MENIU' : '☰ MENIU IR GROTUVAS'}
            </button>

            <ul className={`side-menu ${mobileMenuOpen ? 'open' : ''}`}>
              <li>
                <button
                  type="button"
                  className={`play-item ${isPlaying ? 'playing' : ''}`}
                  onClick={() => {
                    togglePlay(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {isPlaying ? '🔊 GROJA (ATIDARYTI INFO)' : '► PLAY / GROTI'}
                </button>
              </li>

              {menu.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    className={activeTab === m && !selectedPost ? 'active' : ''}
                    onClick={() => {
                      setActiveTab(m);
                      setSelectedPost(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {m}
                  </button>
                </li>
              ))}
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
                  <div>
                    <div style={{ fontSize: 18, lineHeight: 1 }}>👑</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 15 }}>TOP 100</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'left', lineHeight: 1.3 }}>
                    <div>24.12 — 12:00</div>
                    <div>26.12 — 14:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-box">
              {selectedPost ? (<div>
                <button onClick={() => setSelectedPost(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 4, cursor: 'pointer', marginBottom: 16 }}>← Grįžti</button>
                <h1 className="page-heading">{selectedPost.title}</h1>
                {selectedPost.photoUrl && <img src={selectedPost.photoUrl} alt="" style={{ maxWidth: '100%', borderRadius: 4, marginBottom: 16 }} />}
                {selectedPost.source && <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Šaltinis: {selectedPost.source}</div>}
                <div style={{ lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }} />

                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '2px solid #e5e7eb' }}>
                  <h3 style={{ marginBottom: 14, fontSize: 16 }}>Komentarai ({(selectedPost.comments || new Array()).length})</h3>
                  <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <input className="dash-input" placeholder="Jūsų vardas" value={comName} onChange={(e) => setComName(e.target.value)} required style={{ margin: 0 }} />
                    <textarea className="dash-textarea" rows="3" placeholder="Parašykite komentarą..." value={comText} onChange={(e) => setComText(e.target.value)} required style={{ margin: 0 }} />
                    <button type="submit" className="dash-btn-primary" style={{ alignSelf: 'flex-start' }}>Paskelbti komentarą</button>
                  </form>
                  {(selectedPost.comments || new Array()).map((c) => (
                    <div key={c.id} style={{ padding: '12px 14px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                        <strong style={{ color: '#0f172a' }}>{c.author}</strong>
                        <span>{c.date}</span>
                      </div>
                      <div style={{ fontSize: 14, color: '#1e293b' }}>{c.text}</div>
                    </div>
                  ))}
                </div>
              </div>) : activeTab === 'NAUJIENOS' ? (<>
                <h1 className="page-heading">Naujienos</h1>
                <div className="fox-grid">{posts.map((p) => (<article className="fox-card" key={p.id} onClick={() => setSelectedPost(p)}>
                  <div className="fox-card-img-wrap"><img src={p.photoUrl} alt="" className="fox-card-img" style={{ objectPosition: `${p.focusX || 50}% ${p.focusY || 25}%` }} /></div>
                  <div className="fox-card-body">
                    {p.source && <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>{p.source}</div>}
                    <h2 className="fox-card-title">{p.title}</h2>
                    <p className="fox-card-excerpt">{p.excerpt}</p>
                  </div>
                </article>))}</div>
              </>) : activeTab === 'TOP 40' ? (<>
                <h1 className="page-heading">TOP 40</h1>
                <table className="chart-table"><tbody>{top40.map((t, i) => (<tr key={i}><td style={{ color: '#ef4444', fontWeight: 700, width: 45 }}>{i + 1}</td><td><strong>{t.artist}</strong> — {t.title}</td></tr>))}</tbody></table>
              </>) : activeTab === 'PROGRAMA' ? (<>
                <h1 className="page-heading">Programa</h1>
                {pages.scheduleImg && <img src={pages.scheduleImg} alt="Programa" style={{ maxWidth: '100%', borderRadius: 4, marginBottom: 16, display: 'block' }} />}
                <div className="day-tabs">{DAYS.map((d) => (<button key={d.id} className={`day-tab ${selectedDay === d.id ? 'active' : ''}`} onClick={() => setSelectedDay(d.id)}>{d.name}</button>))}</div>
                <table className="chart-table"><tbody>{(DEFAULT_SCHEDULE[selectedDay] || new Array()).map((s, i) => (<tr key={i}><td>{s}</td></tr>))}</tbody></table>
                {pages.scheduleText && <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginTop: 16, lineHeight: 1.7 }}>{pages.scheduleText}</pre>}
              </>) : (<>
                <h1 className="page-heading">{activeTab}</h1>
                {activeTab === 'PLAYLIST' && <p style={{ marginBottom: 12, color: '#dc2626', fontWeight: 700 }}>Šiuo metu groja: {liveTrack}</p>}
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
                  {activeTab === 'LAIDOS' && pages.laidos}
                  {activeTab === 'PLAYLIST' && pages.playlist}
                  {activeTab === 'AIRPLAY TOP 200' && pages.airplay}
                  {activeTab === 'METŲ TOP 100' && pages.metuTop}
                  {activeTab === 'APIE MUS' && pages.apieMus}
                  {activeTab === 'KONTAKTAI' && pages.kontaktai}
                </pre>
              </>)}
            </div>
          </main>
        </div>
      )}

      {showPlayerModal && (
        <div onClick={() => setShowPlayerModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#191512', color: '#fff', width: 310, padding: '24px 24px 28px', textAlign: 'center', position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
            <button onClick={() => setShowPlayerModal(false)} style={{ position: 'absolute', top: 6, right: 8, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 16, cursor: 'pointer' }}>✕</button>
            <div style={{ width: 262, height: 262, margin: '0 auto 18px', background: '#09090b', overflow: 'hidden' }}>
              <img src={coverUrl} alt={liveTrack} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
              {liveTrack.includes(' - ') ? liveTrack.split(' - ').at(0) : 'PlayRadio.lt'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', marginBottom: 22 }}>
              {liveTrack.includes(' - ') ? liveTrack.split(' - ').slice(1).join(' - ') : 'More Hits!'}
            </div>
            <button onClick={() => togglePlay(false)} style={{ width: 46, height: 46, borderRadius: '50%', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.8)', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
        </div>
      )}

      <div className="sticky-player" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 58, background: '#09090b', color: '#fff', borderTop: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 9000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => togglePlay(false)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
            {isPlaying ? '■' : '►'}
          </button>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: isPlaying ? '#22c55e' : '#ef4444' }}>
              {isPlaying ? '● GROJA TIESIOGIAI' : '○ ETERYJE'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{liveTrack}</div>
          </div>
        </div>
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => { const v = Number(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v; }} style={{ width: 90 }} />
      </div>
    </>
  );
}

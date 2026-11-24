import React, { useState } from 'react';
import { DEFAULT_POSTS } from './data.js';

export default function AdminPanel({
  posts, setPosts,
  top40, setTop40,
  settings, setSettings,
  pages, setPages,
  saveCloud,
}) {
  const secSt = useState('posts'), section = secSt.at(0), setSection = secSt.at(1);
  const editSt = useState(null), editId = editSt.at(0), setEditId = editSt.at(1);
  const titleSt = useState(''), title = titleSt.at(0), setTitle = titleSt.at(1);
  const srcSt = useState(''), source = srcSt.at(0), setSource = srcSt.at(1);
  const contentSt = useState(''), content = contentSt.at(0), setContent = contentSt.at(1);
  const photoSt = useState(''), photoUrl = photoSt.at(0), setPhotoUrl = photoSt.at(1);
  const fxSt = useState(50), focusX = fxSt.at(0), setFocusX = fxSt.at(1);
  const fySt = useState(25), focusY = fySt.at(0), setFocusY = fySt.at(1);
  const artistSt = useState(''), artist = artistSt.at(0), setArtist = artistSt.at(1);
  const trackSt = useState(''), track = trackSt.at(0), setTrack = trackSt.at(1);

  const handleFileUpload = (e, callback) => {
    const file = e.target.files && e.target.files.at(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const savePost = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalPhoto = photoUrl.trim() || DEFAULT_POSTS.at(0)?.photoUrl || '';
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let updated;

    if (editId) {
      updated = posts.map((p) =>
        p.id === editId
          ? { ...p, title: title.toUpperCase(), source: source.trim(), excerpt: plainText.slice(0, 115) + '...', content, photoUrl: finalPhoto, focusX, focusY }
          : p
      );
      setEditId(null);
    } else {
      updated = Array.of(
        { id: Date.now(), title: title.toUpperCase(), source: source.trim(), excerpt: plainText.slice(0, 115) + '...', content, photoUrl: finalPhoto, focusX, focusY, comments: new Array() },
        ...posts
      );
    }

    setPosts(updated);
    saveCloud('posts', updated);
    setTitle(''); setSource(''); setContent(''); setPhotoUrl(''); setFocusX(50); setFocusY(25);
  };

  const deleteComment = (postId, commentId) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, comments: (p.comments || new Array()).filter((c) => c.id !== commentId) };
      }
      return p;
    });
    setPosts(updated);
    saveCloud('posts', updated);
  };
  return (
    <div className="dashboard-panel">
      <aside className="dash-sidebar">
        <button className={section === 'posts' ? 'active' : ''} onClick={() => setSection('posts')}>📝 Naujienos</button>
        <button className={section === 'charts' ? 'active' : ''} onClick={() => setSection('charts')}>🔥 TOP 40</button>
        <button className={section === 'pages' ? 'active' : ''} onClick={() => setSection('pages')}>📄 Puslapiai / Programa</button>
        <button className={section === 'settings' ? 'active' : ''} onClick={() => setSection('settings')}>📻 Fonas ir Logotipas</button>
      </aside>

      <main className="dash-main">
        {section === 'posts' && (
          <>
            <div className="dash-card">
              <h3 style={{ marginBottom: 12 }}>{editId ? 'Redaguoti naujieną' : 'Naujas straipsnis'}</h3>
              <form onSubmit={savePost}>
                <input className="dash-input" placeholder="Antraštė" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input className="dash-input" placeholder="Šaltinis (pvz. PlayRadio, 15min.lt, Instagram)" value={source} onChange={(e) => setSource(e.target.value)} />

                <label style={{ fontSize: 13, fontWeight: 600 }}>Įkelkite nuotrauką iš kompiuterio:</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPhotoUrl)} style={{ display: 'block', margin: '6px 0 12px' }} />
                <input className="dash-input" placeholder="Arba įklijuokite nuotraukos nuorodą (URL)" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />

                {photoUrl && (
                  <div style={{ marginBottom: 14, padding: 12, background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      Titulinio blokelio kadras (vilkite slankiklius, kad nenukirptų galvos):
                    </div>
                    <div style={{ width: 260, height: 175, overflow: 'hidden', marginBottom: 8, border: '2px solid #2271b1' }}>
                      <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focusX}% ${focusY}%` }} />
                    </div>
                    <label style={{ fontSize: 12 }}>Kairė / Dešinė ({focusX}%): </label>
                    <input type="range" min="0" max="100" value={focusX} onChange={(e) => setFocusX(Number(e.target.value))} style={{ marginRight: 16 }} />
                    <label style={{ fontSize: 12 }}>Viršus / Apačia ({focusY}%): </label>
                    <input type="range" min="0" max="100" value={focusY} onChange={(e) => setFocusY(Number(e.target.value))} />
                  </div>
                )}

                <textarea className="dash-textarea" rows="5" placeholder="Pilnas tekstas arba HTML kodas (Instagram / Twitter embed)" value={content} onChange={(e) => setContent(e.target.value)} required />
                <button type="submit" className="dash-btn-primary">{editId ? 'Išsaugoti pakeitimus' : 'Publikuoti straipsnį'}</button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setTitle(''); setSource(''); setContent(''); setPhotoUrl(''); }} style={{ marginLeft: 10, padding: '8px 14px' }}>
                    Atšaukti
                  </button>
                )}
              </form>
            </div>

                        {editId ? (
              <div className="dash-card">
                <h3 style={{ marginBottom: 12 }}>
                  Šio straipsnio komentarai ({(posts.find((x) => x.id === editId)?.comments || new Array()).length})
                </h3>
                {(posts.find((x) => x.id === editId)?.comments || new Array()).length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: 13 }}>Šiame straipsnyje komentarų dar nėra.</p>
                ) : (
                  (posts.find((x) => x.id === editId)?.comments || new Array()).map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginBottom: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                      <div>
                        <div style={{ fontSize: 13, marginBottom: 2 }}>
                          <strong>{c.author}</strong> <span style={{ color: '#64748b', fontSize: 12 }}>({c.date})</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#1e293b' }}>{c.text}</div>
                      </div>
                      <button type="button" className="dash-btn-danger" onClick={() => deleteComment(editId, c.id)}>
                        Ištrinti
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="dash-card">
                <h3 style={{ marginBottom: 10 }}>Publikuotos naujienos ({posts.length})</h3>
                {posts.map((p) => {
                  const comCount = (p.comments || new Array()).length;
                  return (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <strong>{p.title}</strong>
                        {comCount > 0 && (
                          <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                            💬 {comCount}
                          </span>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <button
                          type="button"
                          className="dash-btn-primary"
                          style={{ marginRight: 8, padding: '4px 10px', fontSize: 12 }}
                          onClick={() => {
                            setEditId(p.id);
                            setTitle(p.title);
                            setSource(p.source || '');
                            setContent(p.content);
                            setPhotoUrl(p.photoUrl);
                            setFocusX(p.focusX || 50);
                            setFocusY(p.focusY || 25);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Redaguoti
                        </button>
                        <button
                          type="button"
                          className="dash-btn-danger"
                          onClick={() => {
                            const u = posts.filter((x) => x.id !== p.id);
                            setPosts(u);
                            saveCloud('posts', u);
                          }}
                        >
                          Ištrinti
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </>
        )}
        {section === 'charts' && (
          <div className="dash-card">
            <h3 style={{ marginBottom: 12 }}>TOP 40 Sąrašas</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!artist || !track) return;
              const u = Array.of(...top40, { artist, title: track });
              setTop40(u); saveCloud('top40', u); setArtist(''); setTrack('');
            }} style={{ display: 'flex', gap: 10 }}>
              <input className="dash-input" placeholder="Atlikėjas" value={artist} onChange={(e) => setArtist(e.target.value)} />
              <input className="dash-input" placeholder="Daina" value={track} onChange={(e) => setTrack(e.target.value)} />
              <button type="submit" className="dash-btn-primary" style={{ height: 38, marginTop: 4 }}>Pridėti</button>
            </form>
            {top40.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span><strong>{i + 1}.</strong> {t.artist} – {t.title}</span>
                <button className="dash-btn-danger" onClick={() => { const u = top40.filter((_, idx) => idx !== i); setTop40(u); saveCloud('top40', u); }}>Pašalinti</button>
              </div>
            ))}
          </div>
        )}

        {section === 'pages' && (
          <div className="dash-card">
            <h3 style={{ marginBottom: 12 }}>Puslapių ir Programos redagavimas</h3>
            <label style={{ fontWeight: 600, fontSize: 13 }}>Programos paveikslėlis (.jpg) iš kompiuterio arba URL:</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setPages({ ...pages, scheduleImg: url }))} style={{ display: 'block', margin: '6px 0 8px' }} />
            <input className="dash-input" placeholder="Programos nuotraukos URL" value={pages.scheduleImg || ''} onChange={(e) => setPages({ ...pages, scheduleImg: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>Programos tekstas (papildomai):</label>
            <textarea className="dash-textarea" rows="3" value={pages.scheduleText || ''} onChange={(e) => setPages({ ...pages, scheduleText: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>Laidos:</label>
            <textarea className="dash-textarea" rows="3" value={pages.laidos || ''} onChange={(e) => setPages({ ...pages, laidos: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>Playlist aprašymas:</label>
            <textarea className="dash-textarea" rows="2" value={pages.playlist || ''} onChange={(e) => setPages({ ...pages, playlist: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>AIRPLAY TOP 200:</label>
            <textarea className="dash-textarea" rows="4" value={pages.airplay || ''} onChange={(e) => setPages({ ...pages, airplay: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>METŲ TOP 100:</label>
            <textarea className="dash-textarea" rows="4" value={pages.metuTop || ''} onChange={(e) => setPages({ ...pages, metuTop: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>Apie mus:</label>
            <textarea className="dash-textarea" rows="3" value={pages.apieMus || ''} onChange={(e) => setPages({ ...pages, apieMus: e.target.value })} />

            <label style={{ fontWeight: 600, fontSize: 13 }}>Kontaktai:</label>
            <textarea className="dash-textarea" rows="3" value={pages.kontaktai || ''} onChange={(e) => setPages({ ...pages, kontaktai: e.target.value })} />

            <button type="button" className="dash-btn-primary" onClick={() => { saveCloud('pages', pages); alert('Visi puslapiai išsaugoti!'); }}>
              Išsaugoti visus puslapius
            </button>
          </div>
        )}

        {section === 'settings' && (
          <div className="dash-card">
            <h3 style={{ marginBottom: 12 }}>Mėnesinis Fonas ir Logotipas</h3>
            <label style={{ fontWeight: 600 }}>Įkelti naują mėnesio fono nuotrauką (1 vietos atlikėjo/-s foto):</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const u = { ...settings, bgImage: url }; setSettings(u); saveCloud('settings', u); })} style={{ display: 'block', margin: '6px 0 14px' }} />

            <label style={{ fontWeight: 600 }}>Įkelti savo originalų logotipą (PNG/SVG):</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const u = { ...settings, logoUrl: url }; setSettings(u); saveCloud('settings', u); })} style={{ display: 'block', margin: '6px 0 14px' }} />
          </div>
        )}
      </main>
    </div>
  );
}

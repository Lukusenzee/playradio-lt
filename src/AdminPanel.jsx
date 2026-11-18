import React, { useState } from 'react';

export default function AdminPanel({ posts, setPosts, top40, setTop40, settings, setSettings }) {
  const secSt = useState('posts');
  const section = secSt.at(0);
  const setSection = secSt.at(1);

  const editSt = useState(null);
  const editId = editSt.at(0);
  const setEditId = editSt.at(1);

  const titleSt = useState('');
  const title = titleSt.at(0);
  const setTitle = titleSt.at(1);

  const contentSt = useState('');
  const content = contentSt.at(0);
  const setContent = contentSt.at(1);

  const photoSt = useState('');
  const photoUrl = photoSt.at(0);
  const setPhotoUrl = photoSt.at(1);

  const fxSt = useState(50);
  const focusX = fxSt.at(0);
  const setFocusX = fxSt.at(1);

  const fySt = useState(25);
  const focusY = fySt.at(0);
  const setFocusY = fySt.at(1);

  const artistSt = useState('');
  const artist = artistSt.at(0);
  const setArtist = artistSt.at(1);

  const trackSt = useState('');
  const track = trackSt.at(0);
  const setTrack = trackSt.at(1);

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
    const finalPhoto = photoUrl || 'https://picsum.photos';
    if (editId) {
      setPosts(posts.map((p) => (p.id === editId ? { ...p, title: title.toUpperCase(), excerpt: content.slice(0, 115) + '...', content, photoUrl: finalPhoto, focusX, focusY } : p)));
      setEditId(null);
    } else {
      setPosts([{
        id: Date.now(),
        title: title.toUpperCase(),
        excerpt: content.slice(0, 115) + '...',
        content,
        photoUrl: finalPhoto,
        focusX,
        focusY,
      }, ...posts]);
    }
    setTitle(''); setContent(''); setPhotoUrl(''); setFocusX(50); setFocusY(25);
  };

  return (
    <div className="dashboard-panel">
      <aside className="dash-sidebar">
        <button className={section === 'posts' ? 'active' : ''} onClick={() => setSection('posts')}>📝 Naujienos</button>
        <button className={section === 'charts' ? 'active' : ''} onClick={() => setSection('charts')}>🔥 TOP 40</button>
        <button className={section === 'settings' ? 'active' : ''} onClick={() => setSection('settings')}>📻 Fonas ir Logotipas</button>
      </aside>

      <main className="dash-main">
        {section === 'posts' && (
          <>
            <div className="dash-card">
              <h3 style={{ marginBottom: 12 }}>{editId ? 'Redaguoti naujieną' : 'Naujas straipsnis'}</h3>
              <form onSubmit={savePost}>
                <input className="dash-input" placeholder="Antraštė" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label style={{ fontSize: 13, fontWeight: 600 }}>Įkelkite nuotrauką iš kompiuterio:</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPhotoUrl)} style={{ display: 'block', margin: '6px 0 12px' }} />

                <input className="dash-input" placeholder="Arba įklijuokite nuotraukos nuorodą (URL)" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />

                {photoUrl && (
                  <div style={{ marginBottom: 14, padding: 12, background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      Titulinio blokelio kadras (vilkite slankiklius, kad nenukirptų galvos; viduje bus pilnas originalas):
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

                <textarea className="dash-textarea" rows="4" placeholder="Pilnas straipsnio tekstas" value={content} onChange={(e) => setContent(e.target.value)} required />
                <button type="submit" className="dash-btn-primary">{editId ? 'Išsaugoti pakeitimus' : 'Publikuoti straipsnį'}</button>
              </form>
            </div>

            <div className="dash-card">
              <h3 style={{ marginBottom: 10 }}>Publikuotos naujienos ({posts.length})</h3>
              {posts.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span><strong>{p.title}</strong></span>
                  <div>
                    <button className="dash-btn-primary" style={{ marginRight: 8, padding: '4px 10px', fontSize: 12 }} onClick={() => {
                      setEditId(p.id); setTitle(p.title); setContent(p.content); setPhotoUrl(p.photoUrl); setFocusX(p.focusX || 50); setFocusY(p.focusY || 25);
                    }}>Redaguoti</button>
                    <button className="dash-btn-danger" onClick={() => setPosts(posts.filter((x) => x.id !== p.id))}>Ištrinti</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'charts' && (
          <div className="dash-card">
            <h3 style={{ marginBottom: 12 }}>TOP 40 Sąrašas</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!artist || !track) return;
              setTop40([...top40, { artist, title: track }]);
              setArtist(''); setTrack('');
            }} style={{ display: 'flex', gap: 10 }}>
              <input className="dash-input" placeholder="Atlikėjas" value={artist} onChange={(e) => setArtist(e.target.value)} />
              <input className="dash-input" placeholder="Daina" value={track} onChange={(e) => setTrack(e.target.value)} />
              <button type="submit" className="dash-btn-primary" style={{ height: 38, marginTop: 4 }}>Pridėti</button>
            </form>
            {top40.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span><strong>{i + 1}.</strong> {t.artist} – {t.title}</span>
                <button className="dash-btn-danger" onClick={() => setTop40(top40.filter((_, idx) => idx !== i))}>Pašalinti</button>
              </div>
            ))}
          </div>
        )}

        {section === 'settings' && (
          <div className="dash-card">
            <h3 style={{ marginBottom: 12 }}>Mėnesinis Fonas ir Logotipas</h3>
            <label style={{ fontWeight: 600 }}>Įkelti naują mėnesio fono nuotrauką (1 vietos atlikėjo/-s foto):</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, bgImage: url }))} style={{ display: 'block', margin: '6px 0 14px' }} />

            <label style={{ fontWeight: 600 }}>Įkelti savo originalų logotipą (PNG/SVG):</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, logoUrl: url }))} style={{ display: 'block', margin: '6px 0 14px' }} />
          </div>
        )}
      </main>
    </div>
  );
}

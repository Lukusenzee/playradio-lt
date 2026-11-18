export const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Open Sans", Arial, sans-serif; color: #f3f4f6;
    background-color: #111; background-size: cover;
    background-position: center; background-attachment: fixed;
    min-height: 100vh; padding-bottom: 64px;
  }
  .wp-admin-bar {
    background: #1d2327; color: #f0f0f1; height: 38px; padding: 0 18px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; position: sticky; top: 0; z-index: 1000;
  }
  .wp-admin-bar button {
    background: #2271b1; color: #fff; border: none; padding: 5px 12px;
    border-radius: 3px; cursor: pointer; font-weight: 600;
  }
  .site-wrapper {
    max-width: 1200px; margin: 0 auto; padding: 20px 15px 40px;
    display: flex; align-items: flex-start; gap: 22px;
  }
  .left-sidebar { width: 195px; flex-shrink: 0; }
  .brand-logo {
    background: rgba(10, 10, 10, 0.88); color: #fff; padding: 14px 12px;
    font-size: 20px; font-weight: 800; margin-bottom: 8px; text-align: center;
    border-left: 4px solid #ef4444;
  }
  .side-menu { list-style: none; display: flex; flex-direction: column; gap: 4px; }
  .side-menu button, .side-menu a {
    display: block; width: 100%; text-align: left;
    background: rgba(15, 15, 15, 0.82); color: #fff; border: none;
    padding: 9px 12px; font-size: 13.5px; font-weight: 600;
    text-transform: uppercase; cursor: pointer; text-decoration: none;
  }
  .side-menu button:hover, .side-menu a:hover { background: rgba(60, 60, 60, 0.9); }
  .side-menu button.active { background: #ef4444; }
  .side-menu button.play-item { background: #16a34a; }
  .side-menu button.play-item.playing { background: #dc2626; }
  .main-content-column { flex: 1; min-width: 0; }
  .content-box {
    background: rgba(14, 14, 16, 0.88); padding: 24px;
    border-radius: 6px; min-height: 75vh;
  }
  .page-heading {
    font-size: 22px; font-weight: 700; text-transform: uppercase;
    border-left: 4px solid #ef4444; padding-left: 10px; margin-bottom: 20px;
  }
  /* Fox News stiliaus tinklelis */
  .fox-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }
  .fox-card {
    background: rgba(28, 28, 32, 0.95); border-radius: 5px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
    display: flex; flex-direction: column; transition: transform 0.15s;
  }
  .fox-card:hover { transform: translateY(-3px); border-color: #ef4444; }
  .fox-card-img-wrap { width: 100%; height: 175px; overflow: hidden; background: #000; }
  .fox-card-img { width: 100%; height: 100%; object-fit: cover; }
  .fox-card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; }
  .fox-card-title { font-size: 15.5px; font-weight: 700; line-height: 1.35; color: #fff; margin-bottom: 8px; }
  .fox-card-excerpt { font-size: 13px; color: #cbd5e1; line-height: 1.45; }
  /* Programos dienos */
  .day-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
  .day-tab {
    background: #27272a; color: #fff; border: none; padding: 7px 12px;
    border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600;
  }
  .day-tab.active { background: #ef4444; }
  .chart-table { width: 100%; border-collapse: collapse; }
  .chart-table td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 14px; }
  /* Lipnus apatinis grotuvas */
  .bottom-radio-bar {
    position: fixed; bottom: 0; left: 0; right: 0; height: 56px;
    background: #09090b; border-top: 2px solid #ef4444;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; z-index: 999;
  }
  .player-circle-btn {
    width: 36px; height: 36px; border-radius: 50%; background: #ef4444;
    color: #fff; border: none; font-size: 14px; cursor: pointer;
  }
  /* Valdymo skydelis */
  .dashboard-panel { background: #f0f0f1; color: #1d2327; min-height: calc(100vh - 94px); display: flex; }
  .dash-sidebar { width: 200px; background: #1d2327; color: #fff; padding: 15px 0; flex-shrink: 0; }
  .dash-sidebar button {
    display: block; width: 100%; text-align: left; background: none; border: none;
    color: #f0f0f1; padding: 11px 18px; font-size: 14px; cursor: pointer;
  }
  .dash-sidebar button.active { background: #2271b1; }
  .dash-main { flex: 1; padding: 24px; max-width: 920px; }
  .dash-card { background: #fff; border: 1px solid #c3c4c7; padding: 20px; margin-bottom: 20px; }
  .dash-input, .dash-textarea {
    width: 100%; padding: 8px 10px; border: 1px solid #8c8f94; border-radius: 3px;
    margin-top: 4px; margin-bottom: 12px; font-size: 14px;
  }
  .dash-btn-primary {
    background: #2271b1; color: #fff; border: none; padding: 8px 16px;
    border-radius: 3px; cursor: pointer; font-weight: 600;
  }
  .dash-btn-danger {
    background: #d63638; color: #fff; border: none; padding: 5px 10px;
    border-radius: 3px; cursor: pointer; font-size: 12px;
  }
  @media (max-width: 768px) {
    .site-wrapper, .dashboard-panel { flex-direction: column; }
    .left-sidebar, .dash-sidebar { width: 100%; }
  }
`;

const makeCover = (bg, label) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://w3.org" width="600" height="400"><rect width="600" height="400" fill="${bg}"/><text x="300" y="210" font-family="Arial" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${label}</text></svg>`
  )}`;

export const DEFAULT_POSTS = [
  {
    id: 1,
    title: 'ANNE HATHAWAY VĖL TAPO MAMA',
    excerpt: 'New York. Anne Hathaway šeimoje – džiugus papildymas: aktorė jau pristatė savo mažylį Niujorke!',
    content: 'New York. Anne Hathaway (44) šeimoje – džiugus papildymas: aktorė jau pristatė savo mažylį Niujorke! Antradienį pastebėta Holivudo žvaigždė vaikščiojo mieste.',
    photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    focusX: 50,
    focusY: 25,
  },
  {
    id: 2,
    title: 'SUSITUOKĖ MICHELLE JENNEKE IR ALEX BECK',
    excerpt: 'Currumbin. Australijos olimpinė bėgikė ir jos tautietis sprinteris praėjusį savaitgalį apsikeitė įžadais.',
    content: 'Currumbin. Michelle Jenneke (33) ir Alex Beck (34) susituokė! Pora apsikeitė įžadais po aštuonerių metų draugystės.',
    photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    focusX: 50,
    focusY: 25,
  },
  {
    id: 3,
    title: '„BLUE“: LEE RYAN ATŠAUKĖ PASIRODYMUS DĖL DUKTERS LIGOS',
    excerpt: 'Costa del Sol. Lee Ryan atšaukė kelis koncertus dabartinio Europos turo metu ir skubiai išskrido namo.',
    content: 'Costa del Sol. Didelis susirūpinimas dėl mažametės dukters: Lee Ryan (43) atšaukė kelis koncertus savo grupės „Blue“ turo metu.',
    photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8DwHwAFAAH/VscvDQAAAABJRU5ErkJggg==',
    focusX: 50,
    focusY: 25,
  },
];


export const DEFAULT_TOP40 = [
  { artist: 'Dove Cameron', title: 'Breaks Open' },
  { artist: 'Justin Timberlake', title: 'SexyBack' },
  { artist: 'Selena Gomez', title: 'Love On' },
];

export const DEFAULT_SCHEDULE = {
  1: ['07:00 Rytinis šou su PlayRadio', '12:00 Dienos hitai', '18:00 Vakaro TOP 40'],
  2: ['07:00 Rytinis šou', '13:00 Muzikos pulsas', '19:00 Dance Mix'],
  3: ['07:00 Trečiadienio startas', '12:00 Geriausi hitai', '20:00 Club Hits'],
  4: ['07:00 Rytas eteryje', '14:00 Naujienų apžvalga', '19:00 Eurodance'],
  5: ['07:00 Penktadienio energija', '16:00 Savaitgalio įšilimas', '21:00 Party Mix'],
  6: ['09:00 Savaitgalio rytas', '15:00 PlayRadio TOP 40', '21:00 DJ Set'],
  0: ['09:00 Sekmadienio muzika', '14:00 AIRPLAY TOP 200', '20:00 Chill & Hits'],
};

export const DEFAULT_SETTINGS = {
  logoUrl: 'https://www' + '.playradio.' + 'top/wp-content/themes/PlayRadio/img/logo.png',
  streamUrl: 'https://stream' + '.radiojar.' + 'com/d9cm273ystzuv',
  nowPlaying: 'PlayRadio.lt — More Hits!',
  bgImage: "data:image/svg+xml;utf8,<svg xmlns='http://www" + ".w3." + "org/2000/svg' width='1600' height='900'><defs><radialGradient id='bg' cx='35%' cy='45%' r='70%'><stop offset='0%' stop-color='%23d97706'/><stop offset='45%' stop-color='%2378350f'/><stop offset='100%' stop-color='%231c1917'/></radialGradient></defs><rect width='1600' height='900' fill='url(%23bg)'/></svg>",
};


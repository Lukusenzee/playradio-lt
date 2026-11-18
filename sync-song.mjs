const SUPABASE_URL = 'https://supabase.co';
const SUPABASE_KEY = 'sb_publishable_Fu8FQmlUsEYtwEeENKYKLQ_KB-1AEZw';

async function syncNowPlaying() {
  try {
    const res = await fetch(`https://playradio.lt{Date.now()}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await res.text();
    const plain = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const match = plain.match(/Artist:\s*(.*?)\s*Title:\s*(.*?)\s*(?:Album:|Year:|Previous|$)/i);
    if (match && match.at(1) && match.at(2)) {
      const track = `${match.at(1).trim()} - ${match.at(2).trim()}`;
      await fetch(`${SUPABASE_URL}/rest/v1/site_data?on_conflict=key`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: 'now_playing', value: { track } }),
      });
      console.log('✓ Atnaujinta gyva daina:', track);
    }
  } catch (e) {
    console.log('Klaida:', e.message);
  }
}

syncNowPlaying();
setInterval(syncNowPlaying, 15000);

export default async function handler(req, res) {
  try {
    const r = await fetch(`https://playradio.top{Date.now()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Referer': 'https://playradio.top',
      },
    });

    const html = await r.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const m = text.match(/Artist:\s*([^:]+?)\s*Title:\s*([^:]+?)\s*(?:Album:|Year:|Previous|$)/i);
    res.setHeader('Cache-Control', 'no-store');

    if (m && m.at(1) && m.at(2)) {
      return res.status(200).json({ track: `${m.at(1).trim()} - ${m.at(2).trim()}` });
    }

    res.status(200).json({ track: '', debug: text.slice(0, 250) });
  } catch (e) {
    res.status(200).json({ track: '', error: e.message });
  }
}

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  try {
    const r = await fetch(
      `https://playradio.lt{Date.now()}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'lt-LT,lt;q=0.9,en;q=0.8',
          'Referer': 'https://playradio.lt',
        },
      }
    );

    const html = await r.text();
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
      return new Response(
        JSON.stringify({ track: `${match.at(1).trim()} - ${match.at(2).trim()}` }),
        { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
      );
    }

    return new Response(JSON.stringify({ track: '' }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ track: '' }), { headers: { 'Content-Type': 'application/json' } });
  }
}

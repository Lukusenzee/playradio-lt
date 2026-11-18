export default async function handler(req, res) {
  try {
    const r = await fetch('https://playradio.lt' + Date.now(), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await r.text();

    // Ištraukiame pirmąjį Artist ir Title (Currently Playing)
    const artistMatch = html.match(/Artist:\s*<\/[^>]+>\s*([^<]+)/i) || html.match(/Artist:\s*([^\n<]+)/i);
    const titleMatch = html.match(/Title:\s*<\/[^>]+>\s*([^<]+)/i) || html.match(/Title:\s*([^\n<]+)/i);

    const artist = artistMatch ? artistMatch.at(1).replace(/\*/g, '').trim() : '';
    const title = titleMatch ? titleMatch.at(1).replace(/\*/g, '').trim() : '';

    res.setHeader('Cache-Control', 'no-store');
    if (artist && title) {
      return res.status(200).json({ artist, title, full: `${artist} - ${title}` });
    }
    res.status(200).json({ title: 'PlayRadio.lt — More Hits!' });
  } catch (e) {
    res.status(200).json({ title: 'PlayRadio.lt — More Hits!' });
  }
}
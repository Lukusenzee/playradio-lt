export default async function handler(req, res) {
  try {
    const r = await fetch('https://playradio.lt' + Date.now(), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await r.text();

    // Paverčiame visą HTML į švarų tekstą be jokių žymių
    const plain = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Paimame pirmąjį Artist ir pirmąjį Title iš švaraus teksto
    const match = plain.match(/Artist:\s*(.*?)\s*Title:\s*(.*?)\s*(?:Album:|Year:|Previous|$)/i);

    res.setHeader('Cache-Control', 'no-store');
    if (match && match.at(1) && match.at(2)) {
      const artist = match.at(1).trim();
      const title = match.at(2).trim();
      return res.status(200).json({ artist, title });
    }

    res.status(200).json({ title: 'PlayRadio.lt — More Hits!', debug: plain.slice(0, 200) });
  } catch (e) {
    res.status(200).json({ title: 'PlayRadio.lt — More Hits!', error: e.message });
  }
}

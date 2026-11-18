export default async function handler(req, res) {
  try {
    // 1. Pirmiausia bandome Radiojar JSON API
    const apiRes = await fetch('https://radiojar.com');
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json.title || json.artist) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(json);
      }
    }

    // 2. Jei API išjungtas, ištraukiame dainą tiesiogiai iš ICY garso srauto
    const streamRes = await fetch('https://radiojar.com', {
      headers: { 'Icy-MetaData': '1', 'User-Agent': 'Mozilla/5.0' },
    });

    const metaint = Number(streamRes.headers.get('icy-metaint'));
    if (metaint && streamRes.body) {
      const reader = streamRes.body.getReader();
      let received = 0;
      const chunks = [];

      while (received < metaint + 512) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
      }
      reader.cancel();

      const full = Buffer.concat(chunks);
      const metaLen = full[metaint] * 16;
      if (metaLen > 0) {
        const metaStr = full.subarray(metaint + 1, metaint + 1 + metaLen).toString('utf8');
        const match = metaStr.match(/StreamTitle='([^']*)'/);
        if (match && match[1]) {
          res.setHeader('Cache-Control', 'no-store');
          return res.status(200).json({ title: match[1] });
        }
      }
    }

    res.status(200).json({ title: 'PlayRadio.lt — More Hits!' });
  } catch (e) {
    res.status(200).json({ title: 'PlayRadio.lt — More Hits!' });
  }
}

export default async function handler(req, res) {
  try {
    // 1. Sužinome tikslų aktyvų Radiojar transliacijos serverį (po 302 peradresavimo)
    const headRes = await fetch('https://radiojar.com', {
      method: 'GET',
      headers: { 'Icy-MetaData': '1', 'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18' },
      redirect: 'follow',
    });

    const metaint = Number(headRes.headers.get('icy-metaint'));
    if (!metaint || !headRes.body) {
      return res.status(200).json({ track: '' });
    }

    // 2. Skaitome garso srautą iki pirmojo metaduomenų bloko (metaint + 4096 baitų)
    const reader = headRes.body.getReader();
    const chunks = [];
    let totalBytes = 0;

    while (totalBytes < metaint + 4096) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalBytes += value.length;
    }
    await reader.cancel();

    // 3. Iškerpame StreamTitle='Atlikėjas - Daina'
    const buffer = Buffer.concat(chunks);
    const metaLength = buffer[metaint] * 16;
    if (metaLength > 0 && buffer.length >= metaint + 1 + metaLength) {
      const metaText = buffer.subarray(metaint + 1, metaint + 1 + metaLength).toString('utf8');
      const match = metaText.match(/StreamTitle='([^']*)'/);
      if (match && match.at(1)) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ track: match.at(1).trim() });
      }
    }

    res.status(200).json({ track: '' });
  } catch (e) {
    res.status(200).json({ track: '' });
  }
}

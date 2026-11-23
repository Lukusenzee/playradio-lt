export default async function handler(req, res) {
  const { q } = req.query;
  const fallback = 'https://unsplash.com';
  if (!q) return res.status(200).json({ cover: fallback });

  const clean = q
    .replace(/[–—]/g, '-')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\b(feat\.?|ft\.?|remix|edit|mix)\b.*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  try {
    const dzRes = await fetch(`https://deezer.com{encodeURIComponent(clean)}&limit=1`);
    const dzData = await dzRes.json();
    if (dzData.data?.[0]?.album?.cover_big) {
      return res.status(200).json({ cover: dzData.data[0].album.cover_big });
    }
  } catch (e) {}

  try {
    const itRes = await fetch(`https://apple.com{encodeURIComponent(clean)}&entity=song&limit=1`);
    const itData = await itRes.json();
    if (itData.results?.[0]?.artworkUrl100) {
      return res.status(200).json({ cover: itData.results[0].artworkUrl100.replace('100x100', '600x600') });
    }
  } catch (e) {}

  res.status(200).json({ cover: fallback });
}
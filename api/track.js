export default async function handler(req, res) {
  const { set } = req.query;
  const project = 'hsaunddskvvlvoyqwtim';
  const domain = 'supabase' + '.' + 'co';
  const url = `https://${project}.${domain}/rest/v1/site_data?on_conflict=key`;
  const key = 'sb_publishable_Fu8FQmlUsEYtwEeENKYKLQ_KB-1AEZw';

  if (set) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: 'now_playing', value: { track: set } }),
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(pixel);
}

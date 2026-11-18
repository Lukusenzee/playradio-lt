export default async function handler(req, res) {
  const track = req.query.set;
  const base = 'https://hsaunddskvvlvoyqwtim.supabase.co';
  const sbKey = 'sb_publishable_Fu8FQmlUsEYtwEeENKYKLQ_KB-1AEZw';

  if (track) {
    await fetch(base + '/rest/v1/site_data?on_conflict=key', {
      method: 'POST',
      headers: {
        apikey: sbKey,
        Authorization: 'Bearer ' + sbKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ key: 'now_playing', value: { track } }),
    });
  }

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.status(200).send(pixel);
}

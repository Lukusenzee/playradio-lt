export default async function handler(req, res) {
  const track = req.query.set;
  if (track) {
    await fetch('https://supabase.co', {
      method: 'POST',
      headers: {
        apikey: 'sb_publishable_Fu8FQmlUsEYtwEeENKYKLQ_KB-1AEZw',
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

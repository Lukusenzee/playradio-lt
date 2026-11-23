export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://playradio.lt',
      { cache: 'no-store' }
    );
    const html = await response.text();

    const text = html.replace(/<[^>]*>/g, '\n');
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const tracks = [];
    let currentTrack = {};

    for (const line of lines) {
      if (line.startsWith('Artist:')) {
        if (currentTrack.artist) tracks.push(currentTrack);
        currentTrack = { artist: line.replace('Artist:', '').trim() };
      } else if (line.startsWith('Title:')) {
        currentTrack.title = line.replace('Title:', '').trim();
      } else if (line.startsWith('Album:')) {
        currentTrack.album = line.replace('Album:', '').trim();
      } else if (line.startsWith('Year:')) {
        currentTrack.year = line.replace('Year:', '').trim();
      }
    }
    if (currentTrack.artist) tracks.push(currentTrack);

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.status(200).json({
      nowPlaying: tracks || null,
      previousTracks: tracks.slice(1),
    });
  } catch (error) {
    res.status(500).json({ error: 'Nepavyko gauti grojamos dainos duomenų' });
  }
}

export const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/0FoBQqwEzAoBWlDzcswX1A";

export function extractSpotifyPlaylistId(value) {
  const text = String(value || "").trim();
  const fromUrl = text.match(/playlist\/([A-Za-z0-9]+)/)?.[1];
  if (fromUrl) return fromUrl;
  return /^[A-Za-z0-9]{16,}$/.test(text) ? text : "";
}

export function spotifyTrackToSong(item) {
  const track = item?.track || item;
  const artists = Array.isArray(track?.artists) ? track.artists.map((artist) => artist.name).join(", ") : "";

  return {
    title: track?.name || "",
    artist: artists,
    album: track?.album?.name || "",
    durationMs: Number(track?.duration_ms || 0),
    spotifyUrl: track?.external_urls?.spotify || ""
  };
}

export function formatDuration(durationMs) {
  if (!durationMs) return "";
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

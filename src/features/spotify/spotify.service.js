import { extractSpotifyPlaylistId, spotifyTrackToSong } from "./spotify.model.js";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";
const STORAGE_KEY = "spotilator.spotify.v1";

export function createSpotifyService(storage = globalThis.localStorage, fetcher = globalThis.fetch) {
  function getConfig() {
    try {
      return JSON.parse(storage?.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveConfig(config) {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ ...getConfig(), ...config }));
  }

  async function startLogin({ clientId, playlistUrl, redirectUri = currentRedirectUri() }) {
    const playlistId = extractSpotifyPlaylistId(playlistUrl);
    if (!clientId || !playlistId) {
      throw new Error("Informe Client ID e URL/ID da playlist.");
    }

    const codeVerifier = randomString(64);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    const state = randomString(24);
    saveConfig({ clientId, playlistUrl, playlistId, redirectUri, codeVerifier, state });

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: "playlist-read-private playlist-read-collaborative",
      redirect_uri: redirectUri,
      state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge
    });

    globalThis.location.assign(`${AUTH_URL}?${params}`);
  }

  async function completeLoginFromUrl(url = globalThis.location.href) {
    const config = getConfig();
    const params = new URL(url).searchParams;
    const code = params.get("code");
    const state = params.get("state");
    if (!code) return null;
    if (state !== config.state) throw new Error("Estado OAuth invalido.");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: config.codeVerifier
    });

    const response = await fetcher(TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) throw new Error("Falha ao trocar codigo Spotify por token.");

    const token = await response.json();
    saveConfig({
      accessToken: token.access_token,
      refreshToken: token.refresh_token || config.refreshToken || "",
      expiresAt: Date.now() + Number(token.expires_in || 3600) * 1000
    });
    clearOAuthQuery();
    return token;
  }

  async function importPlaylistTracks(playlistUrl) {
    const config = getConfig();
    const playlistId = extractSpotifyPlaylistId(playlistUrl || config.playlistUrl);
    if (!config.accessToken) throw new Error("Conecte ao Spotify antes de importar.");
    if (!playlistId) throw new Error("URL/ID de playlist invalido.");

    const tracks = [];
    let nextUrl = `${API_URL}/playlists/${playlistId}/tracks?limit=100&fields=items(track(name,artists(name),album(name),external_urls,duration_ms)),next,total`;

    while (nextUrl) {
      const response = await fetcher(nextUrl, {
        headers: { authorization: `Bearer ${config.accessToken}` }
      });
      if (!response.ok) throw new Error("Falha ao buscar playlist no Spotify.");
      const page = await response.json();
      tracks.push(...(page.items || []).map(spotifyTrackToSong).filter((song) => song.title && song.artist));
      nextUrl = page.next;
    }

    saveConfig({ playlistUrl: playlistUrl || config.playlistUrl, playlistId });
    return tracks;
  }

  return { getConfig, saveConfig, startLogin, completeLoginFromUrl, importPlaylistTracks };
}

function currentRedirectUri() {
  return `${globalThis.location.origin}${globalThis.location.pathname}`;
}

function clearOAuthQuery() {
  const cleanUrl = `${globalThis.location.origin}${globalThis.location.pathname}`;
  globalThis.history.replaceState({}, "", cleanUrl);
}

function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(length);
  globalThis.crypto.getRandomValues(values);
  return Array.from(values, (value) => chars[value % chars.length]).join("");
}

async function sha256Base64Url(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

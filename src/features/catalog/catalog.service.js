import { createSong, EMPTY_CATALOG, parseBulkSongs } from "./catalog.model.js";

const STORAGE_KEY = "spotilator.catalog.v1";

export function createCatalogService(store, storage = globalThis.localStorage) {
  function load() {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      store.setState({
        playlistUrl: String(parsed.playlistUrl || ""),
        songs: Array.isArray(parsed.songs) ? parsed.songs.map(createSong) : []
      });
    } catch {
      store.setState(EMPTY_CATALOG);
    }
  }

  function persist() {
    storage?.setItem(STORAGE_KEY, JSON.stringify(store.getState(), null, 2));
  }

  function setPlaylistUrl(playlistUrl) {
    store.setState((state) => ({ ...state, playlistUrl: String(playlistUrl || "").trim() }));
    persist();
  }

  function addSong(input) {
    const song = createSong(input);
    if (!song.title || !song.artist) return null;
    store.setState((state) => ({ ...state, songs: [song, ...state.songs] }));
    persist();
    return song;
  }

  function addBulk(text) {
    const songs = parseBulkSongs(text);
    store.setState((state) => ({ ...state, songs: [...songs, ...state.songs] }));
    persist();
    return songs.length;
  }

  function updateSong(id, patch) {
    store.setState((state) => ({
      ...state,
      songs: state.songs.map((song) => (song.id === id ? createSong({ ...song, ...patch, id }) : song))
    }));
    persist();
  }

  function removeSong(id) {
    store.setState((state) => ({
      ...state,
      songs: state.songs.filter((song) => song.id !== id)
    }));
    persist();
  }

  function exportJson() {
    return JSON.stringify(store.getState(), null, 2);
  }

  function importJson(raw) {
    const parsed = JSON.parse(raw);
    store.setState({
      playlistUrl: String(parsed.playlistUrl || ""),
      songs: Array.isArray(parsed.songs) ? parsed.songs.map(createSong) : []
    });
    persist();
  }

  return { load, persist, setPlaylistUrl, addSong, addBulk, updateSong, removeSong, exportJson, importJson };
}

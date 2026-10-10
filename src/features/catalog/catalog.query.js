import { statusLabel } from "./catalog.model.js";

export function createCatalogQuery(store) {
  function selectFiltered(filters = {}) {
    const state = store.getState();
    const search = normalize(filters.search);

    return state.songs.filter((song) => {
      const text = normalize(`${song.title} ${song.artist}`);
      const matchesSearch = !search || text.includes(search);
      const matchesLanguage = !filters.language || song.language === filters.language;
      const matchesMood = !filters.mood || song.mood === filters.mood;
      const matchesStatus = !filters.status || song.status === filters.status;
      return matchesSearch && matchesLanguage && matchesMood && matchesStatus;
    });
  }

  function selectSummary() {
    const { songs } = store.getState();
    return {
      total: songs.length,
      ready: songs.filter((song) => song.status === "ready").length,
      needsReview: songs.filter((song) => song.status !== "ready").length
    };
  }

  function selectPlaylistMeta() {
    const { playlistUrl } = store.getState();
    return {
      playlistUrl,
      playlistId: extractSpotifyPlaylistId(playlistUrl)
    };
  }

  return { selectFiltered, selectSummary, selectPlaylistMeta, statusLabel };
}

export function extractSpotifyPlaylistId(url) {
  const match = String(url || "").match(/playlist\/([A-Za-z0-9]+)/);
  return match?.[1] || "";
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

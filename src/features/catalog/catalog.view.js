import { LANGUAGES, MOODS, STATUSES, statusLabel } from "./catalog.model.js";
import { buildTranslationCandidates } from "../sources/translation-sources.model.js";
import { SPOTIFY_PLAYLIST_URL, formatDuration } from "../spotify/spotify.model.js";

export function mountCatalogView({ store, query, service, spotifyService, root = document }) {
  const filters = {
    search: "",
    language: "",
    mood: "",
    status: ""
  };

  const elements = {
    form: root.querySelector("#songForm"),
    list: root.querySelector("#songList"),
    template: root.querySelector("#songCardTemplate"),
    playlistUrl: root.querySelector("#playlistUrl"),
    savePlaylistButton: root.querySelector("#savePlaylistButton"),
    spotifyClientId: root.querySelector("#spotifyClientId"),
    spotifyRedirectUri: root.querySelector("#spotifyRedirectUri"),
    spotifyLoginButton: root.querySelector("#spotifyLoginButton"),
    spotifyCompleteButton: root.querySelector("#spotifyCompleteButton"),
    spotifyImportButton: root.querySelector("#spotifyImportButton"),
    spotifyStatus: root.querySelector("#spotifyStatus"),
    bulkInput: root.querySelector("#bulkInput"),
    bulkAddButton: root.querySelector("#bulkAddButton"),
    exportButton: root.querySelector("#exportButton"),
    importFile: root.querySelector("#importFile"),
    searchInput: root.querySelector("#searchInput"),
    languageFilter: root.querySelector("#languageFilter"),
    moodFilter: root.querySelector("#moodFilter"),
    statusFilter: root.querySelector("#statusFilter"),
    totalCount: root.querySelector("#totalCount"),
    readyCount: root.querySelector("#readyCount"),
    needsReviewCount: root.querySelector("#needsReviewCount")
  };

  fillSelect(elements.form.elements.language, LANGUAGES);
  fillSelect(elements.form.elements.mood, MOODS);
  fillSelect(elements.languageFilter, ["", ...LANGUAGES], "Todos idiomas");
  fillSelect(elements.moodFilter, ["", ...MOODS], "Todos climas");
  fillStatusSelect(elements.statusFilter, true);
  elements.spotifyRedirectUri.value = `${location.origin}${location.pathname}`;
  elements.playlistUrl.value = query.selectPlaylistMeta().playlistUrl || SPOTIFY_PLAYLIST_URL;
  hydrateSpotifyConfig();

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.form));
    service.addSong(data);
    elements.form.reset();
  });

  elements.savePlaylistButton.addEventListener("click", () => {
    service.setPlaylistUrl(elements.playlistUrl.value);
    spotifyService.saveConfig({ playlistUrl: elements.playlistUrl.value });
  });

  elements.spotifyLoginButton.addEventListener("click", async () => {
    try {
      setSpotifyStatus("Redirecionando para o Spotify...");
      await spotifyService.startLogin({
        clientId: elements.spotifyClientId.value.trim(),
        playlistUrl: elements.playlistUrl.value.trim()
      });
    } catch (error) {
      setSpotifyStatus(error.message);
    }
  });

  elements.spotifyCompleteButton.addEventListener("click", async () => {
    try {
      const token = await spotifyService.completeLoginFromUrl();
      setSpotifyStatus(token ? "Login Spotify concluido." : "Nenhum login pendente na URL.");
    } catch (error) {
      setSpotifyStatus(error.message);
    }
  });

  elements.spotifyImportButton.addEventListener("click", async () => {
    try {
      setSpotifyStatus("Importando faixas...");
      const songs = await spotifyService.importPlaylistTracks(elements.playlistUrl.value.trim());
      const count = service.addSongs(songs);
      setSpotifyStatus(`${count} musica(s) importada(s). Duplicadas foram ignoradas.`);
    } catch (error) {
      setSpotifyStatus(error.message);
    }
  });

  elements.bulkAddButton.addEventListener("click", () => {
    service.addBulk(elements.bulkInput.value);
    elements.bulkInput.value = "";
  });

  elements.exportButton.addEventListener("click", () => {
    download("spotilator-catalog.json", service.exportJson());
  });

  elements.importFile.addEventListener("change", async () => {
    const [file] = elements.importFile.files;
    if (!file) return;
    service.importJson(await file.text());
    elements.importFile.value = "";
  });

  bindFilter(elements.searchInput, "search", filters, render);
  bindFilter(elements.languageFilter, "language", filters, render);
  bindFilter(elements.moodFilter, "mood", filters, render);
  bindFilter(elements.statusFilter, "status", filters, render);

  store.subscribe(render);

  function render() {
    const summary = query.selectSummary();
    const playlist = query.selectPlaylistMeta();
    elements.totalCount.textContent = summary.total;
    elements.readyCount.textContent = summary.ready;
    elements.needsReviewCount.textContent = summary.needsReview;
    elements.playlistUrl.value = playlist.playlistUrl;

    const songs = query.selectFiltered(filters);
    elements.list.replaceChildren();

    if (!songs.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Nenhuma musica encontrada.";
      elements.list.append(empty);
      return;
    }

    songs.forEach((song) => elements.list.append(renderSong(song)));
  }

  function renderSong(song) {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    node.querySelector("h2").textContent = song.title;
    node.querySelector(".artist").textContent = song.artist;
    node.querySelector(".meta-row").replaceChildren(
      pill(song.language, "language"),
      pill(song.mood, "mood"),
      pill(statusLabel(song.status), "status")
    );

    const statusSelect = node.querySelector(".status-select");
    fillStatusSelect(statusSelect, false);
    statusSelect.value = song.status;
    statusSelect.addEventListener("change", () => service.updateSong(song.id, { status: statusSelect.value }));

    bindEditable(node.querySelector(".lyrics-url"), song.lyricsUrl, (value) =>
      service.updateSong(song.id, { lyricsUrl: value })
    );
    bindEditable(node.querySelector(".translation-url"), song.translationUrl, (value) =>
      service.updateSong(song.id, { translationUrl: value })
    );
    bindEditable(node.querySelector(".reason"), song.romanticReason, (value) =>
      service.updateSong(song.id, { romanticReason: value })
    );

    setLink(node.querySelector(".spotify-link"), song.spotifyUrl);
    node.querySelector(".spotify-link").textContent = spotifyLabel(song);
    renderCandidates(node.querySelector(".candidate-row"), song, (url) => service.updateSong(song.id, { translationUrl: url }));
    setLink(node.querySelector(".lyrics-link"), song.lyricsUrl);
    setLink(node.querySelector(".translation-link"), song.translationUrl);
    node.querySelector(".remove-button").addEventListener("click", () => service.removeSong(song.id));
    return node;
  }

  function hydrateSpotifyConfig() {
    const config = spotifyService.getConfig();
    elements.spotifyClientId.value = config.clientId || "";
    if (!query.selectPlaylistMeta().playlistUrl) {
      service.setPlaylistUrl(config.playlistUrl || SPOTIFY_PLAYLIST_URL);
    }
  }

  function setSpotifyStatus(message) {
    elements.spotifyStatus.textContent = message;
  }
}

function fillSelect(select, options, emptyLabel = "") {
  select.replaceChildren();
  options.forEach((option) => {
    const node = document.createElement("option");
    node.value = option;
    node.textContent = option || emptyLabel;
    select.append(node);
  });
}

function fillStatusSelect(select, includeEmpty) {
  select.replaceChildren();
  if (includeEmpty) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Todos status";
    select.append(empty);
  }
  STATUSES.forEach((status) => {
    const node = document.createElement("option");
    node.value = status.value;
    node.textContent = status.label;
    select.append(node);
  });
}

function bindFilter(input, key, filters, render) {
  input.addEventListener("input", () => {
    filters[key] = input.value;
    render();
  });
}

function bindEditable(input, value, onChange) {
  input.value = value;
  input.addEventListener("change", () => onChange(input.value));
}

function setLink(anchor, url) {
  if (!url) {
    anchor.setAttribute("aria-disabled", "true");
    anchor.removeAttribute("href");
    return;
  }
  anchor.href = url;
}

function renderCandidates(container, song, onUseBest) {
  container.replaceChildren();
  const candidates = buildTranslationCandidates(song).slice(0, 4);
  const useBest = document.createElement("button");
  useBest.type = "button";
  useBest.textContent = "Usar melhor busca";
  useBest.addEventListener("click", () => onUseBest(candidates[0].url));
  container.append(useBest);

  candidates.forEach((candidate) => {
    const anchor = document.createElement("a");
    anchor.href = candidate.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = `Buscar ${candidate.providerName}`;
    anchor.title = `Pontuacao ${candidate.score}`;
    container.append(anchor);
  });
}

function spotifyLabel(song) {
  const parts = [song.album, formatDuration(song.durationMs)].filter(Boolean);
  return parts.length ? `Spotify: ${parts.join(" · ")}` : "Abrir no Spotify";
}

function pill(text, type) {
  const node = document.createElement("span");
  node.className = `pill ${type}`;
  node.textContent = text;
  return node;
}

function download(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

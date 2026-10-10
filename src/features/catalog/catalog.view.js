import { LANGUAGES, MOODS, STATUSES, statusLabel } from "./catalog.model.js";

export function mountCatalogView({ store, query, service, root = document }) {
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

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.form));
    service.addSong(data);
    elements.form.reset();
  });

  elements.savePlaylistButton.addEventListener("click", () => {
    service.setPlaylistUrl(elements.playlistUrl.value);
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

    setLink(node.querySelector(".lyrics-link"), song.lyricsUrl);
    setLink(node.querySelector(".translation-link"), song.translationUrl);
    node.querySelector(".remove-button").addEventListener("click", () => service.removeSong(song.id));
    return node;
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

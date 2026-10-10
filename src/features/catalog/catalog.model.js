export const LANGUAGES = [
  "Portugues",
  "Ingles",
  "Espanhol",
  "Frances",
  "Italiano",
  "Coreano",
  "Japones",
  "Outro"
];

export const MOODS = [
  "Doce",
  "Saudade",
  "Declaracao",
  "Danca lenta",
  "Melancolica",
  "Esperancosa",
  "Intensa"
];

export const STATUSES = [
  { value: "to_review", label: "A revisar" },
  { value: "lyrics_ok", label: "Letra ok" },
  { value: "translation_ok", label: "Traducao ok" },
  { value: "reason_ok", label: "Motivo ok" },
  { value: "ready", label: "Pronta" }
];

export const EMPTY_CATALOG = {
  playlistUrl: "",
  songs: []
};

export function createSong(input = {}) {
  const title = clean(input.title);
  const artist = clean(input.artist);

  return {
    id: input.id || cryptoRandomId(),
    title,
    artist,
    language: LANGUAGES.includes(input.language) ? input.language : "Outro",
    mood: MOODS.includes(input.mood) ? input.mood : "Doce",
    status: STATUSES.some((status) => status.value === input.status) ? input.status : "to_review",
    lyricsUrl: clean(input.lyricsUrl),
    translationUrl: clean(input.translationUrl),
    romanticReason: clean(input.romanticReason)
  };
}

export function parseBulkSongs(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes(" - ")) {
        const [artist, title] = line.split(" - ");
        return createSong({ artist, title });
      }

      const [title, artist, language] = line.split(",").map((part) => part?.trim());
      return createSong({ title, artist, language });
    })
    .filter((song) => song.title && song.artist);
}

export function statusLabel(value) {
  return STATUSES.find((status) => status.value === value)?.label || "A revisar";
}

function clean(value) {
  return String(value || "").trim();
}

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `song-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

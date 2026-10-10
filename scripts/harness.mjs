import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createCatalogQuery, extractSpotifyPlaylistId } from "../src/features/catalog/catalog.query.js";
import { createCatalogService } from "../src/features/catalog/catalog.service.js";
import { createCatalogStore } from "../src/features/catalog/catalog.store.js";
import { buildTranslationCandidates } from "../src/features/sources/translation-sources.model.js";
import { createSpotifyService } from "../src/features/spotify/spotify.service.js";
import { SPOTIFY_PLAYLIST_URL, spotifyTrackToSong } from "../src/features/spotify/spotify.model.js";

const memoryStorage = createMemoryStorage();
const store = createCatalogStore();
const query = createCatalogQuery(store);
const service = createCatalogService(store, memoryStorage);

service.setPlaylistUrl("https://open.spotify.com/playlist/37i9dQZF1DX50QitC6Oqtn?si=test");
assert.equal(query.selectPlaylistMeta().playlistId, "37i9dQZF1DX50QitC6Oqtn");
assert.equal(extractSpotifyPlaylistId("invalid"), "");

service.addSong({
  title: "La vie en rose",
  artist: "Edith Piaf",
  language: "Frances",
  mood: "Declaracao",
  lyricsUrl: "https://example.com/lyrics",
  translationUrl: "https://example.com/translation",
  romanticReason: "A imagem central associa amor a uma mudanca delicada na forma de ver o mundo."
});

service.addBulk("Caetano Veloso - Voce e linda\nSomething, The Beatles, Ingles");

assert.equal(query.selectSummary().total, 3);
assert.equal(query.selectFiltered({ language: "Ingles" }).length, 1);
assert.equal(query.selectFiltered({ search: "edith" }).length, 1);

const exported = service.exportJson();
assert.match(exported, /La vie en rose/);

const secondStore = createCatalogStore();
const secondService = createCatalogService(secondStore, createMemoryStorage());
secondService.importJson(exported);
assert.equal(createCatalogQuery(secondStore).selectSummary().total, 3);

const fixture = JSON.parse(readFileSync("fixtures/spotify-playlist.sample.json", "utf8"));
const mapped = fixture.items.map(spotifyTrackToSong);
assert.equal(mapped[0].title, "La vie en rose");
assert.equal(mapped[0].spotifyUrl, "https://open.spotify.com/track/example1");

const candidates = buildTranslationCandidates(mapped[0]);
assert.equal(candidates[0].providerName, "Letras");
assert.match(candidates[0].url, /google\.com\/search/);

const spotifyStorage = createMemoryStorage();
spotifyStorage.setItem(
  "spotilator.spotify.v1",
  JSON.stringify({ accessToken: "fake-token", playlistUrl: SPOTIFY_PLAYLIST_URL })
);
const spotifyService = createSpotifyService(spotifyStorage, async () => ({
  ok: true,
  json: async () => fixture
}));
const imported = await spotifyService.importPlaylistTracks(SPOTIFY_PLAYLIST_URL);
assert.equal(imported.length, 2);

console.log("harness ok");

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
}

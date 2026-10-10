import assert from "node:assert/strict";
import { createCatalogQuery, extractSpotifyPlaylistId } from "../src/features/catalog/catalog.query.js";
import { createCatalogService } from "../src/features/catalog/catalog.service.js";
import { createCatalogStore } from "../src/features/catalog/catalog.store.js";

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

console.log("harness ok");

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
}

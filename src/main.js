import { createCatalogQuery } from "./features/catalog/catalog.query.js";
import { createCatalogService } from "./features/catalog/catalog.service.js";
import { createCatalogStore } from "./features/catalog/catalog.store.js";
import { mountCatalogView } from "./features/catalog/catalog.view.js";
import { createSpotifyService } from "./features/spotify/spotify.service.js";

const store = createCatalogStore();
const query = createCatalogQuery(store);
const service = createCatalogService(store);
const spotifyService = createSpotifyService();

service.load();
mountCatalogView({ store, query, service, spotifyService });

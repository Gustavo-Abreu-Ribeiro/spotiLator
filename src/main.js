import { createCatalogQuery } from "./features/catalog/catalog.query.js";
import { createCatalogService } from "./features/catalog/catalog.service.js";
import { createCatalogStore } from "./features/catalog/catalog.store.js";
import { mountCatalogView } from "./features/catalog/catalog.view.js";

const store = createCatalogStore();
const query = createCatalogQuery(store);
const service = createCatalogService(store);

service.load();
mountCatalogView({ store, query, service });

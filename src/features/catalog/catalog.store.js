import { createStore } from "../../core/store.js";
import { EMPTY_CATALOG } from "./catalog.model.js";

export function createCatalogStore(initialState = EMPTY_CATALOG) {
  return createStore(initialState);
}

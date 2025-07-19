export const CACHED_ROUTE_KEY = "last_uml_route";
export const getCachedRoute = () => {
  const cachedRoute = localStorage.getItem(CACHED_ROUTE_KEY);
  return cachedRoute
}

export const setCacheRoute = (value: string) => {
  localStorage.setItem(CACHED_ROUTE_KEY, value);
}

export const clearCacheRoute = () => {
  localStorage.removeItem(CACHED_ROUTE_KEY);
}
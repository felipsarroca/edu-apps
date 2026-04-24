import originalClient from "./react-dom-client.original.js";

export default originalClient;
export const createRoot = originalClient.createRoot;
export const hydrateRoot = originalClient.hydrateRoot;
export const version = originalClient.version;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = process.env.API_BASE_URL;

  // Get the full path (keep /api prefix)
  const path = event.path;

  // Forward the request to the backend API
  const target = `${apiBaseUrl}${path}`;

  // Log at debug level
  if (process.env.LOG_LEVEL === "debug" || process.env.NODE_ENV === "development") {
    console.log(`[PROXY] ${event.method} ${path} -> ${target}`);
  }

  return proxyRequest(event, target, {
    // Forward all headers including cookies and authorization
    headers: {
      ...getProxyRequestHeaders(event),
    },
    // Explicitly enable all methods
    fetchOptions: {
      method: event.method,
    },
  });
});

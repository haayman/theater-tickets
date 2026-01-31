export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl || process.env.API_BASEURL || "http://localhost:3001";

  // Get the path after /api/
  const path = event.path.replace(/^\/api/, "");

  // Forward the request to the backend API
  const target = `${apiBaseUrl}${path}`;

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

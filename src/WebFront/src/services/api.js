export const BASE_URL = "https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-kg1h.onrender.com";
const INTERNAL_KEY = "VibeCheck_Internal_2026";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(120000), 
    });

    if (!response.ok) {
      let errorMessage = "Erro inesperado na requisição";
      
     
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || "Erro na requisição";
      } catch (parseError) {
        
        errorMessage = `Servidor indisponível no momento (Status ${response.status}). O Render pode estar acordando.`;
      }
      
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (error) {
    
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new Error(
        "O servidor demorou muito para responder. Ele pode estar 'acordando' da suspensão. Aguarde uns segundos e tente novamente."
      );
    }

    
    if (error.message === "Failed to fetch") {
       throw new Error("Falha na conexão. Verifique sua internet ou se o servidor está online.");
    }

   
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  internalGet: (endpoint) =>
    request(endpoint, {
      method: "GET",
      headers: { "X-Internal-Key": INTERNAL_KEY },
    }),
};
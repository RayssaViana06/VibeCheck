const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const warmUp = async () => {
    if (!BASE_URL) {
        console.warn("warmUp: VITE_API_URL não definido");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/health`, { method: "GET" });
        if (!res.ok) {
            console.warn(`warmUp: /health retornou ${res.status}`);
        } else {
            console.info("warmUp: Gateway acordado:", res.status);
        }
    } catch (err) {
        console.warn("warmUp: erro ao contactar /health", err);
    }
};
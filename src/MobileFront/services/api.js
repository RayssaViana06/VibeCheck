import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-kg1h.onrender.com/gateway',
  timeout: 120000, 
});


api.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      return Promise.reject(
        new Error("O servidor demorou muito para responder. Ele pode estar 'acordando'. Tente novamente em alguns segundos.")
      );
    }

    
    if (error.message === 'Network Error') {
      return Promise.reject(new Error("Falha na conexão. Verifique sua internet."));
    }

    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 502 || status === 504) {
         return Promise.reject(new Error(`Servidor indisponível no momento (Status ${status}). O sistema pode estar inicializando.`));
      }

      
      if (error.response.data && (error.response.data.message || error.response.data.error)) {
         return Promise.reject(new Error(error.response.data.message || error.response.data.error));
      }
    }

   
    return Promise.reject(error);
  }
);

export function setToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function removerToken() {
  delete api.defaults.headers.common['Authorization'];
}

export default api;
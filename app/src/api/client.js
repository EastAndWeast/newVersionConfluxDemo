import axios from 'axios';

const BASE_URL = 'https://api-test.bitunion.io/v1';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token from local storage
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bitunion_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'API Request Failed';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

export default apiClient;

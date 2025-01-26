import axios from 'axios';
import { StorageManager } from './storageManager';

const baseURL = import.meta.env.VITE_MODE === 'PRODUCTION' ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:8000/api/';

const axiosServices = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});


// Add a request interceptor
axiosServices.interceptors.request.use(
    async function (config) {

        // Retrieve tokens and session data
        const token = new StorageManager('ACCESS_TOKEN', 'AUTH', true).getStorage();
        const session_id = new StorageManager('SESSION_ID', 'SESSION', true).getStorage();
        const device_id = new StorageManager('DEVICE_ID', 'PERSIST', true).getStorage();
        const refresh_token = new StorageManager('REFRESH_TOKEN', 'SESSION', true).getStorage();

        // Set headers
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['session-id'] = session_id;
        config.headers['device-id'] = device_id;
        config.headers['refresh-token'] = refresh_token;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// interceptor for http response errors
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.code === "ERR_NETWORK") {
            // handle network errors if needed
        }
        return Promise.reject((error.response && error.response?.data) || 'Wrong Services');
    }
);

export default axiosServices;

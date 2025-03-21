import axios from 'axios';
import { api } from '../constant';
import authService from './AuthService';
import errorService from './ErrorService';

class HttpService {
    constructor() {
        this.auth = authService;
        this.errorService = errorService;
        this.axiosInstance = axios.create({
            baseURL: api,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor for auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.auth.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async get(apiUrl) {
        return this.axiosInstance.get(apiUrl).catch((error) => {
            this.errorService.errorHandler(error);
            throw error;
        });
    }

    async post(apiUrl, body) {
        return this.axiosInstance.post(apiUrl, body).catch((error) => {
            this.errorService.errorHandler(error);
            console.error('Post error:', error);
            throw error;
        });
    }

    async put(apiUrl, body) {
        return this.axiosInstance.put(apiUrl, body).catch((error) => {
            this.errorService.errorHandler(error);
            throw error;
        });
    }

    async delete(apiUrl) {
        return this.axiosInstance.delete(apiUrl).catch((error) => {
            this.errorService.errorHandler(error);
            throw error;
        });
    }
}

// Create a singleton instance
const httpService = new HttpService();
export default httpService;

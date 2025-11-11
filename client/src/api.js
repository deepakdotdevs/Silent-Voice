import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
	baseURL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.request.use(
	(config) => {
		const token = window.localStorage.getItem('sv_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			// Server responded with error status
			console.error('API Error:', error.response.status, error.response.data);
		} else if (error.request) {
			// Request made but no response
			console.error('Network Error: No response from server');
		} else {
			// Request setup error
			console.error('Request Error:', error.message);
		}
		return Promise.reject(error);
	}
);



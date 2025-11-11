import { useState, useEffect } from 'react';

export function useAuth() {
	const [token, setToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check for token on initial load
		const storedToken = window.localStorage.getItem('sv_token');
		if (storedToken) {
			setToken(storedToken);
			setIsAuthenticated(true);
		}

		// Listen for storage changes (token updates)
		const handleStorageChange = () => {
			const updatedToken = window.localStorage.getItem('sv_token');
			if (updatedToken) {
				setToken(updatedToken);
				setIsAuthenticated(true);
			} else {
				setToken(null);
				setIsAuthenticated(false);
			}
		};

		window.addEventListener('storage', handleStorageChange);

		// Custom event for same-tab token changes
		const handleTokenChange = () => {
			const updatedToken = window.localStorage.getItem('sv_token');
			if (updatedToken) {
				setToken(updatedToken);
				setIsAuthenticated(true);
			} else {
				setToken(null);
				setIsAuthenticated(false);
			}
		};

		window.addEventListener('tokenChanged', handleTokenChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('tokenChanged', handleTokenChange);
		};
	}, []);

	return {
		isAuthenticated,
		token
	};
}



import { useMemo } from 'react';

export function useAuth() {
	const token = typeof window !== 'undefined' ? window.localStorage.getItem('sv_token') : null;
	return useMemo(() => {
		return {
			isAuthenticated: Boolean(token),
			token
		};
	}, [token]);
}



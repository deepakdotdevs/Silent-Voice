import { useState } from 'react';
import { api } from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
	const [email, setEmail] = useState('admin@campus.edu');
	const [password, setPassword] = useState('password123');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleLogin(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const { data } = await api.post('/api/auth/login', { email, password });
			window.localStorage.setItem('sv_token', data.token);
			navigate('/admin', { replace: true });
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="max-w-md mx-auto sv-card">
			<h2 className="text-xl font-semibold text-primary mb-4">Admin Login</h2>
			<form onSubmit={handleLogin} className="space-y-3">
				<div>
					<label className="block text-sm mb-1">Email</label>
					<input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm mb-1">Password</label>
					<input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<button className="sv-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
				{error ? <p className="text-red-600 text-sm">{error}</p> : null}
			</form>
		</section>
	);
}



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
			// Trigger custom event to notify useAuth hook
			window.dispatchEvent(new Event('tokenChanged'));
			navigate('/admin', { replace: true });
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="page">
			<div className="login-container">
				<div className="login-box">
					<svg className="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<h2>Admin Login</h2>

					<form onSubmit={handleLogin}>
						<div className="form-group">
							<label>Email</label>
							<input 
								type="email" 
								className="form-input" 
								placeholder="Enter your email"
								value={email} 
								onChange={(e) => setEmail(e.target.value)} 
							/>
						</div>

						<div className="form-group">
							<label>Password</label>
							<input 
								type="password" 
								className="form-input" 
								placeholder="Enter your password"
								value={password} 
								onChange={(e) => setPassword(e.target.value)} 
							/>
						</div>

						<button type="submit" className="btn btn-primary btn-large" disabled={loading}>
							{loading ? 'Signing in...' : 'Sign In'}
						</button>
						
						{error && (
							<p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.9rem' }}>
								{error}
							</p>
						)}
						
						<p className="login-hint">Demo: admin@campus.edu / password123</p>
					</form>
				</div>
			</div>

			<footer className="footer">
				<p>SilentVoice © 2025. An Intelligent Campus Safety Platform.</p>
			</footer>
		</div>
	);
}



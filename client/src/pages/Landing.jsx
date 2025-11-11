import { Link } from 'react-router-dom';

export default function Landing() {
	return (
		<div className="page">
			<div className="hero">
				<div className="hero-content">
					<svg className="hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<h1>SilentVoice</h1>
					<p className="hero-subtitle">Your Voice Matters. Your Safety is Our Priority.</p>
					<p className="hero-description">An intelligent, anonymous platform for a safer campus.</p>
					<Link to="/submit" className="btn btn-primary btn-large">Enter Reporting Portal</Link>
				</div>
			</div>

			<div className="features">
				<div className="feature-card">
					<div className="feature-icon">🔒</div>
					<h3>100% Anonymous</h3>
					<p>Submit reports without revealing your identity.</p>
				</div>
				<div className="feature-card">
					<div className="feature-icon">🤖</div>
					<h3>AI-Powered Triage</h3>
					<p>Urgent issues are flagged instantly for fast action.</p>
				</div>
				<div className="feature-card">
					<div className="feature-icon">🗺️</div>
					<h3>Community Heatmap</h3>
					<p>View a live map of campus safety reports.</p>
				</div>
				<div className="feature-card">
					<div className="feature-icon">🚨</div>
					<h3>Emergency Alerts</h3>
					<p>Instant alerts for high-priority incidents.</p>
				</div>
			</div>

			<footer className="footer">
				<p>SilentVoice © 2025. An Intelligent Campus Safety Platform.</p>
			</footer>
		</div>
	);
}



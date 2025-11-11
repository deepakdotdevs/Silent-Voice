import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="nav-container">
				<Link to="/" className="nav-logo">
					<svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>SilentVoice</span>
				</Link>
				<div className="nav-links">
					<NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
						Home
					</NavLink>
					<NavLink to="/submit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
						Student Portal
					</NavLink>
					<NavLink to="/admin/login" className="nav-link admin-login-btn">
						Admin Login
					</NavLink>
				</div>
			</div>
		</nav>
	);
}



import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
	return (
		<header className="sv-hero">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link to="/" className="font-semibold text-lg">
					SilentVoice
				</Link>
				<nav className="flex items-center gap-4 text-white/90">
					<NavLink to="/submit" className={({ isActive }) => (isActive ? 'underline' : '')}>
						Submit Report
					</NavLink>
					<NavLink to="/track" className={({ isActive }) => (isActive ? 'underline' : '')}>
						Track Report
					</NavLink>
					<NavLink to="/map" className={({ isActive }) => (isActive ? 'underline' : '')}>
						Safety Map
					</NavLink>
					<NavLink to="/admin" className={({ isActive }) => (isActive ? 'underline' : '')}>
						Admin
					</NavLink>
				</nav>
			</div>
		</header>
	);
}



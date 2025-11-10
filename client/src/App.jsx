import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import SubmitReport from './pages/SubmitReport.jsx';
import TrackReport from './pages/TrackReport.jsx';
import SafetyMap from './pages/SafetyMap.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './hooks/useAuth.js';

export default function App() {
	const { isAuthenticated } = useAuth();
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main className="max-w-6xl mx-auto px-4 py-6">
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/submit" element={<SubmitReport />} />
					<Route path="/track" element={<TrackReport />} />
					<Route path="/map" element={<SafetyMap />} />
					<Route path="/admin/login" element={<AdminLogin />} />
					<Route
						path="/admin"
						element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
					/>
				</Routes>
			</main>
		</div>
	);
}



import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import SubmitReport from './pages/SubmitReport.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './hooks/useAuth.js';
import './styles.css';

export default function App() {
	const { isAuthenticated } = useAuth();
	return (
		<div className="min-h-screen">
			<Navbar />
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/submit" element={<SubmitReport />} />
				<Route path="/track" element={<SubmitReport />} />
				<Route path="/map" element={<SubmitReport />} />
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route
					path="/admin"
					element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
				/>
			</Routes>
		</div>
	);
}



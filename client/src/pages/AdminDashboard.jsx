import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ReportModal from '../components/ReportModal.jsx';

export default function AdminDashboard() {
	const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(null);

	async function refresh() {
		setLoading(true);
		try {
			const [s, r] = await Promise.all([
				api.get('/api/reports/stats/summary'),
				api.get('/api/reports')
			]);
			setStats(s.data);
			setReports(r.data);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		refresh();
	}, []);

	async function updateStatus(id, status) {
		await api.put(`/api/reports/${id}`, { status });
		refresh();
	}
	async function removeReport(id) {
		// eslint-disable-next-line no-alert
		if (!window.confirm('Delete this report?')) return;
		await api.delete(`/api/reports/${id}`);
		refresh();
	}

	function signOut() {
		window.localStorage.removeItem('sv_token');
		// Trigger custom event to notify useAuth hook
		window.dispatchEvent(new Event('tokenChanged'));
		window.location.href = '/admin/login';
	}

	return (
		<div className="page">
			<div className="dashboard-container">
				<div className="dashboard-header">
					<h1>Admin Dashboard</h1>
					<button className="btn btn-secondary" onClick={signOut}>Logout</button>
				</div>

				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-number">{stats.total}</div>
						<div className="stat-label">Total Reports</div>
					</div>
					<div className="stat-card">
						<div className="stat-number">{stats.pending}</div>
						<div className="stat-label">Under Review</div>
					</div>
					<div className="stat-card">
						<div className="stat-number">{stats.resolved}</div>
						<div className="stat-label">Resolved</div>
					</div>
					<div className="stat-card">
						<div className="stat-number">{stats.highPriority}</div>
						<div className="stat-label">High Priority</div>
					</div>
				</div>

				<div className="reports-section">
					<h2>Recent Reports</h2>
					<div className="reports-table-wrapper">
						{loading ? (
							<p>Loading...</p>
						) : (
							<table className="reports-table">
								<thead>
									<tr>
										<th>Report ID</th>
										<th>Category</th>
										<th>Status</th>
										<th>Date</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{reports.map((r) => {
										const statusClass = 
											r.status === 'resolved' ? 'status-resolved' :
											r.priority === 'high' ? 'status-high-priority' : 
											'status-pending';
										
										return (
											<tr key={r._id}>
												<td>{r._id.slice(-8)}</td>
												<td>{r.category}</td>
												<td>
													<span className={`status-badge ${statusClass}`}>
														{r.status}
													</span>
												</td>
												<td>{new Date(r.createdAt).toLocaleDateString()}</td>
												<td>
													<div className="action-buttons">
														<button 
															className="btn btn-secondary" 
															onClick={() => setSelected(r)}
														>
															View
														</button>
														<button 
															className="btn btn-secondary" 
															onClick={() => removeReport(r._id)}
														>
															Delete
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>

			<footer className="footer">
				<p>SilentVoice © 2025. An Intelligent Campus Safety Platform.</p>
			</footer>

			{selected && (
				<ReportModal 
					report={selected} 
					onClose={() => setSelected(null)} 
					onResolve={updateStatus}
				/>
			)}
		</div>
	);
}



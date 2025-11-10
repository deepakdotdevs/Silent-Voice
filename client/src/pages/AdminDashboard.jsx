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
		window.location.href = '/admin/login';
	}

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold text-primary">Admin Dashboard</h2>
				<button className="sv-btn" onClick={signOut}>Sign out</button>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<div className="sv-card text-center">
					<p className="text-sm text-gray-500">Total</p>
					<p className="text-2xl font-bold">{stats.total}</p>
				</div>
				<div className="sv-card text-center">
					<p className="text-sm text-gray-500">Pending</p>
					<p className="text-2xl font-bold">{stats.pending}</p>
				</div>
				<div className="sv-card text-center">
					<p className="text-sm text-gray-500">Resolved</p>
					<p className="text-2xl font-bold">{stats.resolved}</p>
				</div>
				<div className="sv-card text-center">
					<p className="text-sm text-gray-500">High Priority</p>
					<p className="text-2xl font-bold">{stats.highPriority}</p>
				</div>
			</div>
			<div className="sv-card overflow-auto">
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-semibold">Reports</h3>
					<button className="sv-btn" onClick={refresh}>Refresh</button>
				</div>
				{loading ? <p>Loading...</p> : (
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left">
								<th className="p-2">ID</th>
								<th className="p-2">Category</th>
								<th className="p-2">Status</th>
								<th className="p-2">Date</th>
								<th className="p-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{reports.map((r) => (
								<tr key={r._id} className="border-t">
									<td className="p-2 font-mono">{r._id.slice(-8)}</td>
									<td className="p-2">{r.category}</td>
									<td className="p-2">{r.status}</td>
									<td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
									<td className="p-2 space-x-2">
										<button className="px-2 py-1 rounded bg-gray-200" onClick={() => setSelected(r)}>View</button>
										<button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => updateStatus(r._id, 'resolved')}>Resolve</button>
										<button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => removeReport(r._id)}>Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
			{selected ? <ReportModal report={selected} onClose={() => setSelected(null)} /> : null}
		</section>
	);
}



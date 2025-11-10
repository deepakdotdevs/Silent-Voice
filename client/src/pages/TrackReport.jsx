import { useState } from 'react';
import { api } from '../api.js';
import ReportModal from '../components/ReportModal.jsx';

export default function TrackReport() {
	const [id, setId] = useState('');
	const [report, setReport] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function fetchReport(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		setReport(null);
		try {
			const { data } = await api.get(`/api/reports/${id}`);
			setReport(data);
		} catch (err) {
			setError(err?.response?.data?.message || 'Report not found');
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="sv-card">
			<h2 className="text-xl font-semibold text-primary mb-4">Track Your Report</h2>
			<form onSubmit={fetchReport} className="flex gap-2">
				<input
					className="flex-1 border rounded px-3 py-2"
					placeholder="Enter Report ID"
					value={id}
					onChange={(e) => setId(e.target.value)}
				/>
				<button className="sv-btn" disabled={!id || loading}>{loading ? 'Loading...' : 'Track'}</button>
			</form>
			{error ? <p className="text-red-600 text-sm mt-3">{error}</p> : null}
			{report ? (
				<div className="mt-4">
					<ReportModal report={report} onClose={() => setReport(null)} />
				</div>
			) : null}
		</section>
	);
}



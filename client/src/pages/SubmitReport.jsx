import { useState } from 'react';
import { api } from '../api.js';

const categories = ['Harassment', 'Theft', 'Bullying', 'Vandalism', 'Assault', 'Other'];

export default function SubmitReport() {
	const [form, setForm] = useState({
		category: '',
		description: '',
		location: '',
		photoUrl: ''
	});
	const [created, setCreated] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setForm((f) => ({ ...f, photoUrl: reader.result.toString() }));
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const { data } = await api.post('/api/reports', form);
			setCreated(data);
			setForm({ category: '', description: '', location: '', photoUrl: '' });
	+	} catch (err) {
			setError(err?.response?.data?.message || 'Failed to submit report');
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="grid md:grid-cols-2 gap-6">
			<form onSubmit={handleSubmit} className="sv-card space-y-4">
				<h2 className="text-xl font-semibold text-primary">Submit Report</h2>
				<div>
					<label className="block text-sm mb-1">Category</label>
					<select
						required
						className="w-full border rounded px-3 py-2"
						value={form.category}
						onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
					>
						<option value="">Select category</option>
						{categories.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm mb-1">Description</label>
					<textarea
						required
						className="w-full border rounded px-3 py-2"
						rows={5}
						value={form.description}
						onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
					/>
				</div>
				<div>
					<label className="block text-sm mb-1">Location</label>
					<input
						required
						className="w-full border rounded px-3 py-2"
						value={form.location}
						onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
					/>
				</div>
				<div>
					<label className="block text-sm mb-1">Photo (optional)</label>
					<input type="file" accept="image/*" onChange={handleFile} />
					{form.photoUrl ? <img src={form.photoUrl} alt="preview" className="mt-2 h-24 rounded object-cover" /> : null}
				</div>
				<button disabled={loading} className="sv-btn">{loading ? 'Submitting...' : 'Submit'}</button>
				{error ? <p className="text-red-600 text-sm">{error}</p> : null}
			</form>
			<div className="sv-card">
				<h3 className="font-semibold mb-2">What happens next?</h3>
				<p className="text-gray-700">
					Your report is stored securely and made visible to campus administrators. Keep your Report ID to
					track status on the Track page.
				</p>
				{created ? (
					<div className="mt-4 p-3 border rounded bg-green-50">
						<p className="font-medium text-green-700">Report submitted successfully!</p>
						<p className="text-sm">Report ID:</p>
						<p className="font-mono break-all">{created._id}</p>
						<p className="text-sm mt-2">Status: {created.status} | Priority: {created.priority}</p>
					</div>
				) : null}
			</div>
		</section>
	);
}



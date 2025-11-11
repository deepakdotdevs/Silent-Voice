import { useState } from 'react';
import { api } from '../api.js';

const categories = ['Harassment', 'Safety Hazard', 'Theft', 'Vandalism', 'Other'];

export default function SubmitReport() {
	const [activeTab, setActiveTab] = useState('submit');
	const [form, setForm] = useState({
		category: 'Harassment',
		description: '',
		location: '',
		photoUrl: ''
	});
	const [created, setCreated] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [trackId, setTrackId] = useState('');
	const [trackResult, setTrackResult] = useState(null);

	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setForm((f) => ({ ...f, photoUrl: reader.result.toString() }));
		};
		reader.readAsDataURL(file);
	}

	function addLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				setForm((f) => ({ 
					...f, 
					location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` 
				}));
			});
		} else {
			alert('Geolocation is not supported by your browser');
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const { data } = await api.post('/api/reports', form);
			setCreated(data);
			setForm({ category: 'Harassment', description: '', location: '', photoUrl: '' });
		} catch (err) {
			setError(err?.response?.data?.message || 'Failed to submit report');
		} finally {
			setLoading(false);
		}
	}

	async function trackReport() {
		if (!trackId.trim()) {
			alert('Please enter a Report ID');
			return;
		}
		
		try {
			const { data } = await api.get(`/api/reports/${trackId}`);
			setTrackResult(data);
		} catch (err) {
			setTrackResult({ error: 'Report not found' });
		}
	}

	return (
		<div className="page">
			<div className="portal-container">
				<h1>Student Reporting Portal</h1>
				<p className="portal-subtitle">A safe, anonymous, and effective way to voice your concerns.</p>

				<div className="tabs">
					<button 
						className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
						onClick={() => setActiveTab('submit')}
					>
						Submit
					</button>
					<button 
						className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
						onClick={() => setActiveTab('track')}
					>
						Track
					</button>
					<button 
						className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
						onClick={() => setActiveTab('map')}
					>
						Safety Map
					</button>
				</div>

				{/* Submit Tab */}
				{activeTab === 'submit' && (
					<div className="tab-content active">
						{created ? (
							<div className="form-container">
								<h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Report Submitted Successfully!</h3>
								<p><strong>Your Report ID:</strong> {created._id || created.reportId}</p>
								<p style={{ marginTop: '1rem' }}>Please save this ID to track your report status.</p>
								<button 
									className="btn btn-primary" 
									onClick={() => setCreated(null)}
									style={{ marginTop: '1rem' }}
								>
									Submit Another Report
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="form-container">
								<div className="form-group">
									<label>Category</label>
									<select 
										className="form-input"
										value={form.category}
										onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
									>
										{categories.map(cat => (
											<option key={cat} value={cat}>{cat}</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Detailed Description</label>
									<p className="form-hint">Please provide as much detail as possible.</p>
									<textarea 
										className="form-input" 
										rows="6" 
										placeholder="Describe the incident..."
										value={form.description}
										onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
										required
									></textarea>
								</div>

								<div className="form-group">
									<label>Add Evidence (Optional)</label>
									<div className="evidence-buttons">
										<button type="button" className="btn btn-secondary" onClick={addLocation}>
											📍 Add Current Location
										</button>
										<button type="button" className="btn btn-secondary" onClick={() => document.getElementById('photo-input').click()}>
											📷 Upload Photo
										</button>
									</div>
									<input type="file" id="photo-input" style={{ display: 'none' }} accept="image/*" onChange={handleFile} />
									{form.location && (
										<div className="location-display show">
											Location added: {form.location}
										</div>
									)}
								</div>

								{error && (
									<div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
										{error}
									</div>
								)}

								<button type="submit" className="btn btn-primary btn-large" disabled={loading}>
									{loading ? 'Submitting...' : 'Submit Anonymously'}
								</button>
							</form>
						)}
					</div>
				)}

				{/* Track Tab */}
				{activeTab === 'track' && (
					<div className="tab-content active">
						<div className="track-container">
							<div className="track-input-group">
								<input 
									type="text" 
									className="form-input" 
									placeholder="Enter your Report ID"
									value={trackId}
									onChange={(e) => setTrackId(e.target.value)}
								/>
								<button className="btn btn-primary" onClick={trackReport}>Track</button>
							</div>
							{trackResult && (
								<div className="track-result show">
									{trackResult.error ? (
										<div>
											<h3>Report Not Found</h3>
											<p>No report found with this ID.</p>
										</div>
									) : (
										<div>
											<h3>Report Found</h3>
											<p><strong>Report ID:</strong> {trackResult._id}</p>
											<p><strong>Category:</strong> {trackResult.category}</p>
											<p><strong>Status:</strong> {trackResult.status.charAt(0).toUpperCase() + trackResult.status.slice(1)}</p>
											<p><strong>Submitted:</strong> {new Date(trackResult.createdAt).toLocaleDateString()}</p>
											<p><strong>Description:</strong> {trackResult.description}</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Map Tab */}
				{activeTab === 'map' && (
					<div className="tab-content active">
						<div className="map-container">
							<h3>Campus Safety Hotspots</h3>
							<p>This map shows generalized locations of recent non-sensitive reports like maintenance or safety hazards to promote community awareness.</p>
							<iframe 
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7597857849!2d77.20218!3d28.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2cc00000001%3A0x1234567890!2sDelhi%20University!5e0!3m2!1sen!2sin!4v1234567890" 
								width="100%" 
								height="500" 
								style={{ border: 0 }}
								allowFullScreen="" 
								loading="lazy"
							></iframe>
						</div>
					</div>
				)}
			</div>

			<footer className="footer">
				<p>SilentVoice © 2025. An Intelligent Campus Safety Platform.</p>
			</footer>
		</div>
	);
}
import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function SafetyMap() {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.get('/api/reports/public/recent/list?limit=50')
			.then(({ data }) => setReports(data))
			.finally(() => setLoading(false));
	}, []);

	// Build markers query for Google Maps Static or Embed
	const markers = reports
		.filter((r) => r.coordinates?.lat && r.coordinates?.lng)
		.map((r) => `${r.coordinates.lat},${r.coordinates.lng}`)
		.join('|');

	const mapSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyD-PLACEHOLDER&center=37.4275,-122.1697&zoom=14&maptype=roadmap`;

	return (
		<section className="grid md:grid-cols-2 gap-6">
			<div className="sv-card">
				<h2 className="text-xl font-semibold text-primary mb-2">Safety Map</h2>
				<p className="text-gray-700 mb-3">Recent reports are plotted around campus to help visualize hotspots.</p>
				<div className="aspect-video w-full rounded overflow-hidden">
					<iframe
						title="Campus Safety Map"
						width="100%"
						height="100%"
						style={{ border: 0 }}
						loading="lazy"
						allowFullScreen
						referrerPolicy="no-referrer-when-downgrade"
						src={mapSrc}
					/>
				</div>
				<p className="text-xs text-gray-500 mt-2">Note: Map requires a valid Google Maps API key.</p>
			</div>
			<div className="sv-card">
				<h3 className="font-semibold mb-2">Recent Reports</h3>
				{loading ? <p>Loading...</p> : null}
				<ul className="space-y-2 max-h-[420px] overflow-auto">
					{reports.map((r) => (
						<li key={r._id} className="border rounded p-2">
							<p className="text-sm"><span className="font-medium">{r.category}</span> • {r.status}</p>
							<p className="text-xs text-gray-600">{r.location}</p>
							<p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}



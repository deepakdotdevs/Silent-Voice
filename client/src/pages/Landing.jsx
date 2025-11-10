export default function Landing() {
	return (
		<section>
			<div className="sv-card">
				<h1 className="text-2xl font-bold text-primary mb-2">SilentVoice – Campus Safety Platform</h1>
				<p className="text-gray-700">
					SilentVoice empowers students to report incidents anonymously and helps campus administrators
					track and resolve safety issues quickly. Submit reports, track their status, and view recent
					incidents on the safety map.
				</p>
				<ul className="list-disc ml-6 mt-4 text-gray-700">
					<li>Anonymous reporting with optional photo</li>
					<li>Real-time status tracking with your report ID</li>
					<li>Admin dashboard for reviewing and resolving cases</li>
				</ul>
			</div>
		</section>
	);
}



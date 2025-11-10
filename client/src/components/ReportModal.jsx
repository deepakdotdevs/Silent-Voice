import React from 'react';

export default function ReportModal({ report, onClose }) {
	if (!report) return null;
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="sv-card max-w-lg w-full">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg font-semibold">Report Details</h3>
					<button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
						Close
					</button>
				</div>
				<div className="space-y-2 text-sm">
					<p><span className="font-medium">ID:</span> {report._id}</p>
					<p><span className="font-medium">Category:</span> {report.category}</p>
					<p><span className="font-medium">Status:</span> {report.status}</p>
					<p><span className="font-medium">Priority:</span> {report.priority}</p>
					<p><span className="font-medium">Location:</span> {report.location}</p>
					<p className="whitespace-pre-wrap"><span className="font-medium">Description:</span> {report.description}</p>
					{report.photoUrl ? (
						<img src={report.photoUrl} alt="Report" className="mt-2 rounded max-h-64 object-cover" />
					) : null}
					<p className="text-gray-500">Created: {new Date(report.createdAt).toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
}



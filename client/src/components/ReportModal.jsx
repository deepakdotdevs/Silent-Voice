import React from 'react';

export default function ReportModal({ report, onClose, onResolve }) {
	if (!report) return null;
	
	return (
		<div className="modal show">
			<div className="modal-content">
				<div className="modal-header">
					<h2>Report Details</h2>
					<button className="modal-close" onClick={onClose}>&times;</button>
				</div>
				<div className="modal-body">
					<p><strong>Report ID:</strong> {report._id}</p>
					<p><strong>Category:</strong> {report.category}</p>
					<p><strong>Status:</strong> {report.status}</p>
					<p><strong>Priority:</strong> {report.priority}</p>
					{report.location && <p><strong>Location:</strong> {report.location}</p>}
					<p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
					<p><strong>Description:</strong></p>
					<p>{report.description}</p>
					{report.photoUrl && (
						<div style={{ marginTop: '1rem' }}>
							<strong>Photo:</strong><br />
							<img 
								src={report.photoUrl} 
								alt="Report evidence" 
								style={{ 
									maxWidth: '100%', 
									maxHeight: '300px', 
									borderRadius: '6px',
									marginTop: '0.5rem'
								}} 
							/>
						</div>
					)}
				</div>
				<div className="modal-footer">
					<button className="btn btn-secondary" onClick={onClose}>Close</button>
					{report.status !== 'resolved' && onResolve && (
						<button 
							className="btn btn-primary" 
							onClick={() => {
								onResolve(report._id, 'resolved');
								onClose();
							}}
						>
							Mark as Resolved
						</button>
					)}
				</div>
			</div>
		</div>
	);
}



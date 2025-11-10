import express from 'express';
import mongoose from 'mongoose';
import { Report } from '../models/Report.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: create a report
router.post('/', async (req, res, next) => {
	try {
		const { category, description, location, photoUrl } = req.body;
		if (!category || !description || !location) {
			return res.status(400).json({ message: 'category, description, and location are required' });
		}
		const report = await Report.create({ category, description, location, photoUrl });
		return res.status(201).json(report);
	} catch (e) {
		return next(e);
	}
});

// Public: recent reports for safety map (limited fields)
router.get('/public/recent/list', async (req, res, next) => {
	try {
		const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
		const reports = await Report.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.select('category status createdAt coordinates location priority');
		return res.json(reports);
	} catch (e) {
		return next(e);
	}
});

// Public: get a report by ID (to track status)
router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid report ID' });
		}
		const report = await Report.findById(id);
		if (!report) return res.status(404).json({ message: 'Report not found' });
		return res.json(report);
	} catch (e) {
		return next(e);
	}
});

// Admin: list all reports
router.get('/', requireAdmin, async (req, res, next) => {
	try {
		const reports = await Report.find({}).sort({ createdAt: -1 });
		return res.json(reports);
	} catch (e) {
		return next(e);
	}
});

// Admin: stats
router.get('/stats/summary', requireAdmin, async (req, res, next) => {
	try {
		const total = await Report.countDocuments();
		const pending = await Report.countDocuments({ status: 'pending' });
		const resolved = await Report.countDocuments({ status: 'resolved' });
		const highPriority = await Report.countDocuments({ priority: 'high' });
		return res.json({ total, pending, resolved, highPriority });
	} catch (e) {
		return next(e);
	}
});

// Admin: update report status
router.put('/:id', requireAdmin, async (req, res, next) => {
	try {
		const { status } = req.body;
		if (!['pending', 'in_review', 'resolved'].includes(status)) {
			return res.status(400).json({ message: 'Invalid status' });
		}
		const updated = await Report.findByIdAndUpdate(
			req.params.id,
			{ $set: { status } },
			{ new: true }
		);
		if (!updated) return res.status(404).json({ message: 'Report not found' });
		return res.json(updated);
	} catch (e) {
		return next(e);
	}
});

// Admin: delete a report
router.delete('/:id', requireAdmin, async (req, res, next) => {
	try {
		const deleted = await Report.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'Report not found' });
		return res.json({ success: true });
	} catch (e) {
		return next(e);
	}
});

export default router;



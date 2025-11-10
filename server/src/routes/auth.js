import express from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { connectToDatabase } from '../lib/db.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
	try {
		await connectToDatabase();
		// ensure default admin exists
		await Admin.seedDefaultAdminIfMissing();
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
		const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
		if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await admin.comparePassword(password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = jwt.sign(
			{ sub: admin.id, email: admin.email, role: 'admin' },
			process.env.JWT_SECRET || 'dev_secret',
			{ expiresIn: '7d' }
		);
		return res.json({ token, admin: { id: admin.id, email: admin.email } });
	} catch (e) {
		return next(e);
	}
});

export default router;



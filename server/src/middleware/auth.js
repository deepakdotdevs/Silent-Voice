import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) return res.status(401).json({ message: 'Missing token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
		req.admin = { id: payload.sub, email: payload.email };
		return next();
	} catch (e) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}



import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/db.js';
import reportsRouter from './routes/reports.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.json({ status: 'ok', service: 'SilentVoice API' });
});

app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);

app.use((err, req, res, next) => {
	// eslint-disable-next-line no-console
	console.error(err);
	res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

connectToDatabase()
	.then(() => {
		console.log('Connected to MongoDB successfully');
		app.listen(port, () => {
			// eslint-disable-next-line no-console
			console.log(`SilentVoice API listening on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		// eslint-disable-next-line no-console
		console.warn('Failed to connect to MongoDB, starting server without database:', error.message);
		console.log('Note: Database-dependent features may not work properly');
		app.listen(port, () => {
			// eslint-disable-next-line no-console
			console.log(`SilentVoice API listening on http://localhost:${port} (without database)`);
		});
	});



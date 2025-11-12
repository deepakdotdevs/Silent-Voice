import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/db.js';
import reportsRouter from './routes/reports.js';
import authRouter from './routes/auth.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
	console.error('Please create a .env file based on env.example');
}

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS for production
const corsOptions = {
	origin: process.env.CLIENT_URL || '*',
	credentials: true,
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

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

// For Vercel serverless deployment
if (process.env.VERCEL) {
	connectToDatabase()
		.then(() => {
			console.log('Connected to MongoDB successfully');
		})
		.catch((error) => {
			console.warn('Failed to connect to MongoDB:', error.message);
		});
} else {
	// For local development
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
}

// Export for Vercel serverless
export default app;



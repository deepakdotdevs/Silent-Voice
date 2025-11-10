import mongoose from 'mongoose';

const defaultMongoUri = 'mongodb://127.0.0.1:27017/silentvoice';

export async function connectToDatabase() {
	const mongoUri = process.env.MONGO_URI || defaultMongoUri;
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		autoIndex: true
	});
	return mongoose.connection;
}



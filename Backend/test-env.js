import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

console.log('Environment variables loaded:');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
console.log('PORT:', process.env.PORT || 3000);
console.log('NODE_ENV:', process.env.NODE_ENV);

import express from 'express';
import router from './route/routes.js';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
const frontURL = process.env.FRONTEND_URL  || "http://localhost:5173"; 

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(cors({origin:frontURL,credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use('/uploads', express.static('uploads'));

export default app;
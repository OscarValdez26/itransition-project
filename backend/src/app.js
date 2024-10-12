import express from 'express';
import router from './route/routes.js';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(router);

export default app;
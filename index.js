import express from "express";
import * as dotenv from 'dotenv'
dotenv.config()
import {errorHandler} from './protection/error.js'
import morgan from 'morgan'
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from "./protection/jwt.js";
const app = express();
const api_url = process.env.API_URL

// middleware
app.use(cors())
app.use(jwt())
app.options('*', cors())
app.use(express.json());
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(errorHandler)

import productsRouter from './Routers/productsRouter.js'
import catagoriesRoute from './Routers/catagoriesRoute.js'
import userRouter from './Routers/userRoutes.js'
import Order_items from "./Models/Order_items.js";



// ROutes
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/category', catagoriesRoute)
app.use('/api/v1/orders', Order_items)
app.use('/api/v1/users', userRouter)


const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test';


mongoose.connect(process.env.MONGO_URL, {
})
.then(() => {
    console.log('Connected to Mongo!');
})
.catch((err) => {
    console.error('Error connecting to Mongo', err);
});

if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
}


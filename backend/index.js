const express=require("express");
const cors= require('cors');
const mongoose = require('mongoose');
const path=require('path');
const cookieParser = require('cookie-parser');
const useRoutes=require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const producRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();
const PORT= process.env.PORT || 5000;

const connectDB=require('./config/db');
connectDB();

const app =express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/auth',useRoutes);
app.use('/categories', categoryRoutes);
app.use('/product',producRoutes);
app.use('/order',orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


 app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}.`);
 });

const express=require("express");
const cors= require('cors');
const mongoose = require('mongoose');
const path=require('path');
const cookieParser = require('cookie-parser');

//utils
const connectDB = require('./config/db.js');
const  userRoutes = require('./routes/userRoutes.js');
const categoryRoutes= require('./routes/categoryRoutes.js');
const productRoutes=require('./routes/productRoutes.js');
const Category = require("./models/categoryModel.js");
const orderRoutes = require('./Routes/orderRoutes.js');


require('dotenv').config();
const PORT= process.env.PORT || 5000;

connectDB();

const app =express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/auth',userRoutes);
app.use('/category',categoryRoutes);
app.use('/product',productRoutes);
app.use('/orders',orderRoutes);



app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
 app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}.`);
 });

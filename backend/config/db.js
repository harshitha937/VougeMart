const mongoose =require("mongoose");
require('dotenv').config();
const DB_URI= process.env.DB_URI || 'mongodb://127.0.0.1:27017/VougeMart';

const connectDB= async()=>{
    try{

        await mongoose.connect(DB_URI);
        console.log("Successfully connected to DB.");
    }
    catch(error){
        console.log(`Error :${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;

const jwt = require('jsonwebtoken');
require('dotenv').config();
secreyKey=process.env.JWT_SECRET || 'hshfu288290';
const generateToken = (res, userId,role) => {
  const token = jwt.sign({ userId ,role}, secreyKey, {
    expiresIn: "30d",
  });

 
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  console.log('Generating token and setting cookie');

  return token;
};

module.exports=generateToken;

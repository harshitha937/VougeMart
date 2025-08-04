// utils/createToken.js
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
 
  const token = jwt.sign({ userId }, process.env.JWT_SECRET ||'hshfu288290' , {
    expiresIn: '30d',
  });
 console.log("JWT_SECRET:", process.env.JWT_SECRET); // Should not be undefined

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // ✅ Return the token so it can be included in response
  return token;
};

module.exports = generateToken;
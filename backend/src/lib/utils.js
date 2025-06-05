import jwt from 'jsonwebtoken';
export const generateToken = (userId,res) => {
 const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
   expiresIn: '6d',
 });

 res.cookie("jwt",token,{
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,// Prevents XSS client-side JavaScript from accessing the cookie
    sameSite:"Strict", // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
 })

 return token;
}
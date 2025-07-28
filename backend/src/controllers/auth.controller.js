import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  // Handle user signup
  const { fullName,email,password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: 'Failed to create new user.' });
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};


export const login = async(req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }
    await bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid Credentials.' });
        }
        // generate jwt token here
        generateToken(user._id, res);
        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
        });
      });
  }
  catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};


export const logout = (req, res) => {
  try{
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration date to the past
    });
    res.status(200).json({ message: 'Logged out successfully.' });
  }
  catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};


export const updateProfile = async (req, res) => {
    try{
      const {profilePic} = req.body;
      const userid = req.user._id;
      if (!profilePic) {
        return res.status(400).json({ message: 'Please provide a profile picture.' });     return res.status(404).json({ message: 'User not found.' });
      }
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'profile_pics',
      width: 150,
      height: 150,
      crop: 'fill',// Fill the entire image
    });
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select('-password'); // Exclude password from the response
  res.status(200).json(updatedUser);
  }catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });  
  }
};


export const checkAuth = (req, res) => {
  try {
     res.status(200).json(req.user);  
  } catch (error) {
    console.error('Check auth error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
}
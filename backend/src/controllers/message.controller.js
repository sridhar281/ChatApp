import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import mongoose from 'mongoose';
import { io, getReceiverSocketId } from '../lib/socket.js';  // ← Add this import

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, video } = req.body;  // Updated: Add video
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log('sendMessage request:', { text, image: image ? 'present' : 'none', video: video ? 'present' : 'none', receiverId, senderId });

    // Validate inputs
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid sender ID' });
    }
    if (!text && !image && !video) {  // Updated: Include video
      return res.status(400).json({ error: 'Message text, image, or video is required' });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ error: 'Receiver not found' });
    }

    let imageUrl = '', videoUrl = '';  // Updated: Separate vars

    // Image upload (existing)
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'chat_media',
          resource_type: 'image',
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error('Image upload error:', error);
        imageUrl = '';
      }
    }

    // New: Video upload
    if (video) {
      try {
        console.log('Attempting Cloudinary video upload...');
        const uploadResponse = await cloudinary.uploader.upload(video, {
          folder: 'chat_media',
          resource_type: 'video',  // Key change
          transformation: [{ quality: 'auto:good' }],  // Optimize video
        });
        videoUrl = uploadResponse.secure_url;
        console.log('Video upload successful:', videoUrl);
      } catch (error) {
        console.error('Video upload error:', error);
        videoUrl = '';
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || '',
      image: imageUrl,
      video: videoUrl,  // New
    });

    await newMessage.save();
    console.log('Message saved:', newMessage);

    // Real-time emit (existing)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};
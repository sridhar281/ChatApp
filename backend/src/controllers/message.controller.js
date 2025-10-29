import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from 'cloudinary';

// === SEND MESSAGE ===
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ error: "Message content is required" });
    }

    let imageUrl = "";
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = uploaded.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// === GET MESSAGES ===
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// === GET USERS FOR SIDEBAR ===
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// === DELETE MESSAGE ===
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ error: "Server error" });
  }
};
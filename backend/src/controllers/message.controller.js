import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; 
        // Assuming req.user is set by the protectRoute middleware
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select('~password') // Select only the fields needed for the sidebar
            .lean()
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Error fetching users for sidebar:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages= async (req, res) => {
    try{
        const{id:userToChatId}= req.params;
        const myId = req.user._id; // Assuming req.user is set by the protectRoute middleware
        const messages = await Message.find({ 
            $or: [
                { senderId: senderId, receiver: userToChatId }, 
                { senderId: userToChatId, receiverId: myId }] 
    })
    res.status(200).json(messages);
    }
    catch(error){
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // Extract receiverId from the request parameters
        const senderId = req.user._id; // Assuming req.user is set by the protectRoute middleware
        const { text, image, video } = req.body; // Extract message content from the request body
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image,
            video
        });

        await newMessage.save();
        //todo: realtime functionality goes here =>socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}   
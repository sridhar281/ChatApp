import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
        default: ''
    },
    video: {
        type: String,
        default: ''
    },
}, 
{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
// This schema defines the structure of the message document in the MongoDB database
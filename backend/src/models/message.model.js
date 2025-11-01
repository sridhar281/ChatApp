import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},

  receiverId: 
  { type: mongoose.Schema.Types.ObjectId,
     ref: 'User', required: true 
    },

  text: { type: String, 
    default: '' 
},

  image: 
  { type: String

   }, 
  video:
   { type:
     String
     },  
  reactions: [{  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emoji: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
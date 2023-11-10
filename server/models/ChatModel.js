import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
    {
  orderId: {
    type: String,
    required: true,
  },
  messages: [    
    {
      user: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

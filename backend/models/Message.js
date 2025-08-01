import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: String }, // can be userId or 'anonymous'
    receiver: { type: String }, // can be userId or roomId
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);

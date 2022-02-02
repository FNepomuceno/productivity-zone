import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    googleId: { type: String, default: null },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const userModel = mongoose.model('User', userSchema);
export default userModel;

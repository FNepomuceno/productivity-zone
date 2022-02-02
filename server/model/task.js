import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    description: { type: String },
    dueDate: { type: Date },
    creationTime: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
});

const taskModel = mongoose.model('Task', taskSchema);
export default taskModel;

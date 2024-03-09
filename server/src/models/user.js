import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks: [{
        taskname: { type: String, unique: true},
        completion: { type: Boolean },
        filepath: {type: String },
        filetype: {type: String },
    }]
});

const user = model('user', userSchema);
export default user;
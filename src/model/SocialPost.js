const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, },
    media: [
        {
            data: { type: String, required: true },
            type: { type: String, required: true }
        }
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
    },
    //   sharedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, 
}, {
    timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

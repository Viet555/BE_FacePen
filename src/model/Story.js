const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    media: {
        type: String, required: true
    },
    caption: {
        type: String, default: ''
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', StorySchema);

module.exports = Story;

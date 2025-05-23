const mongoose = require('mongoose');

const StoryArchiveSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    media: [{ type: String }],
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
    },
    caption: { type: String, default: '' },
    originalExpiresAt: { type: Date }
}, { timestamps: true });

const StoryArchive = mongoose.model('StoryArchive', StoryArchiveSchema);
module.exports = StoryArchive;

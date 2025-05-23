const mongoose = require('mongoose');

const StoryCollectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StoryArchive' }],
    cover: { type: String }
}, { timestamps: true });
// tutu lam met quas
const StoryCollection = mongoose.model('StoryCollection', StoryCollectionSchema);

module.exports = StoryCollection

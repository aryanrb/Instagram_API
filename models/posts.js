const mongoose = require('mongoose');

const loveSchema = new mongoose.Schema({
    loveBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

const commentSchema = new mongoose.Schema({
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String
    }
}, {timestamps: true});


const postSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true
    },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postByName: {
        type:String,
    },
    subHead: {
        type: String,
    },
    caption: {
        type: String,
    },
    authorPic: {
        type: String
    },
    loveReacts: [loveSchema],
    loveCount: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
}, { timestamps: true});

module.exports = mongoose.model('Post', postSchema);


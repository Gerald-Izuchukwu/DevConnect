const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    text : {
        type : String,
        required : true
    },
    name : {
        type : String
    },
    avatar : {
        type : String
    },
    likes : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref : 'Users'
            }
        }
    ],
    comment : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref : 'Users'
            },
            text : {
                type : String,
                required : true
            },
            avatar :{
                type : String
            },
            date : {
                type : Date,
                default : Date.now
            }
        }
    ],

    date : {
        type : Date,
        default : Date.now
    }
})

module.exports = Post = mongoose.model('Post', PostSchema)
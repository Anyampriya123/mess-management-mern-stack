    const mongoose = require('mongoose');
    const messageschema = new mongoose.Schema({
        message:{
            type:String,
        },
        content:String,
        createdAt:{type:Date,default:Date.now},
    });

const Messages = mongoose.model('Messages',messageschema)
module.exports =  Messages;
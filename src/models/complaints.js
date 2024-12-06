const mongoose = require('mongoose')

const complaintschema = new mongoose.Schema({
    studentname:{
        type:String,
    },
    email:{
        type:String,
    },
    idnumber:{
        type:String,
    }, 
    complaint:String,
    image: {
        data: Buffer,
        contentType: String
    }
});

const Complaints = mongoose.model('Complaints',complaintschema)

module.exports = Complaints;
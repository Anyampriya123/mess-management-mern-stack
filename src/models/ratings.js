
const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  email:{type: String, required: true },
    Username:String,
    mess: String,
    month: String,
    dateRange: String,
    quantity: Number,
    quality: Number,
    timeliness: Number,
    cleanliness: Number,
    washing: Number,
    behavior: Number,
    remarks: String,
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);
  
  module.exports = Feedback; 
  


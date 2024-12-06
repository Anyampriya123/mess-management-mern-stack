const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const allowedEmails = [
    's190807@rguktsklm.ac.in',
    's190724@rguktsklm.ac.in',
    's190607@rguktsklm.ac.in',
    's190313@rguktsklm.ac.in',
    's190866@rguktsklm.ac.in',
    's190249@rguktsklm.ac.in',
    's191073@rguktsklm.ac.in',
  ];

const admin = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
          validator: function (v) {
            // Check if the provided email is in the list of allowed emails
            return allowedEmails.includes(v);
          },
          console
        }
      },
      password:{
        type:String,
        required:true
      },
      name:{
        type:String,
        required:true
      }
});


const admin_Register = new mongoose.model('admin_Register',admin);
module.exports = admin_Register;
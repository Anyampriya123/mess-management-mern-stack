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

const user = new mongoose.Schema({
  idnumber:{
    type:String,
    required:true,
    unique:true
  },
  branch:{
    type:String,
    required:true,
  },
  year:{
    type:String,
    required:true,
  },
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


const Register = new mongoose.model('Register',user);
module.exports = Register;
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/mernbackend",{
  
}).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log('not connected');
}) 
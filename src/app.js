const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');


app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: true,
    })
  );
  
  // Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: 'YOUR_GOOGLE_CLIENT_ID',
        clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // Save user information in your database or session
        done(null, profile);
      }
    )
  );
  
  // Serialize and deserialize user (required for session)
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  
  // Google Auth Routes
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Redirect after successful login
      res.redirect('/dashboard');
    }
  );

const storage = multer.memoryStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userimages'),function(error,sucess){
            if(error) throw error
        })
    },
    filename:function(req,file,cb){
       const name = Date.now()+'-'+file.originalname;
       cb(null,name,function(error1,success1){
        if(error1) throw error1
       })
    }
});

const upload = multer({storage:storage})

// Use process.env.JWT_SECRET for signing tokens



const SECRET_KEY = 'your_secret_key'

require("./db/conn");
const Register = require("./models/registers");
const admin_Register = require('./models/admin_register')
const Feedback = require('./models/ratings')
const Complaints = require('./models/complaints')
const Messages = require('./models/message');
const { log, error } = require('console');
const port = process.env.PORT || 8000 ;

const static_path = path.join(__dirname,'../public');
const templates_path = path.join(__dirname,'../templates/views')
const partials_path = path.join(__dirname,'../templates/partials')

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set('view engine', 'hbs')
app.set('views',templates_path)
hbs.registerPartials(partials_path)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/user-profile' }),
        cookie: { secure: false },
    })
);

app.get('/', (req,res)=>{
    res.render('index')

});
// app.get('/user_dashboard',(req,res)=>{
//     res.render('user_dashboard')
// })
app.get('/register', (req,res) => {
    res.render('register')
}); 


app.get('/login', (req,res) => {
    res.render('login')
});
app.get('/complaint', (req,res) => {
    res.render('complaint')
}); 
// app.get('/thankyou', (req,res) => {
//     res.render('thankyou')
// });
 

app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/admin_register', (req,res) => {
    res.render('admin_register')
});


app.get('/admin_login', (req,res) => {
    res.render('admin_login')
});


app.get('/sorry_template',(req,res)=>{
    res.render('sorry_template')
})
app.get('/menu',(req,res)=>{
    res.render('menu')
})
app.use(express.static(path.join(__dirname, 'public')));


app.post('/register', async(req,res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const studentdetails = new Register({
                branch:req.body.branch,
                year:req.body.year,
                idnumber:req.body.idnumber,
                email:req.body.email,
                password:req.body.password,
                name:req.body.name,

            })
             await studentdetails.save();
           
        }
    }
    catch(error){
        res.status(400).send(error);
    }
});

app.post('/admin_register', async(req,res) => {
    try{
        const password = req.body.admin_password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const studentdetails = new admin_Register({
                email:req.body.email,
                password:req.body.admin_password,
                name:req.body.name,
            })
            const registered = await studentdetails.save();
            res.render(
                'admin_login'
            )
            
        }
      
    }
    catch(error){
        res.status(400).send(error);
    }
});


app.post('/login', async (req, res) => {

    try { 
        const user = await Register.findOne({ email: req.body.email });

      // Find user by email
     
      if (!user) {
        return res.status(400).send("Incorrect details");
      }
  
      // Compare password (assuming password is stored in plain text)
      if (user.password !== req.body.password) {
        
        return res.status(400).send("Wrong password");
      }
     
  
      // Generate JWT token
else{

    const user = await Register.findOne({ email: req.body.email });
    req.session.idnumber = user.idnumber;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.year = user.year;
    req.session.password = user.password;
    req.session.branch = user.branch;
    email = req.session.email ;
    const messages = await Messages.findOne()
    req.session.messages = messages.message;
    const update = req.session.messages
    if(!update){
      res.render('feedback')

    }
    else{
        res.render('feedback',{update})
    }
   
     // Optionally send token as JSON

}

  
      // Send the token in a cookie or as a response

  
    } catch (error) {
      res.status(500).send("An error occurred during login");
    }
  });
  app.get('/user_dashboard', (req, res) => {
    // Check if user is logged in
    if (!req.session.email) {
        return res.redirect('login');
    }
    // Render user details from session data
    const userDetails = {
        name: req.session.name,
        email: req.session.email,
        idnumber: req.session.idnumber,
        branch:req.session.branch,
        password:req.session.password,
        year: req.session.year , // Assuming 'year' is also stored in the session during login
    };

    res.render('user_dashboard', { user: userDetails });
});

  

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('login');
    });
});
app.post('/admin_login',async (req,res)=>{
    
    try{
        const check_admin = await admin_Register.findOne({email:req.body.email})
        if(check_admin.password === req.body.password){
            res.render('admin_dashboard')
                  
             }
        else{
            res.send("admin wrong password")
        }
    } 
    catch{
        res.send("incorrect details")
    }
});


// Route to render the admin dashboard with a list of users
// controllers/adminController.js

app.post('/feedback', async (req, res) => {
    try {
        if (!req.session.email) {
            return res.status(401).send('User not authenticated');
        }
        const feedback = new Feedback({
            email:req.session.email,
            Username:req.session.name,
            mess: req.body.mess,
            month: req.body.month,
            dateRange: req.body.dateRange,
            quantity: req.body.quantity,
            quality: req.body.quality,
            timeliness: req.body.timeliness,
            cleanliness: req.body.cleanliness,
            washing: req.body.washing,
            behavior: req.body.behavior,
            remarks: req.body.remarks ,
          });
          
          await feedback.save();
          res.render('thankyou')
    

        // Aggregate averages for feedback fields

        // Pass the data to the Handlebars template
    } catch (error) {
        res.status(500).render('sorry_template', { error: 'Error retrieving feedback summary' });
    }
});

app.post('/complaint', upload.single('image'),async(req,res)=>{
    
    try{    
    
        // Render user details from session data
    
            
        const base64Image = req.file.buffer.toString('base64');
        const complaints = new Complaints
        
        ({
            studentname:req.body.studentname,
            idnumber:req.body.studentidnumber,
            email:req.body.studentemailaddress,
            complaint:req.body.complaint,
            name: req.file.originalname,
            image: {
                data: base64Image,
                contentType: req.file.mimetype
           }
        })
        await complaints.save()
        
        res.render('sorry_template' )
        

    }
    catch(error){
        res.send(error)
    }
});

app.get('/admin_complaints',async (req,res)=>{
  
    try {
        // Fetch all complaints from MongoDB
        const complaints = await Complaints.find();
        
        // Convert image data to Base64 URL for each complaint
        const complaintsWithImages = complaints.map(complaint => ({
          ...complaint._doc,  // Spread other fields like `_id`, `complaint`, etc.
          imageUrl: complaint.image.data
            ? `data:${complaint.image.contentType};base64,${complaint.image.data}`
            : null
        }));
    
        // Render the admin-dashboard view, passing complaints with image URLs
        res.render('admin_complaints', { complaints: complaintsWithImages });
      }catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).send('An error occurred while fetching complaints.');
      }
     

})



app.post('/message', async(req,res)=>{
    try{
        const messages = new Messages({
            message:req.body.message,

        })      
       await messages.save();
       res.render('admin_dashboard')
    }
    catch(error){
        console.log(error)
    }
})

app.get('/admin_dashboard_users',async(req,res)=>{
    try {
        const users = await User.find();
        res.render('admin_dashboard_users', {users});
        
      } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error retrieving users');
      }       
});

app.get('/admin_ratings',async(req,res)=> {
    try{    
        const averages = await Feedback.aggregate([
            {
              $group: {
                _id: null,
                avgQuantity: { $avg: "$quantity" },
                avgQuality: { $avg: "$quality" },
                avgTimeliness: { $avg: "$timeliness" },
                avgCleanliness: { $avg: "$cleanliness" },
                avgWashing: { $avg: "$washing" },
                avgBehavior: { $avg: "$behavior" },
              }
            }
          ]);
      
          // Render the admin dashboard with the calculated averages
          if (averages.length > 0) {
            const ratings = await Feedback.find();
            res.render('admin_ratings',{ratings, averages: averages[0] });
          } 
  

    }
    catch(error){
        console.error(error);
        res.status(500).send('Error retrieving ratings');

    }
});

const User = require('./models/registers');
const { register } = require('module');
const { stringify } = require('querystring');

// Route to get users and render them  the dashboard
 


app.listen(port,()=>{
    console.log('server is running at port no '+port);
});
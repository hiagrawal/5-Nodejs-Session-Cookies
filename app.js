const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://MongoDbUser:MongoDbUser@cluster0.kij6e.mongodb.net/shopMongoDb?retryWrites=true&w=majority';

const app = express();
const store = MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my secret', resave: false, saveUninitialized: false, store: store}));
//secret will be used for signing the hash which will be used to secretly store our id in the cookie
//resave and saveUninitialized is used for performance that is do not save the session everytime till there is no change in the session value
//store is used to define where it needs to store to which we have given mongodb
//if not given anything, then by default stores in memory
//this third party pkg setsup the cookie automatically that we see in browser

//lets create the user only when we are logged in.. so will move this code to auth.js file
//when we assign in session in auth controller, it does not automatically add all the methods that mongoose provides 
//and that we add like addToCart and all and hence will have to add in req.user again that we did earlier
// to get access to all the methods
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Hina',
          email: 'test@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

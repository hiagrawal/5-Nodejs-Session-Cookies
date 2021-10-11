const User = require('../models/user');

exports.getLogin = (req, res, next) => {

    //when using cookies
    // console.log(req.get('Cookie'));
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1];
    // console.log(isLoggedIn);

    //when using session
    console.log(req.session);
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {

    //when using cookies
    //res.setHeader('Set-Cookie', 'loggedIn=true');
    //res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');

    //when using session
    //req.session.isLoggedIn = true;
    //session is a object provided by third party express-session pkg in request object
    //this will add a new cookie in the browser with the name connect.isd (can check the same in application cookie tab)
    //and this hash value will identify the user (the browse in session) to the server
    //by default it is a session cookie so it will expire when we close the browser
    //by doing this, we stored it on the server side in the memory by default 
    //and this session is identified by the browser through the connect.isd cookie
    //so if we login into another browser, that we will be treated as new session/new user a
    //nd we will get req.session.isLoggedIn as undefined
    //so this way we can save across requests but not across users
    //it uses a cookie to identify the user
    //currently we are storing in memory which is not recommended as a security point as well as 
    //if data becomes huge, it affects the performance also, so now we wil store it in db

    
        User.findById('6161733cd2ec6bef280e800f')
          .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
          })
          .catch(err => console.log(err));
    

    
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
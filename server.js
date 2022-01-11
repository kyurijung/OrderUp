// Require all modules and initial setup
const express = require('express');
const session = require('express-session');
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongo");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Import all schemas from the models folder
const User = require('./models/userModel');
const Sessions = require('./models/sessionModel');
const Order = require('./models/orderModel');
// For mongoose randomly generated IDs
const { ObjectId } = require('bson');

// Global variables
let loggedInID = 0;
let loggedInUsername = "";

// Setting up a new session collection
const mongoStore = new MongoDBStore({
    mongoUrl: 'mongodb://localhost:27017/a4',
    collection: 'sessions'
});

// Middleware
app.set(path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name: 'a4-session',
    secret: 'some secret',
    store: mongoStore,
    resave: true,
    saveUninitialized: false
}));
// Used to log current requests (for testing)
app.use(function(req,res,next) {
    console.log(`${req.method}: ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Body:');
        console.log(`${req.body}`);
    }
    next();
});

// Set up the routes
// Home page: Shows different views based on whether a session is active or not (logged in or not)
app.get('/', function(req,res) {
    db.collection('sessions').count(function(err,count) {
        if (err) throw err;
        if (count == 0) {
            res.render('home');
        } else {
            res.render('userHome',{'id': loggedInID});
        }
    });
});
// Logs in a user into a new session given that they meet all requirements
app.post('/login', function(req,response) {
    let userToFind = req.body;
    db.collection('users').findOne({$and:[{ username: userToFind.username },{ password: userToFind.password }]}, function(err,res) {
        if (err) throw err;
        if (res) {
            loggedInID = res._id;
            loggedInUsername = res.username;
            let session = new Sessions({
                _id: res._id,
                username: userToFind.username,
                password: userToFind.password
            },{
                collection: 'sessions'
            });
            session.save();
            response.status(200);
            response.send("Successfully logged in!");
        } else {
            response.status(400);
            response.send("Bad Request Error 400: Incorrect username or password.");
        }
    });
});
// Logs out user and deletes the active session
app.post('/logout', function(req,res) {
    db.collection('sessions').deleteMany(function(err,res) {
        if (err) throw err;
        loggedInID = 0;
        loggedInUsername = '';
    });
    res.status(200);
    res.send("Log out successful!");
});
// Displays a list of public users and link to their profiles
app.get('/users', function(req,res) {
    db.collection('sessions').count(function(err,count) {
        if (err) throw err;
        db.collection('users').find({privacy:false}).toArray(function (err,result) {
            if (err) throw err;
            if (count == 0) {
                res.render('users', {'userList':result});
            } else {
                res.render('userUsers', {'userList':result,'id': loggedInID});
            }
        });
    });
});
// Registers users into the users collection with a newly generated _id and logs them in if they have registerd
app.post('/users', function(req,response) {
    let newUser = req.body;
    db.collection('users').findOne({username:newUser.username}, function(err,res) {
        if (res) {
            response.status(400);
		    response.send("Bad Request Error 400: Username already taken!");
        } else {
            loggedInID = mongoose.Types.ObjectId();
            loggedInUsername = newUser.username;
            newUser._id = JSON.stringify(loggedInID).replace(/["]+/g,'');
            // Add to users collection here
            let user = new User({
                _id: newUser._id,
                username: newUser.username,
                password: newUser.password,
                privacy: newUser.privacy
            },{
                collection: 'users'
            });
            user.save();
            // Log in user to a session here
            let session = new Sessions({
                _id: newUser._id,
                username: newUser.username,
                password: newUser.password
            },{
                collection: 'sessions'
            });
            session.save();
            response.status(200);
            response.send(newUser._id);
        }
    });
});
// Displays the register user page
app.get('/register', function(req,res) {
    res.render('register');
});
// Displays the restaurant menu
app.get('/orderform', function(req,res) {
    db.collection('sessions').findOne({},function(err,result){
        if (err) throw err;
        res.render('orderform',{'id':loggedInID,'username':result.username});
    });
});
// Displays each user's profile given their unique _id if they are public profiles
app.get('/users/:id', function(req,res) {
    let id = req.params.id;
    // First find the results of the user we want to find with their _id
    db.collection('users').findOne(ObjectId(id), function(error,result) {
        // Second find their orders in the database by matching the orders with their usernames
        db.collection('orders').find({username:result.username}).toArray(function(err,list) {
            // If they are NOT logged in
            if (loggedInUsername == "") {
                if (result.privacy == false) {
                    res.status(200);
                    res.render('profile', {'id':id,'user':result,'orderList':list});
                } else {
                    res.status(404);
                    res.send("Not Found Error 404: The user's profile is private.");
                }
            // Else if they ARE logged in
            } else {
                if (result.privacy == true && result._id != JSON.stringify(loggedInID).replace(/["]+/g,'')) {
                    console.log(loggedInID);
                    res.status(404);
                    res.send("Not Found Error 404: The user's profile is private.");
                } else {
                    res.status(200);
                    res.render('userProfile', {'id':id,'user':result,'orderList':list,'yourID':loggedInID});
                }
            }
        });
    });
});
// Updates the user's privacy setting from the users collection
app.post('/privacy', function(req,res) {
    let theUser = req.body;
    db.collection('users').findOneAndUpdate({username:theUser.username},{$set:{privacy:theUser.privacy}},{new:true}, function(err,result) {
        if (err) throw err;
        res.status(200);
        res.send(JSON.stringify(result.value._id).replace(/["]+/g,''));
    });
});
// Adds user's orders and posts them to an orders collection
app.post('/orders', function(req,res) {
    let newOrder = req.body;
    let orderID = mongoose.Types.ObjectId();
    newOrder._id = JSON.stringify(orderID).replace(/["]+/g,'');
    
    let order = new Order({
        _id: newOrder._id,
        username: newOrder.username,
        order: newOrder.order
    },{
        collection: 'orders'
    });
    order.save();
    res.sendStatus(200);
});
// Displays the a single order that a user made (if they are public)
app.get('/orders/:id', function(req,res) {
    let id = req.params.id;
    db.collection('orders').findOne(ObjectId(id), function(error,result) {
        if (error) throw error;
        if (loggedInUsername == "") {
            res.status(200);
            res.render('order', {'username':result.username,'fullOrder':result.order});
        } else {
            res.status(200);
            res.render('userOrder', {'username':result.username,'fullOrder':result.order,'yourID':loggedInID});
        }
    });
});

// Initialize database connection and run server
mongoose.connect('mongodb://localhost:27017/a4', {useNewUrlParser: true,useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // Start the server
    app.listen(PORT);
    console.log(`Listening on port ${PORT} @ http://localhost:${PORT}/`);
});
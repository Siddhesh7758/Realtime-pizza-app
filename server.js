require('dotenv').config()

const express = require('express')

const app = express()

const ejs = require('ejs')

const path = require('path')

const expressLayout = require('express-ejs-layouts')
const { setupMaster } = require('cluster')

const PORT = process.env.PORT || 3000

const mongoose = require('mongoose')

const session = require('express-session')

const flash = require('express-flash')

const connectMongo = require('connect-mongo')

const MongoStore = connectMongo(session);


//database connection 

const url = 'mongodb+srv://Siddhesh:vQvMhjV6iAkTDrdW@demo.gexqp.mongodb.net/pizza';

mongoose.connect(url, {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
    useFindAndModify: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected');
}).catch(err => {
    console.log('Connection failed')
});


//session store
let mongoStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
})


//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 *24} // 24 hours

}))

app.use(flash())

//assests
app.use(express.static('public'))
app.use(express.json())

//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


//routes
require('./routes/web')(app) //call function

/////////////
app.listen(PORT, () => {  
    console.log(`Listening on port ${PORT}`)
})



const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const cors = require("cors");
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const db = require("./models/index");

const errorHandler = require('./middleware/errorHandler');
const routerUser = require("./routers/users");
const routerAuth = require("./routers/auth");
const routerPostActivity = require("./routers/postActivity");
const routerPostGame = require("./routers/postGame");
const routerChat = require("./routers/chat");
const routParticipate = require("./routers/participate");
const routerStore = require("./routers/store");
const routerNotification = require("./routers/notification");

require('dotenv').config();

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and resync DB");
//   });

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//init passport
app.use(passport.initialize());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Worapakorn Jarusiriphot application." });
});

app.get('/testnotification', (req, res) => {
  // req.user send users id to send notification to 


  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/api/auth', routerAuth);
app.use('/api/users', routerUser);
app.use('/api/postActivity', routerPostActivity);
app.use('/api/postGame', routerPostGame);
app.use('/api/chat', routerChat);
app.use('/api/participate', routParticipate);
app.use('/api/store', routerStore);
app.use('/api/notification', routerNotification);




app.use(errorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
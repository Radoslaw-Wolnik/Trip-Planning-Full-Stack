# Backend documentation

## Introduction
*This is backend for trip managing website*  
*Go to [main README](../README.md) for more general information*  

#### FUNCTIONS
 - backend - communicate with frontend and keep everything together
 - redis just helsp with communication between backend and socketio mainly in updateTrip function when two or more users edit the same trip
 - socketio is for realtime editing of trip by multiple users - creates socket and propagates events
 - mongoDB - database with defined schemas in /backend/src/models and users in backend/init-monog.js
 - sending mails using (rn) brevo for verifing accounts and recovering accounts
 - proper endpoint for frontend backend/src/routs and /backend/src/app.js

#### DISCLAIMER  
normally socketio would be part of the backend but to learn i made more complex build  
Also socket would be open and then closed after some time but in this project it is open if two or more users are editning the same trip (more db writes less sockets open for one user)

#### additional for dev
if one wants to use project without email verification one needs to comment out  
/main-dir/backend/src/userController  
login: to not check if verified email in db  
register: to not send an email  

## Technologies Used:
 - **Framework:** Express
 - **Language** Javascript (will chnage to TS in future)
 - **Modules:** ECMAScript 6 (ES6) module system (import insted of require)

## Docker containers:
 - **redis** - for better communication between containers (rn socketio and backend)
 - **mongoDB** - database curren schemas User, Trip and ExpiredTokens
 - **socketio** - the realtime communication, could be part of backend but for practice it's not
 - **backend** - server

<details>
<summary><h2>Structure:</h2></summary>

``` bash
my-fullstack-app/
├── backend/
│   ├── .env.development
│   ├── .env.production
│   ├── Dockerfile
│   ├── Dockerfile.socketio
│   ├── init-mongo.js
│   ├── nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   ├── populateDB.js
│   ├── README_backend
│   ├── node_modules/
│   │   ├── ...
│   │   └── ...
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── bin/
│   │   │   └── www.js.reference
│   │   ├── config/
│   │   │   ├── enviorement.js
│   │   │   └── databse.js
│   │   ├── controllers/
│   │   │   ├── tripController.js
│   │   │   └── userController.js
│   │   ├── middleware
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── RevokedToken.js
│   │   │   ├── Trip.js
│   │   │   └── User.js
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── javascripts/
│   │   │   └── stylesheets/
│   │   │       └── style.css
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   └── index.js.reference
│   │   │   ├── tripRouts.js
│   │   │   └── userRouts.js
│   │   ├── socketio/
│   │   │   └── socketServer.js
│   │   ├── utils/
│   │   │   ├── cleanupRevokedTokens.js
│   │   │   ├── generateInvitationCode.js
│   │   │   ├── sendEmail.js
│   │   │   └── tokenExtractor.js
│   │   └── views/ # discarded - to remove
│   │       ├── error.pug
│   │       ├── index.pug
│   │       └── layout.pug
│   └── uploads/
│       ├── ...
│       └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── ...
```

### Key takes:
  - the main file is src/server.js as the main function of backend
  - all of the routes and settings are in app.js
  - init-mongodb creates users for database
  - Dockerfile.socketio and socketio/socketServer.js are all files needed for socket 
  - the main models: RevokedToken, User and Trip
  - uploads has profile pictures of users
  - databse.js has all logic to connect to the database
  - Dockerfile has thre stages - main stage, development stage, production stage the secend and third are just coping from main builder stage
  - middleware/auth for all things that user needs to be authenticate before
  - controllers are the important functions that do all of the logic behind the api calls from frontend
  - nodemon.json just to track changes during development
  - volume for mongodb data and uploads (not deleted when deleting containers but mounted directly from project tree)
</details>

## TODO:
- [ ] remove views
- [ ] rename api index
- [ ] enviorement variables check if work and are being managed properly
- [ ] populateDB.js properly - mby make things using website and then export
- [ ] https nisted of http
- [ ] Mby change from JS to TS
- [ ] check outdated node modules and install newer dependencies
- [ ] make routine to delete revokedTokens
- [ ] make routine to delete previous profile picture or delete previous ones on upload
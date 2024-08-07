# Backend documentation

## Introduction
*This is backend for trip managing website*  
*Go to [main README](../README.md) for more general information*

#### FUNCTIONS
 - 
 - 
 - 

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
  - 
  - 
</details>

## TODO:
- [ ] remove views
- [ ] rename api index
- [ ] enviorement variables properly manage
- [ ] populateDB.js proper - mby make things using website and then export
- [ ] https

# Backend Documentation

## Introduction

This is the backend for our trip managing website. For more general information, see the [main README](../README.md).

#### Important
normally socketio would be part of the backend but to learn i made more complex build  
Also socket would be open and then closed after some time but in this project it is open if two or more users are editning the same trip (more db writes less sockets open for one user)

## Features
 - backend - communicate with frontend and keep everything together
 - redis just helsp with communication between backend and socketio mainly in updateTrip function when two or more users edit the same trip
 - socketio is for realtime editing of trip by multiple users - creates socket and propagates events
 - mongoDB - database with defined schemas in /backend/src/models and users in backend/init-monog.js
 - sending mails using (rn) brevo for verifing accounts and recovering accounts
 - proper endpoint for frontend backend/src/routs and /backend/src/app.js


## Technologies Used

- Node.js
- Express + ES6
- MongoDB
- Redis
- Socket.IO

## Development Workflow

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`

#### No email provider
To use without external email verification
/main-dir/backend/src/userController  
login: to not check if verified email in db  
register: to not send an email  

## Project Structure

<details>
<summary>see structure tree</summary>

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

## API Documentation

Go [here](API_documentation.md) for API documentation

## Contributing

If you'd like to contribute to the backend of this project, please follow these guidelines:

1. Ensure your code adheres to the project's coding standards and conventions.
2. Write or update tests for any new or modified functionality.
3. Run the backend tests using npm test.
4. Document any new or changed API endpoints in the API Documentation section.
5. Submit a pull request with a clear description of your changes and their purpose.

Your contributions will be reviewed, and we appreciate any improvements that help enhance the backend functionality and learning experience.

## TODO:
- [ ] rename api index
- [ ] populateDB.js properly - mby make things using website and then export
- [ ] check outdated node modules and install newer dependencies
- [ ] delete previous profile picture on upload of a new one